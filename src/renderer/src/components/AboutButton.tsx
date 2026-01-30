import { Typography, Box, Link, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useModal } from '@renderer/hooks/useModal';
import ModalWindow from './ModalWindow';
import { WinButton } from './WinButton';
import { GITHUB_URL, PRIVACY_POLICY_URL, TERMS_OF_USE_URL, VERSION } from '@renderer/constants';
import { WinIconButton } from './WinIconButton';
import { useTranslation } from 'react-i18next';

const AboutButton = () => {
  const { handleClose, handleOpen, open } = useModal();
  const { t } = useTranslation();

  return (
    <>
      <Tooltip arrow title={t("AboutApp")}>
        <WinIconButton 
            onClick={handleOpen} 
            color="inherit" 
            aria-label={t("AboutApp")}
            size='small'
            sx={{ 
                position: 'absolute', 
                top: 40, 
                right: 10
            }}
        >
            <InfoOutlinedIcon fontSize='small' />
        </WinIconButton>
      </Tooltip>
      
      <ModalWindow open={open} onClose={handleClose}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
            {t("AboutApp")} Sona
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
            <b>Sona Client</b> — { t("AboutAppText") }
        </Typography>

        <Box sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
            <Typography variant="body2">
                 <b>{ t("Version") }</b>{VERSION}
            </Typography>
            <Typography variant="body2">
                <b>{ t("SourceCode") }</b>
                <Link href={GITHUB_URL} target="_blank" rel="noopener" sx={{ color: '#4dabf7' }}>
                    { t("GoToGithub") }
                </Link>
            </Typography>
            <Typography variant="body2">
                <b>{ t("PrivacyPolicy") }</b>
                <Link href={PRIVACY_POLICY_URL} target="_blank" rel="noopener" sx={{ color: '#4dabf7' }}>
                    { t("Read") }
                </Link>
            </Typography>
            <Typography variant="body2">
                <b>{ t("TermsOfUse") }</b>
                <Link href={TERMS_OF_USE_URL} target="_blank" rel="noopener" sx={{ color: '#4dabf7' }}>
                    { t("Read") }
                </Link>
            </Typography>
        </Box>
          
        <WinButton accent onClick={handleClose} fullWidth>
            { t("OK") }
        </WinButton>
    </ModalWindow>
    </>
  );
};

export default AboutButton;