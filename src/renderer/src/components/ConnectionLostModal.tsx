import ModalWindow, { ModalWindowProps } from "./ModalWindow";
import { Typography } from "@mui/material";
import { WinButton } from "./WinButton";

export default function ConnectionLostModal({
    open,
    onClose
}: Omit<ModalWindowProps, 'children'>) {
  return (
    <ModalWindow contentWidth="400px" open={open} onClose={onClose}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
            Соединение с сервером было разорвано
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
            Текущий звонок может продолжаться,
            но вы не сможете начать новый звонок, пригласить участников или использовать
            функции, зависящие от сервера. Пожалуйста, проверьте ваше интернет-соединение.
        </Typography>
        <WinButton
            variant="outlined"
            fullWidth
            accent
            onClick={() => onClose && onClose({}, "backdropClick")}
        >
            OK
        </WinButton>
    </ModalWindow>
  );
}