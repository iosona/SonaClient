import { EmitEvent, EventHandler } from "@renderer/providers/SocketProvider.types";
import { useStorage } from "@renderer/providers/useStorage";
import { useP2P } from "./useP2P";
import { useSocket } from "@renderer/providers/useSocket";
import { RefObject, useEffect, useRef } from "react";
import { Client } from "@renderer/types";
import { Instance } from "simple-peer";
import { logger } from "@renderer/logger";

export const useCallEvents = (
    displayStream: MediaStream | null,
    clientsRef: RefObject<Client[]>, 
    initialStream: MediaStream | null,
) => {
    const {
        createClient, 
        deleteClient,
        updateClient,
        setMessages
    } = useStorage();
    const { emitEvent, socket } = useSocket();
    const { createPeer, addPeer, addStreamToPeer } = useP2P();
    const displayStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        displayStreamRef.current = displayStream;
    }, [displayStream]);

    const handleDisconnect: EventHandler = (_, data) => {
        deleteClient(data.userId);
    }

    const _handleStream = (userId: string, peerStream: MediaStream) => {
        const client = clientsRef.current.find(c => c.id === userId);
        if (!client?.audioStream) {
            updateClient(userId, 'audioStream', peerStream);
            updateClient(userId, 'isStreamReady', true);
            logger.debug(`User #${userId} audio stream updated`)
        }
        else {
            updateClient(userId, 'displayStream', peerStream);
            logger.debug(`User #${userId} display stream updated`)
        }
    }

    const handleMessage: EventHandler = (_, data) => {
        const id = crypto.randomUUID(); 

        setMessages(prev => [
            ...prev,
            {
                id,
                isRead: data.userId === socket?.id,
                ...(data as any)
            }
        ]);

        if (socket?.id !== data.userId) {
            window.api.sendNotify("Новое сообщение", data.message);
        }
    };

    const handleSignal: EventHandler = (_, data) => {
        if (!initialStream) return;
        const { userId, signal } = data;

        let peer: Instance;
        const client = clientsRef.current.find(c => c.id === userId);
        if (client?.peer) {
            client.peer.signal(signal);
            peer = client.peer;
        }
        else {
            const p = addPeer(signal, initialStream, (mySignal) => {
                emitEvent(EmitEvent.SIGNAL, {
                    toUserId: userId,
                    signal: mySignal
                })
            })
            if (displayStreamRef.current) {
                p.on("connect", () => {
                    if (displayStreamRef.current) {
                        addStreamToPeer(p, displayStreamRef.current);
                    }
                })
            }
            updateClient(userId, 'peer', p);
            peer = p;
        }

        if (peer.listeners("stream").length === 0) {
            peer.on("stream", (s) => _handleStream(userId, s));
        }
    }

    const handleJoin: EventHandler = (_, data) => {
        if (!initialStream) return;
        const peer = createPeer(initialStream, (signal) => emitEvent(EmitEvent.SIGNAL, { signal, toUserId: data.userId }));
        
        createClient({
            id: data.userId,
            userData: data.userData,
            isMuted: false,
            isShared: false,
            audioStream: null,
            displayStream: null,
            peer
        })

        if (displayStreamRef.current) {
            peer.on("connect", () => {
                if (displayStreamRef.current) {
                    addStreamToPeer(peer, displayStreamRef.current);
                }
            })
        }
    }

    const handleMute: EventHandler = (_, data) => {
        const { userId, isMuted } = data;
        updateClient(userId, 'isMuted', isMuted);
    }

    const handleShare: EventHandler = (_, data) => {
        const { userId, isShared } = data;
        updateClient(userId, 'isShared', isShared);
        if (!isShared) {
            const client = clientsRef.current.find(c => c.id === userId);
            client?.displayStream?.getTracks().forEach(track => track.stop());
            updateClient(userId, 'displayStream', null);
            logger.debug(`User #${userId} display stream destroyed`);
        }
    }

    return {
        handleDisconnect,
        handleJoin,
        handleMute,
        handleShare,
        handleSignal,
        handleMessage
    }
}