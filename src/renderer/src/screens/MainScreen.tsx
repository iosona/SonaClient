import { Add } from "@mui/icons-material";
import { Container, Divider,Stack, Typography } from "@mui/material";
import ConnectionIndicator from "@renderer/components/ConnectionIndicator";
import UserDataModal from "@renderer/components/UserDataModal";
import { WinButton } from "@renderer/components/WinButton";
import { WindowsCard } from "@renderer/components/WindowsCard";
import { WinLayout } from "@renderer/components/WinLayout";
import { WinTextField } from "@renderer/components/WinTextField";
import { useModal } from "@renderer/hooks/useModal";
import { EmitEvent, EmitStatus, EventHandler } from "@renderer/providers/SocketProvider.types";
import { useSocket } from "@renderer/providers/useSocket";
import { useStorage } from "@renderer/providers/useStorage";
import { ServerClient, UserData } from "@renderer/types";
import { useSnackbar } from "notistack";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";

const MainScreen: FC = () => {
    const [roomId, setRoomId] = useState<string>('');
    const { setRoomId: _setRoomId, createClient, setClients } = useStorage();
    const { subscribeEvent, unsubscribeEvent, emitEvent, isConnected, socket } = useSocket();
    const { enqueueSnackbar } = useSnackbar();
    const userDataModal = useModal();

    useEffect(() => {
        if (!isConnected) {
            return;
        }

        const setupRoom = (roomId: string, users: ServerClient[]) => {
            _setRoomId(roomId);
            setClients(users.map(user => ({
                ...user,
                peer: null,
                isStreamReady: user.id === socket?.id,
                audioStream: null,
                displayStream: null
            })));
        }

        const joinRoomHandler: EventHandler = (status, data) => {
            switch(status) {
                case EmitStatus.ERROR:
                    enqueueSnackbar({
                        variant: 'error',
                        message: 'Комната с таким ID не найдена'
                    });
                    break;
                case EmitStatus.SUCCESS:
                    setupRoom(data.roomId, data.users);
                    break;
            }
        }
        
        const createRoomHandler: EventHandler = (status, data) => {
             switch(status) {
                case EmitStatus.ERROR:
                    enqueueSnackbar({
                        variant: 'error',
                        message: `Ошибка: ${data.detail}`
                    });
                    break;
                case EmitStatus.SUCCESS:
                    setupRoom(data.id, []);
                    createClient({
                        id: data.userId,
                        userData: data.userData,
                        peer: null,
                        isMuted: false,
                        isShared: false,
                        isStreamReady: true,
                        displayStream: null,
                        audioStream: null
                    });
                    break;
            }
        }

        subscribeEvent(EmitEvent.JOIN_ROOM, joinRoomHandler)
        subscribeEvent(EmitEvent.CREATE_ROOM, createRoomHandler)

        return () => {
            unsubscribeEvent(EmitEvent.JOIN_ROOM, joinRoomHandler);
            unsubscribeEvent(EmitEvent.CREATE_ROOM, createRoomHandler);
        }
    }, [isConnected]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!roomId.trim() || !isConnected) {
            return;
        }
        userDataModal.handleOpen({ caller: 'LOGIN' });
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRoomId(e.target.value);
    }

    const handleUserData = (data: UserData) => {
        if (userDataModal.data.caller === 'LOGIN') {
            emitEvent(EmitEvent.JOIN_ROOM, { roomId, userData: data });
        }
        else if (userDataModal.data.caller === 'CREATE') {
            emitEvent(EmitEvent.CREATE_ROOM, { userData: data });
        }
    }

    const handleCreateRoom = () => {
        userDataModal.handleOpen({ caller: "CREATE" })
    }

    return (
        <WinLayout>
            <UserDataModal 
                {...userDataModal} 
                onClose={userDataModal.handleClose} 
                onSubmitData={handleUserData}
            />
            <ConnectionIndicator style={{ 
                position: 'absolute', 
                top: '45px', 
                left: '10px' 
            }} />

            <Container maxWidth="xs">
                <WindowsCard>
                    <Typography variant="h5" fontWeight="600" color="#fff">Sona</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3, display: 'block' }}>
                        Собрания и звонки
                    </Typography>

                    <Stack spacing={2}>
                        <WinButton disabled={!isConnected} accent startIcon={<Add />} onClick={handleCreateRoom}>
                            Создать комнату
                        </WinButton>
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                            <Typography variant="caption" color="rgba(255,255,255,0.3)">или</Typography>
                        </Divider>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={1.5}>
                                <WinTextField
                                    fullWidth 
                                    size="small" 
                                    value={roomId} 
                                    onChange={handleChange} 
                                    placeholder="Введите ID"
                                    type="password"
                                />
                                <WinButton disabled={!isConnected} type="submit" fullWidth>
                                    Присоединиться
                                </WinButton>
                            </Stack>
                        </form>
                    </Stack>
                </WindowsCard>
            </Container>
        </WinLayout>
    );
}

export default MainScreen;
