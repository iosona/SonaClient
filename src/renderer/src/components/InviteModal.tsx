import { useModal } from "@renderer/hooks/useModal";
import { JSX } from "react";
import ModalWindow from "./ModalWindow";
import { Box, Typography } from "@mui/material";
import CopyText from "./CopyText";
import QrCodeDisplay from "./QrCodeDisplay";
import { WinButton } from "./WinButton"; // Твой компонент

export interface InviteModalProps {
    children: JSX.Element
    id: string;
}

export default function InviteModal({
    children,
    id,
}: InviteModalProps) {
  const { open, handleClose, handleOpen } = useModal();

  const genUrl = () => {
    return `sona://join?id=${id}`
  }

  return (
    <>
        <children.type {...children.props} onClick={handleOpen} />
        <ModalWindow open={open} onClose={handleClose}>
            <Typography variant="h6">
               Пригласить
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                outline: 'none'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '10px'
                }}>
                    <Typography 
                        color="textDisabled" 
                        variant="caption"
                        sx={{ marginRight: 'auto' }}
                    >
                        Копировать ID
                        </Typography>
                    <CopyText>{id}</CopyText>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '10px'
                }}> 
                    <Typography 
                        color="textDisabled" 
                        variant="caption"
                        sx={{ marginRight: 'auto' }}
                    >
                        Сканировать QR-Код
                    </Typography>
                    <QrCodeDisplay 
                        size={200} 
                        value={genUrl()} 
                        style={{ width: '235px', marginTop: '10px' }}
                    />
                </Box>
            </Box>
            <WinButton 
                accent
                onClick={handleClose}
                fullWidth
                sx={{ marginLeft: 'auto', marginTop: '20px' }}
            >    
                OK
            </WinButton>
        </ModalWindow>
    </>
  );
}
