import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Container,
  ListItemButton,
  Divider,
  Stack,
  alpha,
  CircularProgress,
  Badge,
} from '@mui/material';
import {
  Mic,
  MicOff,
  ScreenShare,
  StopScreenShare,
  CallEnd,
  People,
  AddCircle,
  Settings,
  Chat,
} from '@mui/icons-material';
import { useStorage } from '@renderer/providers/useStorage';
import { useSocket } from '@renderer/providers/useSocket';
import { EmitEvent } from '@renderer/providers/SocketProvider.types';
import LeaveConfirm from '@renderer/components/LeaveConfirm';
import { useP2P } from '@renderer/hooks/useP2P';
import { useAudioStream } from '@renderer/hooks/useAudioStream';
import UserItem from '@renderer/components/UserItem';
import InviteModal from '@renderer/components/InviteModal';
import ScreenSelector, { DisplayInfo } from '@renderer/components/ScreenSelector';
import { useModal } from '@renderer/hooks/useModal';
import { useDisplayStream } from '@renderer/hooks/useDisplayStream';
import { useCallEvents } from '@renderer/hooks/useCallEvents';
import ConnectionLostModal from '@renderer/components/ConnectionLostModal';
import SettingsModal from '@renderer/components/SettingsModal';
import { logger } from '@renderer/logger';
import { ChatPanel } from '@renderer/components/ChatPanel';

