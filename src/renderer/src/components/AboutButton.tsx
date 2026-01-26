import { IconButton, Typography, Box, Link, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useModal } from '@renderer/hooks/useModal';
import ModalWindow from './ModalWindow';
import { WinButton } from './WinButton';
import { GITHUB_URL, PRIVACY_POLICY_URL, TERMS_OF_USE_URL, VERSION } from '@renderer/constants';

const AboutButton = () => {
  const { handleClose, handleOpen, open } = useModal();

  return (
    <>
      <Tooltip arrow title="О приложении">
        <IconButton 
            onClick={handleOpen} 
            color="inherit" 
            aria-label="О приложении"
            size='small'
            sx={{ 
                position: 'absolute', 
                top: 40, 
                right: 10,
                color: 'rgba(255, 255, 255, 0.7)' 
            }}
        >
            <InfoOutlinedIcon fontSize='small' />
        </IconButton>
      </Tooltip>
      
      <ModalWindow open={open} onClose={handleClose}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
            О приложении Sona
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
            <b>Sona Client</b> — это клиент для анонимных групповых аудио-звонков, 
            созданный с акцентом на открытость и конфиденциальность.
        </Typography>

        <Box sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
            <Typography variant="body2">
                 <b>Версия:</b> {VERSION}
            </Typography>
            <Typography variant="body2">
                <b>Исходный код: </b>
                <Link href={GITHUB_URL} target="_blank" rel="noopener" sx={{ color: '#4dabf7' }}>
                    Перейти на Github
                </Link>
            </Typography>
            <Typography variant="body2">
                <b>Политика конфиденциальности: </b>
                <Link href={PRIVACY_POLICY_URL} target="_blank" rel="noopener" sx={{ color: '#4dabf7' }}>
                    Читать
                </Link>
            </Typography>
            <Typography variant="body2">
                <b>Условия пользования: </b>
                <Link href={TERMS_OF_USE_URL} target="_blank" rel="noopener" sx={{ color: '#4dabf7' }}>
                    Читать
                </Link>
            </Typography>
        </Box>
          
        <WinButton accent onClick={handleClose} fullWidth>OK</WinButton>
    </ModalWindow>
    </>
  );
};

export default AboutButton;