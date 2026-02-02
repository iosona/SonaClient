import { useEffect, useMemo, useRef, useState } from 'react';
import { useStorage } from '@renderer/providers/useStorage';
import { useSocket } from '@renderer/providers/useSocket';
import { EmitEvent } from '@renderer/providers/SocketProvider.types';
import { useP2P } from '@renderer/hooks/useP2P';
import { useAudioStream } from '@renderer/hooks/useAudioStream';
import { DisplayInfo } from '@renderer/components/ScreenSelector';
import { useModal } from '@renderer/hooks/useModal';
import { useDisplayStream } from '@renderer/hooks/useDisplayStream';
import { useCallEvents } from '@renderer/hooks/useCallEvents';
import { logger } from '@renderer/logger';
import { useCallTimer } from '@renderer/hooks/useCallTimer'
import { useKeyBind } from '@renderer/providers/useKeyBind';
import { KeyBindEvent } from '@renderer/enums';

export const useCallScreenMethods = () => {
    const { 
        clients, 
        resetData,
        updateClient,
        getSharingClient,
        isMuted,
        mediaDevsIds,
        setMessages,
        messages
    } = useStorage();
    const { isConnected, subscribeEvent, emitEvent, unsubscribeEvent, socket } = useSocket();
    const { addStreamToPeer, removeStreamFromPeer } = useP2P();
    const { setStream, stream, createStream, stop, toggleMute } = useAudioStream();
    const [displayInfo, setDisplayInfo] = useState<DisplayInfo | null>(null);
    const { stream: displayStream, stop: stopDisplayStream } = useDisplayStream(displayInfo);
    const clientsRef = useRef(clients);
    const sharingClient = useMemo(getSharingClient, [clients]);
    const isMeMuted = useMemo(() => isMuted(socket?.id || ''), [socket, clients])
    const screenVideoRef = useRef<HTMLVideoElement>(null);
    const screenSelector = useModal();
    const [isMessage, setIsMessage] = useState<boolean>(false);
    const connectionLostModal = useModal();
    const [isAllMuted, setIsAllMuted] = useState<boolean>(false);
    const { updateKeyBind } = useKeyBind();
    const callTime = useCallTimer(true);
    const {
        handleDisconnect, 
        handleJoin, 
        handleMute, 
        handleShare, 
        handleSignal,
        handleMessage,
        handleReconnect
    } = useCallEvents(displayStream, clientsRef, stream);
    const activeAudioStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (stream && !activeAudioStreamRef.current) {
            activeAudioStreamRef.current = stream;
        }
        if (socket?.id) {
            updateClient(socket.id, 'audioStream', stream);
        }
    }, [stream]);

    const isShareDisabled = Boolean(sharingClient?.id !== socket?.id && sharingClient)

    const unreadMessages = useMemo(() => {
        return messages.filter(msg => !msg.isRead).length;
    }, [messages]);

    useEffect(() => {
        (async () => {
            if (!activeAudioStreamRef.current) return;

            const newStream = await createStream();
            if (!newStream) {
            return;
            }

            for (const client of clientsRef.current) {
            if (!client.peer || !client.peer.streams[0]) {
                continue;
            }
            const oldStream = client.peer.streams[0];

            const newTracks = newStream.getTracks();
            const oldTracks = oldStream.getTracks();

            newTracks.forEach(newTrack => {
                if (!activeAudioStreamRef.current) return;
                const oldTrack = oldTracks.find(t => t.kind === newTrack.kind);
                if (!oldTrack) return;
                client.peer?.replaceTrack(oldTrack, newTrack, oldStream);
            });
            }

            stop();
            setStream(newStream);
            logger.debug("Audio stream updated");
        })();
    }, [mediaDevsIds.inputAudioDevice]);
    
    useEffect(() => {
        clientsRef.current = clients;
    }, [clients]);

    useEffect(() => {
        if (!sharingClient || !screenVideoRef.current || !sharingClient.displayStream) {
            return;
        }
        
        screenVideoRef.current.srcObject = sharingClient.displayStream;
        logger.debug("Sharing client's display has been added to player");
    }, [sharingClient?.displayStream]);

    useEffect(() => {
        if (!screenVideoRef.current) return;
        screenVideoRef.current.srcObject = displayStream;

        return () => {
            if (screenVideoRef.current) {
                screenVideoRef.current.srcObject = null;
            }
        }
    }, [displayStream]);

    useEffect(() => {
        if (!displayStream) {
            return;
        }

        for (const client of clients) {
            if (client.peer) {
            addStreamToPeer(client.peer, displayStream);
            }
        }
        logger.debug("Your display stream added to all peers");
    }, [displayStream]);

    useEffect(() => {
        if (!isConnected) {
            connectionLostModal.handleOpen()
            return;
        }

        if (!stream) return;

        subscribeEvent(EmitEvent.LEAVE_ROOM, handleDisconnect);
        subscribeEvent(EmitEvent.SIGNAL, handleSignal);
        subscribeEvent(EmitEvent.USER_JOINED, handleJoin);
        subscribeEvent(EmitEvent.SHARE, handleShare);
        subscribeEvent(EmitEvent.MUTE, handleMute);
        subscribeEvent(EmitEvent.SEND_MESSAGE, handleMessage);
        subscribeEvent(EmitEvent.ICERECONNECT, handleReconnect);

        return () => {
            unsubscribeEvent(EmitEvent.LEAVE_ROOM, handleDisconnect);
            unsubscribeEvent(EmitEvent.SIGNAL, handleSignal);
            unsubscribeEvent(EmitEvent.USER_JOINED, handleJoin);
            unsubscribeEvent(EmitEvent.SHARE, handleShare);
            unsubscribeEvent(EmitEvent.MUTE, handleMute);
            unsubscribeEvent(EmitEvent.SEND_MESSAGE, handleMessage);
            unsubscribeEvent(EmitEvent.ICERECONNECT, handleReconnect);
        }
    }, [isConnected, stream]);

    const stopDisplaySharing = () => {
        setDisplayInfo(null)
        emitEvent(EmitEvent.SHARE, { isShared: false });
        if (!displayStream) return;
        for (const client of clients) {
            if (client.peer) {
                removeStreamFromPeer(client.peer, displayStream);
            }
        }
        stopDisplayStream();
        window.api.setDisplayId(null);
    }

    const leave = () => {
        emitEvent(EmitEvent.LEAVE_ROOM, {});
        resetData();
        stopDisplaySharing();
        stop();
    }

    const muteMe = () => {
        if (!socket?.id) return;
        const state = toggleMute();
        updateClient(socket.id, 'isMuted', state);
        emitEvent(EmitEvent.MUTE, { isMuted: state });
    }

    const handleSelectDisplay = (info: DisplayInfo) => {
        emitEvent(EmitEvent.SHARE, { isShared: true });
        setDisplayInfo(info);
        window.api.setDisplayId(info.displayId);

        screenSelector.handleClose();
        logger.debug("Selected display id set");
    }

    const handleShareClick = () => {
        if (sharingClient?.id === socket?.id) {
            stopDisplaySharing();
            logger.debug("Video tracks removed");
            return;
        }
        if (window.sysInfo.platform === 'win32') {
            screenSelector.handleOpen();
            logger.debug("Window selector opened");
        }
        else {
            emitEvent(EmitEvent.SHARE, { isShared: true });
            setDisplayInfo({
                displayId: '',
                isSound: false
            });
        }
    }

    const handleToggleMuteAll = () => {
        for (const client of clients) {
            updateClient(client.id, 'volume', isAllMuted ? 100 : 0);
        }
        setIsAllMuted(prev => !prev);
    }

    useEffect(() => {
        updateKeyBind(KeyBindEvent.QuickMicroMuteToggle, { action: muteMe });
        updateKeyBind(KeyBindEvent.ChatOpenToggle, { action: () => setIsMessage(prev => !prev) });
        updateKeyBind(KeyBindEvent.ClearChat, { action: () => setMessages([]) });
        updateKeyBind(KeyBindEvent.StopScreenSharing, { action: () => stopDisplaySharing() });
        updateKeyBind(KeyBindEvent.MembersMuteToggle, { action: () => handleToggleMuteAll() });
        updateKeyBind(KeyBindEvent.LeaveFromCall, { action: () => leave() });
    }, [clients, displayStream, stream]);

    return {
        isMeMuted,
        isMessage,
        setIsMessage,
        callTime,
        isShareDisabled,
        unreadMessages,
        leave,
        muteMe,
        handleSelectDisplay,
        handleShareClick,
        screenSelector,
        screenVideoRef,
        connectionLostModal,
        sharingClient,
        displayStream,
        stream
    }
}