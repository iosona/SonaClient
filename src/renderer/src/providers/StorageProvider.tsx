import { logger } from '@renderer/logger';
import { Client, MessageItem } from '@renderer/types';
import { createContext, Dispatch, FC, SetStateAction, useState } from 'react';

export interface StorageContextType {
  clients: Client[];
  createClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
  setClients: Dispatch<SetStateAction<Client[]>>;
  resetData: () => void;
  setRoomId: Dispatch<SetStateAction<string | null>>;
  findClientById: (id: string) => Client | null;
  roomId: string | null;
  getSharingClient: () => Client | null;
  isMuted: (id: string) => boolean;
  updateClient: (id: string, key: keyof Client, val: any) => void
  updateMediaDevice: (dev: keyof MediaDevicesIds, id?: string) => void;
  mediaDevsIds: MediaDevicesIds
  messages: MessageItem[];
  setMessages: Dispatch<SetStateAction<MessageItem[]>>
}

const INPUT_DEV_NAME = "inputAudioDevice"
const OUTPUT_DEV_NAME = "outputAudioDevice"

export interface MediaDevicesIds {
  [INPUT_DEV_NAME]?: string;
  [OUTPUT_DEV_NAME]?: string;
}

export const StorageContext = createContext<StorageContextType>({} as StorageContextType);

export const StorageProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [mediaDevsIds, setMediaDevsIds] = useState<MediaDevicesIds>({
    inputAudioDevice: localStorage.getItem(INPUT_DEV_NAME) || undefined,
    outputAudioDevice: localStorage.getItem(OUTPUT_DEV_NAME) || undefined
  })

  const updateMediaDevice = (dev: keyof MediaDevicesIds, id?: string) => {
    setMediaDevsIds(prev => ({ ...prev, [dev]: id }));
    if (!id) {
      localStorage.removeItem(dev);
    }
    else {
      localStorage.setItem(dev, id);
    }
  }

  const createClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  }

  const cleanClient = (client: Client) => {
    if (client.peer) {
      client.peer.destroy();
      client.peer.removeAllListeners();
      client.peer = null;
    }

    client?.audioStream?.getTracks().forEach(track => track.stop());
    client?.displayStream?.getTracks().forEach(track => track.stop());
    client.audioStream = null;
    client.displayStream = null;    
  }

  const findClientById = (id: string) => {
    return clients.find(client => client.id === id) || null;
  }

  const updateClient = (id: string, key: keyof Client, val: any) => {
    setClients(prev => prev.map(client => {
      if (client.id === id) {
        return { ...client, [key]: val }
      }
      return client;
    }))
  }

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => {
      if (client.id !== id) {
        return true;
      }

      cleanClient(client);
      logger.debug(`User #${id} peer destroyed`);
      return false;
    }));
  }

  const getSharingClient = () => {
    return clients.find(c => c.isShared) || null;
  }

  const isMuted = (id: string) => {
    return Boolean(clients.find(c => c.isMuted && c.id === id));
  }

  const resetData = () => {
    for (const client of clients) {
      cleanClient(client);
    }
    logger.debug("All peers destroyed");
    setClients([]);
    setMessages([]);
    setRoomId(null);
  }

  return (
    <StorageContext.Provider value={{
      clients,
      createClient,
      setClients,
      setRoomId,
      deleteClient,
      resetData,
      findClientById,
      getSharingClient,
      updateClient,
      isMuted,
      updateMediaDevice,
      mediaDevsIds,
      roomId,
      messages,
      setMessages
    }}>
      {children}
    </StorageContext.Provider>
  );
};