const CallScreen: React.FC = () => {
  const { 
    clients, 
    roomId, 
    resetData,
    updateClient,
    getSharingClient,
    isMuted,
    mediaDevsIds,
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
  const {
    handleDisconnect, 
    handleJoin, 
    handleMute, 
    handleShare, 
    handleSignal,
    handleMessage
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

    return () => {
      unsubscribeEvent(EmitEvent.LEAVE_ROOM, handleDisconnect);
      unsubscribeEvent(EmitEvent.SIGNAL, handleSignal);
      unsubscribeEvent(EmitEvent.USER_JOINED, handleJoin);
      unsubscribeEvent(EmitEvent.SHARE, handleShare);
      unsubscribeEvent(EmitEvent.MUTE, handleMute);
      unsubscribeEvent(EmitEvent.SEND_MESSAGE, handleMessage);
    }
  }, [isConnected, stream]);

  const stopDisplaySharing = () => {
    setDisplayInfo(null);
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
      emitEvent(EmitEvent.SHARE, { isShared: false });
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

  return (
    <>
      <ScreenSelector 
        open={screenSelector.open} 
        onClose={screenSelector.handleClose} 
        onSelect={handleSelectDisplay}
      />
      <ConnectionLostModal
        open={connectionLostModal.open}
        onClose={connectionLostModal.handleClose}
      />
      <Box sx={{
        display: 'flex',
        width: '100%',
        height: '100vh', 
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          bgcolor: '#1a1a1a',
          width: isMessage ? '70%' : '100%',
          pt: '32px'
        }}>
          <Box sx={{ 
            px: 3, py: 1.5, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ bgcolor: alpha('#60cdff', 0.1), p: 0.5, borderRadius: 1, display: 'flex' }}>
                <People sx={{ color: '#60cdff', fontSize: 20 }} />
              </Box>
              <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>
                голосовой чат
                <Box component="span" sx={{ color: 'rgba(255,255,255,0.4)', ml: 1 }}>{clients.length}</Box>
              </Typography>
            </Stack>
          </Box>
          <Container maxWidth={false} sx={{ 
            flex: 1, 
            py: 2, 
            display: 'flex', 
            gap: 2, 
            overflow: 'hidden',
            alignItems: 'stretch'
          }}>
            {sharingClient?.isShared && (
              <Paper 
                elevation={0}
                sx={{ 
                  flex: 1, 
                  bgcolor: '#000', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  border: '2px solid #60cdff',
                  boxShadow: '0 0 20px rgba(96, 205, 255, 0.2)',
                  position: 'relative'
                }}
              >
                <video autoPlay playsInline ref={screenVideoRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <Box sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'rgba(0,0,0,0.6)', px: 1.5, py: 0.5, borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#fff' }}>Демонстрация: {sharingClient.userData?.userName}</Typography>
                </Box>
                {
                  !screenVideoRef.current?.played
                  &&
                  <Box sx={{ 
                    position: 'absolute',
                    top: '50%', 
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}>
                    <CircularProgress size={50} />
                  </Box>
                }
              </Paper>
            )}
            <Box sx={{
              width: sharingClient?.isShared || displayStream ? '300px' : '100%',
              maxWidth: sharingClient?.isShared || displayStream ? '300px' : '800px',
              mx: 'auto',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <Paper elevation={0} sx={{ 
                bgcolor: '#252525', 
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '100%'
              }}>
                <Box sx={{ overflowY: 'auto', flex: 1 }}>
                  {clients.map((client, index) => (
                    <UserItem 
                      key={client.id} 
                      isTopBordered={index === 0} 
                      client={client} 
                    />
                  ))}
                </Box>

                <InviteModal id={roomId || ''}>
                  <ListItemButton sx={{
                    py: 2,
                    gap: 2,
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
                  }}>
                    <AddCircle sx={{ color: '#60cdff' }} />
                    <Typography sx={{ color: '#60cdff', fontWeight: 500, fontSize: '0.85rem' }}>
                      Пригласить участников
                    </Typography>
                  </ListItemButton>
                </InviteModal>
              </Paper>
            </Box>
          </Container>
          <Box sx={{ 
            pb: 3, pt: 1,
            display: 'flex', 
            justifyContent: 'center',
            zIndex: 1000
          }}>
              <Paper 
                elevation={24}
                sx={{ 
                  py: 1.2, px: 2, 
                  borderRadius: '12px',
                  bgcolor: '#2c2c2c',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}
              >
                <Stack direction="row" spacing={1} sx={{ px: 1 }}>
                  <Badge badgeContent={unreadMessages} color="error">
                    <IconButton 
                      onClick={() => setIsMessage(prev => !prev)}
                      sx={{ 
                        color: isMessage ? '#60cdff' : 'rgba(255,255,255,0.7)',
                        bgcolor: isMessage ? alpha('#60cdff', 0.1) : 'transparent',
                        borderRadius: '4px' 
                      }}
                    >
                        <Chat fontSize="small" />
                    </IconButton>
                  </Badge>
                  <SettingsModal>
                    <IconButton sx={{ color: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                      <Settings fontSize="small" />
                    </IconButton>
                  </SettingsModal>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 0.5 }} />
                <Stack direction="row" spacing={2} sx={{ px: 1 }}>
                  <IconButton
                    onClick={handleShareClick}
                    disabled={isShareDisabled}
                    sx={{ 
                      borderRadius: '8px',
                      width: 48, height: 48,
                      bgcolor: sharingClient?.isShared ? alpha('#60cdff', 0.1) : 'rgba(255,255,255,0.03)',
                      color: sharingClient?.isShared ? '#60cdff' : '#fff',
                      border: '1px solid',
                      borderColor: sharingClient?.isShared ? alpha('#60cdff', 0.4) : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                    }}
                  >
                    {sharingClient?.isShared ? <StopScreenShare /> : <ScreenShare />}
                  </IconButton>
                  <IconButton 
                    onClick={muteMe}
                    sx={{ 
                      borderRadius: '8px',
                      width: 48, height: 48,
                      bgcolor: isMeMuted ? alpha('#f44336', 0.1) : 'rgba(255,255,255,0.03)',
                      color: isMeMuted ? '#f44336' : '#fff',
                      border: '1px solid',
                      borderColor: isMeMuted ? alpha('#f44336', 0.4) : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                    }}
                  >
                    {isMeMuted ? <MicOff /> : <Mic />}
                  </IconButton>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 0.5 }} />
                <LeaveConfirm onLeave={leave}>
                  <IconButton
                    sx={{ 
                      width: 48, height: 48,
                      borderRadius: '8px',
                      bgcolor: '#e81123', 
                      color: 'white', 
                      '&:hover': { bgcolor: '#c40e1d' },
                    }}
                  >
                    <CallEnd />
                  </IconButton>
                </LeaveConfirm>
              </Paper>
          </Box>  
        </Box>
        {
          isMessage
          &&
          <ChatPanel />
        }
      </Box>
    </>
  );
};

export default CallScreen;