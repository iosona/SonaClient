import { Socket } from "socket.io-client";

export enum EmitStatus {
    SUCCESS = 's',
    ERROR = 'e'
}

export enum EmitEvent {
    JOIN_ROOM = 'join-room',
    CREATE_ROOM = 'create-room',
    USER_JOINED = 'user-joined',
    SIGNAL = 'signal',
    DISCONNECT = 'disconnect',
    LEAVE_ROOM = 'leave-room',
    SHARE = 'share',
    MUTE = 'mute',
    SEND_MESSAGE = 'send-message'
}

export type EventData = Record<string, any>;

export type EventHandler = (status: EmitStatus, data: EventData) => void;

export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isVerificationError: boolean;
  unsubscribeEvent: (event: EmitEvent, handler: EventHandler) => void;
  subscribeEvent: (event: EmitEvent, handler: EventHandler) => void;
  emitEvent: (event: EmitEvent, data: EventData) => void;
}