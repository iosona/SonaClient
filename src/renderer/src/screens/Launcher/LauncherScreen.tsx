import { FC, useEffect, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Storage, Add } from '@mui/icons-material';
import { WinLayout } from '@renderer/components/WinLayout';
import { WinIconButton } from '@renderer/components/WinIconButton';
import { IServerInfo } from '@renderer/types';
import NewServerModal from '@renderer/components/NewServerModal';
import { WinButton } from '@renderer/components/WinButton';
import { ServerItem } from './ServerItem';
import { useSocket } from '@renderer/providers/useSocket';
import ConnectionLostModal from '@renderer/components/ConnectionLostModal';
import { useModal } from '@renderer/hooks/useModal';
import ServerPasswordModal from '@renderer/components/ServerPasswordModal';

export const LauncherScreen: FC = () => {
    const [servers, setServers] = useState<IServerInfo[]>([]);
    const { connectServer } = useSocket();
    const connectionLostModal = useModal();
    const passwordModal = useModal();

    const refreshList = async () => {
        const result = await window.api.getServers();
        setServers(result);
    }

    useEffect(() => {
       refreshList(); 
    }, []);

    const handleDeleteServer = async (id: number) => {
        await window.api.deleteServer(id);
        await refreshList();
    }

    const handleSaveServer = async (data: IServerInfo) => {
        await window.api.saveServer(data);
        await refreshList(); 
    }

    const handleConnect = async (data: IServerInfo, isError: boolean = false) => {
        const status = await connectServer(data);
        if (status === undefined) {
            passwordModal.handleOpen({
                ...data,
                isError
            });
        }
        else if (status === false) {
            connectionLostModal.handleOpen();
        }
        console.log(status);
    }
    
    return (
        <WinLayout sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '20px'
        }}> 
            <ServerPasswordModal
                open={passwordModal.open}
                onClose={passwordModal.handleClose}
                onSubmitPassword={password => handleConnect({
                    ...passwordModal.data,
                    masterPassword: password
                }, true)}
                isError={passwordModal.data?.isError}
            />
            <ConnectionLostModal
                open={connectionLostModal.open}
                onClose={connectionLostModal.handleClose}
            />
            <Box sx={{ 
                flexGrow: 1, 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                width: '100%',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Typography variant='button' color='textDisabled'>
                        Sona Client 1.0.4
                    </Typography>
                </Box>
                <NewServerModal onSave={handleSaveServer}>
                    <WinIconButton size='small' sx={{
                        position: 'absolute',
                        top: '20px',
                        right: '90px'
                    }}>
                        <Add fontSize='small' />
                    </WinIconButton>
                </NewServerModal>
                
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    px: 2, 
                    mb: 1, 
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    pb: 1,
                    opacity: 0.3,
                    marginTop: '10px'
                }}>
                    <Typography sx={{ flex: 2, fontSize: '10px', fontWeight: 800, letterSpacing: '1px' }}>СЕРВЕР</Typography>
                    <Typography sx={{ flex: 1, fontSize: '10px', fontWeight: 800, letterSpacing: '1px', textAlign: 'center' }}>IP</Typography>
                    <Typography sx={{ flex: 1, fontSize: '10px', fontWeight: 800, letterSpacing: '1px', textAlign: 'center' }}>ПОРТ</Typography>
                    <Typography sx={{ flex: 1, fontSize: '10px', fontWeight: 800, letterSpacing: '1px', textAlign: 'center' }}>ОПЦИИ</Typography>
                </Box>
                <Stack 
                    spacing={0.5} 
                    sx={{
                        overflowY: 'auto', 
                        flexGrow: 1,
                        pr: 1,
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-track': { background: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '2px' },
                        '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255,255,255,0.2)' }
                    }}
                >
                    {
                        !servers.length
                        &&
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '50vh', 
                            gap: '20px',
                            opacity: 0.8  
                        }}>
                            <Box sx={{ 
                                position: 'relative', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center' 
                            }}>
                                <Box sx={{
                                    position: 'absolute',
                                    width: '80px',
                                    height: '80px',
                                    bgcolor: 'info.main',
                                    borderRadius: '50%',
                                    filter: 'blur(45px)',
                                    opacity: 0.15, 
                                    animation: 'pulse 3s infinite ease-in-out' 
                                }} />

                                <Storage color='info' sx={{
                                    fontSize: '72px', 
                                    filter: 'drop-shadow(0 0 10px rgba(2, 136, 209, 0.3))', 
                                    zIndex  : 1
                                }} />
                            </Box>

                            <Typography 
                                variant='button' 
                                color='info' 
                                sx={{ 
                                    letterSpacing: '2px', 
                                    fontWeight: 600,
                                    textShadow: '0 0 15px rgba(2, 136, 209, 0.4)',
                                    opacity: 0.7
                                }}
                            >
                                Список серверов пуст
                            </Typography>
                            <NewServerModal onSave={handleSaveServer}>
                                <WinButton startIcon={<Add />}>
                                    Добавить сервер
                                </WinButton>
                            </NewServerModal>
                            <style>
                                {`
                                    @keyframes pulse {
                                        0% { transform: scale(1); opacity: 0.15; }
                                        50% { transform: scale(1.4); opacity: 0.25; }
                                        100% { transform: scale(1); opacity: 0.15; }
                                    }
                                `}
                            </style>
                        </Box>
                    }
                    {servers.map((server, index) => (
                        <ServerItem 
                            key={index} 
                            server={server} 
                            handleConnect={() => handleConnect(server)}
                            handleDeleteServer={handleDeleteServer}
                            handleSaveServer={handleSaveServer}
                        />
                    ))}
                </Stack>
            </Box>
        </WinLayout>
    );
};