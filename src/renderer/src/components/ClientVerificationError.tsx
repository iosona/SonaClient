import ModalWindow, { ModalWindowProps } from "./ModalWindow";
import { Typography } from "@mui/material";
import { WinButton } from "./WinButton";

export default function ClientVerificationModal({
    open,
    onClose
}: Omit<ModalWindowProps, 'children'>) {
  return (
    <ModalWindow contentWidth="400px" open={open} onClose={onClose}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
            Не удалось выполнить верификацию
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
            Не удалось установить соединение с сервером, так как ваш клиент не прошел верификацию.
            Возможно, вы используете неофициальное приложение или его версия устарела.
        </Typography>
        <WinButton 
            accent
            fullWidth
            variant="outlined"
            onClick={() => onClose && onClose({}, "backdropClick")}
        >
            OK
        </WinButton>
    </ModalWindow>
  );
}