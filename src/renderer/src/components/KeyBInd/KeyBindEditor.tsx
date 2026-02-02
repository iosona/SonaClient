import { useModal } from "@renderer/hooks/useModal";
import { JSX, useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ModalWindow from "../ModalWindow";
import { WinButton } from "../WinButton";
import { WinIconButton } from "../WinIconButton";
import { Close } from "@mui/icons-material";
import { ALLOWED_SIMPLE_KEYS, ALLOWED_SPECIAL_KEYS } from "@renderer/constants";
import { useKeyBind } from "@renderer/providers/useKeyBind";
import { IKeyBind } from "@renderer/types";

export interface KeyBindEditorProps {
    children: JSX.Element
    keybind: IKeyBind
}

export default function KeyBindEditor({
    children,
    keybind
}: KeyBindEditorProps) {
  const { open, handleClose, handleOpen } = useModal();
  const { t } = useTranslation();
  const [keyBind, setKeyBind] = useState<string[]>([]);
  const { keybinds, updateKeyBind } = useKeyBind();
  const [isWrongKeyBind, setIsWrongKeyBind] = useState<boolean>(false);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
        if (!open) return;
        
        const key = e.key.toUpperCase();

        if (ALLOWED_SPECIAL_KEYS.includes(key)) {
            const displayKey = key === 'CONTROL' ? 'CTRL' : key;
            setKeyBind(prev => [displayKey, prev[1] || '']);
        }
        else if (ALLOWED_SIMPLE_KEYS.includes(key)) {
            setKeyBind(prev => [prev[0] || '', key]);
        }
    }
    
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open]);

  useEffect(() => {
    if (keyBind.length !== 2) return;
    if (keybinds.find(bind => {
        const firstKey = keyBind[0] === "CTRL" ? "CONTROL" : keyBind[0];
        return bind.keys[0] === firstKey && bind.keys[1] === keyBind[1]
    })) {
        setIsWrongKeyBind(true);
    }
    else {
        setIsWrongKeyBind(false)
    }
  }, [keybinds, keyBind]);

  const handleOk = () => {
    if (isWrongKeyBind || keyBind.length !== 2) return;
    updateKeyBind(keybind.event, { keys: [keyBind[0] === "CTRL" ? "CONTROL" : keyBind[0], keyBind[1]] });
    handleClose();
    setKeyBind([]);
  }

  return (
    <>
        <children.type {...children.props} onClick={handleOpen} />
        <ModalWindow open={open} onClose={handleClose} contentWidth="360px">
            <WinIconButton
                onClick={handleClose} 
                size="small"
                sx={{ 
                    position: 'absolute', 
                    right: 8, 
                    top: 8
                }}
            >
                <Close fontSize="small" />
            </WinIconButton>
            
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff' }}>
                { t("ChangeHotKey") }
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                { t("Action") }<b>{ t(keybind.event) }</b>
            </Typography>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                <Paper sx={{ 
                    width: '64px', 
                    height: '64px', 
                    padding: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    { keyBind[0] }
                </Paper>
                +
                <Paper sx={{ 
                    width: '64px', 
                    height: '64px', 
                    padding: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    { keyBind[1] }
                </Paper>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 1.5, marginTop: '20px' }}>
                <Typography variant="caption" color="textDisabled">
                    { 
                        isWrongKeyBind
                        ? t("HotKeyIsAlreadyInUse")
                        : t("StartEnterHotKey")
                    }
                </Typography>
                <WinButton disabled={isWrongKeyBind} accent fullWidth onClick={handleOk}>
                    { t("OK") }
                </WinButton>
            </Box>
        </ModalWindow>
    </>
  );
}
