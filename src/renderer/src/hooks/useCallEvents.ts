import { EmitEvent, EventHandler } from "@renderer/providers/SocketProvider.types";
import { useStorage } from "@renderer/providers/useStorage";
import { useP2P } from "./useP2P";
import { useSocket } from "@renderer/providers/useSocket";
import { RefObject, useEffect, useRef } from "react";
import { Client } from "@renderer/types";
import { Instance } from "simple-peer";
import { logger } from "@renderer/logger";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

    const _utilCreatePeer = (initialStream: MediaStream, data: any) => {
        let peer: Instance | null = createPeer(
            initialStream, 
            (signal) => emitEvent(EmitEvent.SIGNAL, { signal, toUserId: data.userId }),
            () => {
                /*const client = clientsRef.current.find(c => c.id === data.userId);
                if (!client) return;
                cleanClient(client);
                updateClient(client.id, 'audioStream', null);
                updateClient(client.id, 'displayStream', null);
                updateClient(client.id, 'peer', null);
                updateClient(client.id, 'isStreamReady', false);

                emitEvent(EmitEvent.ICERECONNECT, { toUserId: client.id });
                logger.warn("Ice reconnect started.");*/
            }
        );
        return peer;
    }

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
            window.api.sendNotify(t("NewMessage"), data.message);
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
            peer.on("stream", (s) => {
                _handleStream(userId, s)
            });
        }
    }

    const handleJoin: EventHandler = (_, data) => {
        if (!initialStream) return;
        const peer = _utilCreatePeer(initialStream, data);
        
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
                if (displayStreamRef.current && peer) {
                    addStreamToPeer(peer, displayStreamRef.current);
                }
            })
        }
    }

    const handleReconnect: EventHandler = (_, data) => {
        data;
        /*if (!initialStream) return;
        const client = clientsRef.current.find(c => c.id === data.userId);
        //client?.peer?.destroy();
        if (!client) return;
        cleanClient(client);
        updateClient(client.id, 'peer', null);
        updateClient(client.id, 'audioStream', null);
        updateClient(client.id, 'displayStream', null);
        const peer = _utilCreatePeer(initialStream, data);
        updateClient(data.userId, 'peer', peer);
        if (displayStreamRef.current) {
            peer.on("connect", () => {
                if (displayStreamRef.current && peer) {
                    addStreamToPeer(peer, displayStreamRef.current);
                }
            })
        }
        logger.debug("Peer reconnected");*/
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
        handleMessage,
        handleReconnect
    }
}