import { useModal } from "@renderer/hooks/useModal";
import { FormEvent, JSX, useEffect, useState } from "react";
import ModalWindow from "./ModalWindow";
import { Box, Typography } from "@mui/material";
import { WinButton } from "./WinButton";
import { IServerInfo } from "@renderer/types";
import { PasswordField, WinTextField } from "./WinTextField";
import { WinToggle } from "./WinToggle";
import { getRandomInteger } from "@renderer/utils";

export interface NewServerModalProps {
    children: JSX.Element
    defaultData?: IServerInfo
    onSave?: (data: IServerInfo) => void;
}

export default function NewServerModal({
    children,
    defaultData,
    onSave
}: NewServerModalProps) {
  const def = {
    id: getRandomInteger(1, 100000),
    name: "",
    ip: "",
    port: undefined,
    masterPassword: "",
    isRemember: false
  }

  const { open, handleClose, handleOpen } = useModal();
  const [data, setData] = useState<IServerInfo>(def as any);

  const setField = (key: keyof IServerInfo, value: any) => {
    setData(prev => ({...prev, [key]: value}));
  }

  useEffect(() => {
    if (!defaultData) return;
    setData(defaultData);
  }, [defaultData]);

  const handleCancel = () => {
    handleClose();
  }

  const handleSave = () => {
    if (!data.ip.trim() || !data.port || !data.name.trim()) {
        return;
    }
    onSave && onSave(data);
    handleCancel();
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSave();
  }

  const isEdit = Boolean(defaultData)

  return (
    <>
        <children.type {...children.props} onClick={handleOpen} />
        <ModalWindow open={open} onClose={handleClose}>
            <Typography variant="h6">
               {
                isEdit ? "Редактировать сервер" : "Новый сервер"
               }
            </Typography>
            <Box onSubmit={handleSubmit} component='form' sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                outline: 'none',
                marginTop: '10px'
            }}>
                <WinTextField
                    size="small"
                    placeholder="Название"
                    value={data.name}
                    onChange={e => setField('name', e.target.value)}
                />
                <Box sx={{
                    display: 'flex',
                    gap: '4px',
                    width: '100%'
                }}>
                    <WinTextField
                        size="small"
                        placeholder="IP-Адрес"
                        value={data.ip}
                        onChange={e => setField('ip', e.target.value)}
                        sx={{ width: '150%' }}
                    />
                    <WinTextField
                        size="small"
                        placeholder="Порт"
                        value={data.port}
                        type="number" 
                        onChange={e => setField('port', e.target.value)}
                    />
                </Box>
                <PasswordField
                    placeholder="Пароль (если есть)"
                    value={data.masterPassword}
                    onChange={e => setField('masterPassword', e.target.value)}
                />
                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <WinToggle checked={data.isRemember} onChange={(_, c) => setField('isRemember', c)} />
                    <Typography color="textDisabled" variant="caption">
                        Запомнить пароль
                    </Typography>
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px'
            }}>
                <WinButton 
                    onClick={handleCancel}
                    fullWidth
                    sx={{ marginLeft: 'auto'}}
                >    
                    Отмена
                </WinButton>
                <WinButton 
                    accent
                    onClick={handleSave}
                    fullWidth
                    sx={{ marginLeft: 'auto' }}
                >    
                    Сохранить
                </WinButton>
            </Box>
        </ModalWindow>
    </>
  );
}
