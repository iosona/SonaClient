import { createContext, FC, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { EmitEvent, EventData, EventHandler, SocketContextType } from './SocketProvider.types';
import { logger } from '@renderer/logger';
import { IServerInfo } from '@renderer/types';

export const SocketContext = createContext<SocketContextType>({} as SocketContextType);

export const SocketProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(socket?.connected || false);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  const disconnectServer = (resetAuth: boolean = false) => {
    if (!socket) return;
    socket.removeAllListeners();
    socket.close();
    setSocket(null);
    if (resetAuth) {
      setIsAuthed(false);
    }
  }

  const connectServer = async (serverInfo: IServerInfo): Promise<boolean | undefined> => {
    disconnectServer();
    
    return new Promise((resolve) => {
      const serverUrl = `http://${serverInfo.ip}:${serverInfo.port}`
      const ioClient = io(serverUrl, {
        autoConnect: true,
        query: {
          masterPassword: serverInfo.masterPassword
        }
      });

      const onConnect = () => {
        setIsConnected(true);
        setIsAuthed(true);
        resolve(true);
        logger.success(`Connected to Signal Server: ${ioClient.id}`);
      }

      const onDisconnect = () => setIsConnected(false);

      ioClient.on('connect', onConnect);
      ioClient.on("connect_error", (err) => {
        if (err.message.includes("Unauthorized")) {
          disconnectServer();
          resolve(undefined);
        }
        else {
          resolve(false);
        }
      })
      ioClient.on('disconnect', onDisconnect);

      setSocket(ioClient);
    })
  }

  const subscribeEvent = (event: EmitEvent, handler: EventHandler) => {
    if (!isConnected || !socket) return;
    socket.on(event, handler);
  }

  const unsubscribeEvent = (event: EmitEvent, handler: EventHandler) => {
    if (!socket) return;
    socket.off(event, handler);
  }

  const emitEvent = (event: EmitEvent, data: EventData) => {
    if (!isConnected || !socket) return;
    socket.emit(event, data);
  }

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected,
      isAuthed,
      subscribeEvent,
      unsubscribeEvent,
      emitEvent,
      connectServer,
    }}>
      {children}
    </SocketContext.Provider>
  );
}