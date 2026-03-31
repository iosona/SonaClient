import { CastConnected, Computer, Delete, Dns, Edit, Link } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import DeleteServerConfirm from "@renderer/components/DeleteServerConfirm";
import NewServerModal from "@renderer/components/NewServerModal";
import { WindowsCard } from "@renderer/components/WindowsCard";
import { WinIconButton } from "@renderer/components/WinIconButton";
import { IServerInfo } from "@renderer/types";
import { FC, useEffect, useState } from "react";

export interface ServerItem {
    handleSaveServer: (data: IServerInfo) => void;
    handleDeleteServer: (id: number) => void;
    handleConnect: () => void;
    server: IServerInfo
}

export const ServerItem: FC<ServerItem> = ({
    handleDeleteServer,
    handleSaveServer,
    handleConnect,
    server
}) => {
    const [isOnline, setIsOnline] = useState<boolean>(false);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            const result = await window.api.pingServer(server.ip, server.port)
            setIsOnline(result);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [server]);

    return (
        <WindowsCard
            variant="outlined" 
            sx={{ 
                bgcolor: 'transparent',
                border: '1px solid rgba(255,255,255,0.05)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                padding: '5px'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', p: '0px 16px' }}>
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                        width: 6, height: 6, borderRadius: '50%', 
                        bgcolor: isOnline ? '#4caf50' : '#333' 
                    }} />
                    <Typography sx={{ fontSize: '0.85rem', color: isOnline ? '#fff' : '#666' }}>
                        {server.name}
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.8rem', color: '#888', fontFamily: 'monospace' }}>
                        {server.ip}
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.8rem', color: '#888' }}>
                        {server.port}
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                    <WinIconButton onClick={handleConnect} disabled={!isOnline} size='small'>
                        <Link color='success' sx={{ fontSize: 18 }} />
                    </WinIconButton>
                    <NewServerModal onSave={handleSaveServer} defaultData={server}>
                        <WinIconButton size='small'>
                            <Edit color='info' sx={{ fontSize: 18 }} />
                        </WinIconButton>
                    </NewServerModal>
                    <DeleteServerConfirm onDelete={() => handleDeleteServer(server.id)}>
                        <WinIconButton size='small'>
                            <Delete color='error' sx={{ fontSize: 18 }} />
                        </WinIconButton>
                    </DeleteServerConfirm>
                </Box>
            </Box>
        </WindowsCard>
    )
}