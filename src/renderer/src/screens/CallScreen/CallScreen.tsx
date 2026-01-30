import { Box, Container } from '@mui/material';
import ScreenSelector from '@renderer/components/ScreenSelector';
import ConnectionLostModal from '@renderer/components/ConnectionLostModal';
import { ChatPanel } from '@renderer/components/ChatPanel';
import BottomBar from './BottomBar';
import { useCallScreenMethods } from '../../hooks/useCallScreenMethods';
import MembersList from './MembersList';
import ScreenSharing from './ScreenSharing';
import TopBar from './TopBar';

const CallScreen: React.FC = () => {
  const {
    screenSelector,
    handleSelectDisplay,
    connectionLostModal,
    isMessage,
    callTime,
    sharingClient,
    screenVideoRef,
    displayStream,
    unreadMessages,
    setIsMessage,
    isShareDisabled,
    leave,
    handleShareClick,
    isMeMuted,
    muteMe
  } = useCallScreenMethods();

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
          <TopBar callTime={callTime} />
          <Container maxWidth={false} sx={{ 
            flex: 1, 
            py: 2, 
            display: 'flex', 
            gap: 2, 
            overflow: 'hidden',
            alignItems: 'stretch'
          }}>
            <ScreenSharing sharingClient={sharingClient} screenVideoRef={screenVideoRef} />
            <MembersList sharingClient={sharingClient} displayStream={displayStream} />
          </Container>
          <BottomBar
            unreadMessages={unreadMessages}
            isMessage={isMessage}
            setIsMessage={setIsMessage}
            isShareDisabled={isShareDisabled}
            handleShareClick={handleShareClick}
            leave={leave}
            isMeMuted={isMeMuted}
            muteMe={muteMe}
            sharingClient={sharingClient}
          />
        </Box>
        { isMessage && <ChatPanel /> }
      </Box>
    </>
  );
};

export default CallScreen;