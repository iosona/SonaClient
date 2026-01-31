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
import SettingsModal from './components/Settings/SettingsModal';

const WINDOW_WIDTH_NAME = "windowWidth"
const WINDOW_HEIGHT_NAME = "windowHeight";

function App() {
  const { roomId } = useStorage();
  const { isVerificationError } = useSocket();
  const clientVerificationModal = useModal();

  useEffect(() => {
    if (isVerificationError) {
      clientVerificationModal.handleOpen();
    }
  }, [isVerificationError]);

  useEffect(() => {
    const handleWindowResize = () => {
      localStorage.setItem(WINDOW_WIDTH_NAME, window.innerWidth.toString());
      localStorage.setItem(WINDOW_HEIGHT_NAME, window.innerHeight.toString());
    }

    window.api.resizeWindow(
      Number(localStorage.getItem(WINDOW_WIDTH_NAME)) || 700,
      Number(localStorage.getItem(WINDOW_HEIGHT_NAME)) || 600
    );
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    }
  }, []);

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