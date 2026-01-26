import { FormEvent, useState } from "react";
import { 
  Box, 
  Avatar, 
  IconButton, 
  Typography, 
  Stack,
  alpha,
  Tooltip
} from "@mui/material";
import ModalWindow, { ModalWindowProps } from "./ModalWindow";
import { avatarsList } from "@renderer/constants";
import { getAvatarSrcById, getHexColorByUsername } from "@renderer/utils";
import { ChevronRight, Close, ListAlt, PhotoCamera } from "@mui/icons-material";
import { WinTextField } from "./WinTextField";
import { WinButton } from "./WinButton";
import { UserData } from "@renderer/types";

export interface UserDataModalProps extends Omit<ModalWindowProps, 'children'>
{
    onSubmitData?: (data: UserData) => void;
}

export default function UserDataModal({
  open,
  onClose,
  onSubmitData
}: UserDataModalProps) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const avatarSrc = getAvatarSrcById(selectedAvatar);

  const handleClose = () => onClose && onClose({}, "escapeKeyDown");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmitData?.({
        userName: name,
        avatarId: selectedAvatar
    });
    handleClose();
  }

  return (
    <ModalWindow contentWidth="360px" open={open} onClose={onClose}>
      <IconButton 
        onClick={handleClose} 
        size="small"
        sx={{ 
          position: 'absolute', 
          right: 8, 
          top: 8, 
          color: 'rgba(255,255,255,0.5)'
        }}
      >
        <Close fontSize="small" />
      </IconButton>

      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ mb: 3, fontWeight: 600, color: '#fff', letterSpacing: -0.2 }}
        >
          Настройка профиля
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar 
                  src={avatarSrc || ""} 
                  sx={{ 
                    width: 96, 
                    height: 96, 
                    fontSize: '2.5rem',
                    color: '#fff',
                    bgcolor: getHexColorByUsername(name),
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                >
                  {!avatarSrc && (name ? name[0].toUpperCase() : "?")}
                </Avatar>
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 0, 
                  bgcolor: '#333', 
                  borderRadius: '50%', 
                  p: 0.5,
                  width: '32px',
                  height: '32px',
                  border: '2px solid #2c2c2c'
                }}>
                  <PhotoCamera sx={{ 
                    fontSize: 16, 
                    color: '#60cdff',
                    width: '16px',
                    height: '16px'
                   }}/>
                </Box>
              </Box>
            </Box>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: 1, 
              p: 1,
              bgcolor: 'rgba(0,0,0,0.2)',
              borderRadius: '8px',
              width: '100%'
            }}>
              {
                avatarsList.length
                ?
                avatarsList.map((avatar) => (
                    <Tooltip key={avatar.id} title="Выбрать" arrow>
                      <Box 
                        onClick={() => setSelectedAvatar(selectedAvatar === avatar.id ? null : avatar.id)}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: '4px',
                          p: 0.5,
                          display: 'flex',
                          transition: '0.2s',
                          width: '50px',
                          height: '50px',
                          backgroundColor: selectedAvatar === avatar.id ? alpha('#60cdff', 0.2) : 'transparent',
                          '&:hover': { backgroundColor: alpha('#fff', 0.05) }
                        }}
                      >
                        <Avatar 
                          src={avatar.src} 
                          sx={{ 
                            width: 42, 
                            height: 42, 
                            border: selectedAvatar === avatar.id ? '2px solid #60cdff' : '1px solid transparent'
                          }} 
                        />
                      </Box>
                    </Tooltip>
                  ))
                :
                <Typography sx={{
                  display: 'flex',
                  gap: '5px',
                  justifyContent: 'center',
                  alignItems: 'center'
                }} color="textDisabled" variant="caption" whiteSpace="nowrap">
                  <ListAlt />
                  Список фото пуст
                </Typography>
              }
            </Box>
            <WinTextField
              fullWidth
              autoFocus
              size="small"
              label="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к вам обращаться?"
            />
            <WinButton
              fullWidth 
              accent
              endIcon={<ChevronRight />}
              type="submit"
            >
              Готово
            </WinButton>
          </Stack>
        </form>
      </Box>
    </ModalWindow>
  );
}