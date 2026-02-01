import { FC, JSX } from "react";
import ModalWindow from "../ModalWindow";
import { Box, List, MenuItem, Select, Typography, alpha, styled } from "@mui/material";
import { useModal } from "@renderer/hooks/useModal";
import { useDevices } from "@renderer/hooks/useDevices";
import { useStorage } from "@renderer/providers/useStorage";
import { WinButton } from "../WinButton";
import { useTranslation } from "react-i18next";
import { SettingsCategory } from "./SettingsCategory";
import { FPS_RANGE, LANGUAGES, QUALITY } from "@renderer/constants";
import KeyBind from "../KeyBInd/KeyBind";

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

const SettingsModal: FC<SettingsModalProps> = ({
    children
}) => {
    const { open, handleClose, handleOpen } = useModal();
    const { outputDevs, inputDevs } = useDevices();
    const { 
        mediaDevsIds, 
        updateMediaDevice, 
        sharingQuality, 
        setSharingQuality, 
        sharingFPS, 
        setSharingFPS,
    } = useStorage();
    const { t, i18n } = useTranslation();
    
    return (
        <>
            <children.type {...children.props} onClick={handleOpen} />
                <ModalWindow 
                    contentHeight="auto" 
                    contentWidth="min(655px, 95vw)" 
                    open={open} 
                    onClose={handleClose}
                    sx={{
                        marginTop: '25px'
                    }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
                    { t("Settings") }
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    outline: 'none',
                    maxHeight: 'calc(90vh - 150px)', 
                    overflowY: 'auto',
                    pr: 0.5
                }}>
                    <SettingsCategory title={t("ScreenSharing")}>
                        <SettingsCategory subTitle={t("QualityText")} title={t("Quality")} titleProps={{
                            variant: 'subtitle2',
                            color: 'textPrimary',
                        }} sx={{ gap: '0px', marginLeft: '15px' }}>
                            <List sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {
                                    QUALITY.map(item => (
                                        <WinButton onClick={() => setSharingQuality(item.name)} accent={sharingQuality === item.name} key={item.name}>
                                            {item.name}
                                        </WinButton>
                                    ))
                                }
                            </List>
                        </SettingsCategory>
                        <SettingsCategory 
                            subTitle={t("FPSText")}
                            title={t("FPS")} 
                            titleProps={{
                                variant: 'subtitle2',
                                color: 'textPrimary',
                            }} 
                            sx={{ gap: '0px', marginLeft: '15px' }}
                        >
                            <List sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {
                                    FPS_RANGE.map(fps => (
                                        <WinButton onClick={() => setSharingFPS(fps)} accent={sharingFPS === fps} key={fps}>
                                            {fps} FPS
                                        </WinButton>
                                    ))
                                }
                            </List>
                        </SettingsCategory>
                    </SettingsCategory>
                    <SettingsCategory title={t("Language")}>
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
                                LANGUAGES.map(lang => (
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
                    </SettingsCategory>

                    <SettingsCategory title="Горячие клавиши">
                        <List sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            marginLeft: '25px'
                        }}>
                            <KeyBind label="Быстро включить/выключить микрофон" keybind="CTRL + D" />
                            <KeyBind label="Экстренно отключится от звонка" keybind="CTRL + Q" />
                            <KeyBind label="Очистить чат" keybind="CTRL + K" />
                            <KeyBind label="Включить/выключить звук всем участникам" keybind="CTRL + B" />
                            <KeyBind label="Открыть/закрыть чат" keybind="CTRL + E" />
                            <KeyBind label="Завершить демонстрацию экрана" keybind="CTRL + S" />
                        </List>
                    </SettingsCategory>

                    <SettingsCategory title={ t("SoundOutput") }>
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
                    </SettingsCategory>

                    <SettingsCategory title={ t("Microphone") }>
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
                    </SettingsCategory>
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
