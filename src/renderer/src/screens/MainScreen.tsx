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
import { useTranslation } from "react-i18next";

const MainScreen: FC = () => {
    const [roomId, setRoomId] = useState<string>('');
    const { setRoomId: _setRoomId, createClient, setClients } = useStorage();
    const { subscribeEvent, unsubscribeEvent, emitEvent, isConnected, socket } = useSocket();
    const { enqueueSnackbar } = useSnackbar();
    const userDataModal = useModal();
    const { t } = useTranslation();

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
                displayStream: null,
                volume: 100
            })));
        }

        const joinRoomHandler: EventHandler = (status, data) => {
            switch(status) {
                case EmitStatus.ERROR:
                    let errorMessage = t("UnknownError");
                    if (typeof data.detail === 'string' && data.detail.includes("not found")) {
                        errorMessage = t("RoomNotFound");
                    }
                    enqueueSnackbar({
                        variant: 'error',
                        message: errorMessage
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
                    let errorDetail = data.detail;
                
                    if (typeof data.detail === 'object') {
                        errorDetail = t("UnknownError");
                    }
                    enqueueSnackbar({
                        variant: 'error',
                        message: errorDetail
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
                        audioStream: null,
                        volume: 100
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
                       { t("MeetingsAndCalls") }
                    </Typography>

                    <Stack spacing={2}>
                        <WinButton disabled={!isConnected} accent startIcon={<Add />} onClick={handleCreateRoom}>
                            { t("CreateRoom") }
                        </WinButton>
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                            <Typography variant="caption" color="rgba(255,255,255,0.3)">{ t("Or") }</Typography>
                        </Divider>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={1.5}>
                                <WinTextField
                                    fullWidth 
                                    size="small" 
                                    value={roomId} 
                                    onChange={handleChange} 
                                    placeholder={ t("EnterRoomID") }
                                    type="password"
                                />
                                <WinButton disabled={!isConnected} type="submit" fullWidth>
                                    { t("Join") }
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
