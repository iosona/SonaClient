import './style.css'
import { Box } from '@mui/material';
import { TitleBar } from './components/Titlebar';
import MainScreen from './screens/MainScreen';
import { useStorage } from './providers/useStorage';
import CallScreen from './screens/CallScreen/CallScreen';
import { useSocket } from './providers/useSocket';
import { useModal } from './hooks/useModal';
import ClientVerificationModal from './components/ClientVerificationError';
import { useEffect } from 'react';
import AboutButton from './components/AboutButton';
import { WinIconButton } from './components/WinIconButton';
import { Settings } from '@mui/icons-material';
import SettingsModal from './components/SettingsModal';

function App() {
  const { roomId } = useStorage();
  const { isVerificationError } = useSocket();
  const clientVerificationModal = useModal();

  useEffect(() => {
    if (isVerificationError) {
      clientVerificationModal.handleOpen();
    }
  }, [isVerificationError]);

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100vh', 
      justifyContent: 'space-between',
      width: '100%'
    }}>
      <ClientVerificationModal 
        open={clientVerificationModal.open} 
        onClose={clientVerificationModal.handleClose} 
      />
      <TitleBar />
      {
        roomId
        ?
        <CallScreen/>
        :
        <>
          <MainScreen />
          <AboutButton />
          <SettingsModal>
            <WinIconButton size='small' sx={{
              position: 'absolute', 
              top: 40, 
              right: 50
            }}>
              <Settings fontSize='small' />
            </WinIconButton>
          </SettingsModal>
        </>
      }
    </Box>
  );
}

export default App;