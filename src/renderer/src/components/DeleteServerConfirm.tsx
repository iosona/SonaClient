import { useModal } from "@renderer/hooks/useModal";
import { JSX } from "react";
import ModalWindow from "./ModalWindow";
import { Box, Typography } from "@mui/material";
import { WinButton } from "./WinButton";
import { useTranslation } from "react-i18next";

export interface DeleteServerConfirmProps {
    children: JSX.Element
    onDelete?: () => void;
}

export default function DeleteServerConfirm({
    children,
    onDelete
}: DeleteServerConfirmProps) {
  const { open, handleClose, handleOpen } = useModal();
  const { t } = useTranslation();

  const leave = () => {
    handleClose();
    onDelete?.();
  }

  return (
    <>
        <children.type {...children.props} onClick={handleOpen} />
        <ModalWindow open={open} onClose={handleClose} contentWidth="360px">
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
                Удаление сервера
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                Вы действительно хотите удалить сервер?
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                <WinButton 
                    onClick={handleClose}
                    sx={{ px: 3 }}
                >
                    Нет
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
                    Да
                </WinButton>
            </Box>
        </ModalWindow>
    </>
  );
}
