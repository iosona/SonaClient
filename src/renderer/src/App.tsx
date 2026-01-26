import './style.css'
import { Box } from '@mui/material';
import { TitleBar } from './components/Titlebar';
import MainScreen from './screens/MainScreen';
import { useStorage } from './providers/useStorage';
import CallScreen from './screens/CallScreen';
import { useSocket } from './providers/useSocket';
import { useModal } from './hooks/useModal';
import ClientVerificationModal from './components/ClientVerificationError';
import { useEffect } from 'react';
import AboutButton from './components/AboutButton';

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
        </>
      }
    </Box>
  );
}

export default App;