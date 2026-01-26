import { FC, JSX } from "react";
import ModalWindow from "./ModalWindow";
import { Box, MenuItem, Select, Typography, alpha, styled } from "@mui/material";
import { useModal } from "@renderer/hooks/useModal";
import { useDevices } from "@renderer/hooks/useDevices";
import { useStorage } from "@renderer/providers/useStorage";
import { WinButton } from "./WinButton";

export interface SettingsModalProps {
    children: JSX.Element
}

// Стилизация Select под Windows 11
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
    const { mediaDevsIds, updateMediaDevice } = useStorage();

    return (
        <>
            <children.type {...children.props} onClick={handleOpen} />
            <ModalWindow contentWidth="400px" open={open} onClose={handleClose}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
                    Настройки
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    outline: 'none'
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <Typography variant="body2" sx={{ color: '#60cdff', fontWeight: 500 }}>
                            Колонки и наушники
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
                            Микрофон
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
                    OK
                </WinButton>
            </ModalWindow>
        </>
    )
}

export default SettingsModal;
