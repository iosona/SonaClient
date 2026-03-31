import { useModal } from "@renderer/hooks/useModal";
import { FormEvent, JSX, useEffect, useState } from "react";
import ModalWindow, { ModalWindowProps } from "./ModalWindow";
import { Box, Typography } from "@mui/material";
import { WinButton } from "./WinButton";
import { IServerInfo } from "@renderer/types";
import { PasswordField, WinTextField } from "./WinTextField";
import { WinToggle } from "./WinToggle";
import { getRandomInteger } from "@renderer/utils";

export interface ServerPasswordModalProps extends Omit<ModalWindowProps, 'children'> {
    onSubmitPassword?: (password: string) => void;
    isError?: boolean
}

export default function ServerPasswordModal({
    onSubmitPassword,
    open,
    onClose,
    isError = false
}: ServerPasswordModalProps) {
  const [password, setPassword] = useState<string>('');

  const handleClose = () => {
    onClose && onClose({}, 'escapeKeyDown')
    setPassword('');
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitPassword && onSubmitPassword(password);
    handleClose();
  }

  return (
    <>
        <ModalWindow open={open} onClose={onClose}>
            <Typography variant="h6">
               Введите пароль от сервера
            </Typography>
            <Typography color="textDisabled" variant="caption">
                Если вы видите это окно, значит, для подключения требуется пароль либо текущий пароль неверен
            </Typography>
            <Box onSubmit={handleSubmit} component='form' sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                outline: 'none',
                marginTop: '10px'
            }}>
                <PasswordField
                    placeholder="Пароль"
                    value={password}
                    error={isError}
                    onChange={e => setPassword(e.target.value)}
                />
                <Box sx={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '20px'
                }}>
                    <WinButton 
                        onClick={handleClose}
                        fullWidth
                        type="button"
                        sx={{ marginLeft: 'auto'}}
                    >    
                        Отмена
                    </WinButton>
                    <WinButton 
                        accent
                        type="submit"
                        fullWidth
                        sx={{ marginLeft: 'auto' }}
                    >    
                        Подтвердить
                    </WinButton>
                </Box>
            </Box>
            
        </ModalWindow>
    </>
  );
}
