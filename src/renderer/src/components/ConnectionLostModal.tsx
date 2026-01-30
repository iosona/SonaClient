import ModalWindow, { ModalWindowProps } from "./ModalWindow";
import { Typography } from "@mui/material";
import { WinButton } from "./WinButton";
import { useTranslation } from "react-i18next";

export default function ConnectionLostModal({
    open,
    onClose
}: Omit<ModalWindowProps, 'children'>) {
  const { t } = useTranslation();

  return (
    <ModalWindow contentWidth="400px" open={open} onClose={onClose}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
            { t("ConnectionLostTitle") }
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
            { t("ConnectionLostText") }
        </Typography>
        <WinButton
            variant="outlined"
            fullWidth
            accent
            onClick={() => onClose && onClose({}, "backdropClick")}
        >
            { t("OK") }
        </WinButton>
    </ModalWindow>
  );
}