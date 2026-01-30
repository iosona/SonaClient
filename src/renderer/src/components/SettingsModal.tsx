import { FC, JSX } from "react";
import ModalWindow from "./ModalWindow";
import { Box, MenuItem, Select, Typography, alpha, styled } from "@mui/material";
import { useModal } from "@renderer/hooks/useModal";
import { useDevices } from "@renderer/hooks/useDevices";
import { useStorage } from "@renderer/providers/useStorage";
import { WinButton } from "./WinButton";
import { useTranslation } from "react-i18next";

export interface SettingsModalProps {
    children: JSX.Element
}

const WinSelect = styled(Select)({
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '0.9rem',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,255,255,0.1)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,255,255,0.2)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#60cdff',
        borderWidth: '1px',
    },
    '& .MuiSelect-icon': {
        color: 'rgba(255,255,255,0.5)',
    }
});

const languages = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'uk', label: 'Українська' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'sp', label: 'Español' },
    { code: 'ch', label: '简体中文' }
];

const SettingsModal: FC<SettingsModalProps> = ({
    children
}) => {
    const { open, handleClose, handleOpen } = useModal();
    const { outputDevs, inputDevs } = useDevices();
    const { mediaDevsIds, updateMediaDevice } = useStorage();
    const { t, i18n } = useTranslation();
    
    return (
        <>
            <children.type {...children.props} onClick={handleOpen} />
            <ModalWindow contentWidth="400px" open={open} onClose={handleClose}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
                    { t("Settings") }
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    outline: 'none'
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <Typography variant="body2" sx={{ color: '#60cdff', fontWeight: 500 }}>
                            { t("Language") }
                        </Typography>
                        <WinSelect 
                            value={i18n.language} 
                            size="small" 
                            fullWidth
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: '#2c2c2c',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        mt: 0.5
                                    }
                                }
                            }}
                        >
                            {
                                languages.map(lang => (
                                    <MenuItem
                                        onClick={() => i18n.changeLanguage(lang.code)}
                                        value={lang.code} 
                                        key={lang.code}
                                        sx={{ 
                                            fontSize: '0.9rem', 
                                            display: 'flex',
                                            gap: '10px',
                                            '&:hover': { bgcolor: alpha('#fff', 0.05) } 
                                        }}
                                    >
                                        { lang.label }
                                    </MenuItem>
                                ))
                            }
                        </WinSelect>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <Typography variant="body2" sx={{ color: '#60cdff', fontWeight: 500 }}>
                            { t("SoundOutput") }
                        </Typography>
                        <WinSelect 
                            value={!mediaDevsIds.outputAudioDevice ? outputDevs[0]?.deviceId || '' : mediaDevsIds.outputAudioDevice} 
                            size="small" 
                            fullWidth
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: '#2c2c2c',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        mt: 0.5
                                    }
                                }
                            }}
                        >
                            {
                                outputDevs.map(dev => (
                                    <MenuItem 
                                        onClick={() => updateMediaDevice('outputAudioDevice', dev.deviceId)}
                                        value={dev.deviceId} 
                                        key={dev.deviceId}
                                        sx={{ fontSize: '0.9rem', '&:hover': { bgcolor: alpha('#fff', 0.05) } }}
                                    >
                                        { dev.label }
                                    </MenuItem>
                                ))
                            }
                        </WinSelect>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <Typography variant="body2" sx={{ color: '#60cdff', fontWeight: 500 }}>
                            { t("Microphone") }
                        </Typography>
                        <WinSelect 
                            value={!mediaDevsIds.inputAudioDevice ? inputDevs[0]?.deviceId || '' : mediaDevsIds.inputAudioDevice} 
                            size="small" 
                            fullWidth
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: '#2c2c2c',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        mt: 0.5
                                    }
                                }
                            }}
                        >
                            {
                                inputDevs.map(dev => (
                                    <MenuItem 
                                        onClick={() => updateMediaDevice('inputAudioDevice', dev.deviceId)}
                                        value={dev.deviceId} 
                                        key={dev.deviceId}
                                        sx={{ fontSize: '0.9rem', '&:hover': { bgcolor: alpha('#fff', 0.05) } }}
                                    >
                                        { dev.label }
                                    </MenuItem>
                                ))
                            }
                        </WinSelect>
                    </Box>
                </Box>
                <WinButton
                    accent 
                    onClick={handleClose}
                    fullWidth
                    sx={{ marginLeft: 'auto', mt: 2, minWidth: '80px' }}
                >    
                    { t("OK") }
                </WinButton>
            </ModalWindow>
        </>
    )
}

export default SettingsModal;
