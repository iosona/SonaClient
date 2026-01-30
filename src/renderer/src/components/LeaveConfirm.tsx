import { useModal } from "@renderer/hooks/useModal";
import { JSX } from "react";
import ModalWindow from "./ModalWindow";
import { Box, Typography } from "@mui/material";
import { WinButton } from "./WinButton";
import { useTranslation } from "react-i18next";

export interface LeaveConfirmProps {
    children: JSX.Element
    onLeave?: () => void;
}

export default function LeaveConfirm({
    children,
    onLeave
}: LeaveConfirmProps) {
  const { open, handleClose, handleOpen } = useModal();
  const { t } = useTranslation();

  const leave = () => {
    handleClose();
    onLeave?.();
  }

  return (
    <>
        <children.type {...children.props} onClick={handleOpen} />
        <ModalWindow open={open} onClose={handleClose} contentWidth="360px">
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
                { t("CallEnd") }
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                { t("CallEndConfirm") }
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                <WinButton 
                    onClick={handleClose}
                    sx={{ px: 3 }}
                >
                    { t("Cancel") }
                </WinButton>
                <WinButton 
                    onClick={leave} 
                    sx={{ 
                        px: 3,
                        bgcolor: '#e81123',
                        color: '#fff',
                        '&:hover': { bgcolor: '#c40e1d' }
                    }}
                >
                    { t("Disconnect") }
                </WinButton>
            </Box>
        </ModalWindow>
    </>
  );
}
