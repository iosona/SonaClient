import { Instance } from "simple-peer";

export interface ClientSignal {
    type: 'offer' | 'answer' | 'candidate',
    sdp?: string;
    candidate?: string;
}

export interface UserData {
    userName: string
    avatarId?: string | null;
}

export interface ServerClient {
    id: string;
    isMuted: boolean;
    isShared: boolean;
    userData: UserData
}

export interface Client extends ServerClient {
    peer: Instance | null;
    volume: number;
    audioStream: MediaStream | null;
    displayStream: MediaStream | null;
    isStreamReady?: boolean;
}

export interface MessageItem {
    userId: string
    message: string
    id: string;
    isRead: boolean;
}

export interface IKeyBind {
    event: string;
    keys: string[];
    action?: () => void;
}