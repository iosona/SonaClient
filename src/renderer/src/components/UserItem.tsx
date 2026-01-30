import { Mic, MicOff } from "@mui/icons-material";
import { Avatar, Box, CircularProgress, ListItemAvatar, ListItemButton, ListItemButtonProps, ListItemText, Typography } from "@mui/material";
import { useSocket } from "@renderer/providers/useSocket";
import { useStorage } from "@renderer/providers/useStorage";
import { Client } from "@renderer/types";
import { getAvatarSrcById, getHexColorByUsername, getUIFromVolume } from "@renderer/utils";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import UserItemMenu from "./UserItemMenu";
import hark from 'hark'
import { logger } from "@renderer/logger";
import { useTranslation } from "react-i18next";

export interface UserItemProps extends ListItemButtonProps {
    client: Client
    isTopBordered?: boolean;
}

const UserItem: FC<UserItemProps> = ({
    client,
    isTopBordered = false,
    sx,
    ...props
}) => {
    const color = useMemo(() => getHexColorByUsername(client.userData.userName), [client]);
    const audioRef = useRef<HTMLAudioElement>(null);
    const { socket } = useSocket();
    const { mediaDevsIds } = useStorage();
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(100);
    const { t } = useTranslation();

    const isMe = socket?.id === client.id;
    const soundUI = useMemo(() => getUIFromVolume(volume), [volume]);
    const userStatus = useMemo(() => {
        if (!client.isStreamReady) {
            return {
                color: 'primary',
                label: t("Connection")
            }
        }
        if (isSpeaking) {
            return {
                color: 'success',
                label: t("Speaking")
            }
        }
        if (client.peer?.closed || client.peer?.errored || client.peer?.destroyed) {
            return {
                color: 'error',
                label: t("ConnectionError")
            }
        }

        return {
            color: 'primary',
            label: t("Listen")
        }
    }, [client, isSpeaking]);

    useEffect(() => {
        if (!client.audioStream || !audioRef.current) {
            return;
        }
        if (socket?.id !== client.id) {
            audioRef.current.srcObject = client.audioStream || null;
            logger.debug("Audio stream set to player");
        }

        audioRef.current.play().catch(err => {
            logger.error("Autoplay error:", err);
        })
        
        const speechEvents = hark(client.audioStream, {
            interval: 100,
            threshold: -60
        })

        speechEvents.on('speaking', () => setIsSpeaking(true));
        speechEvents.on('stopped_speaking', () => setIsSpeaking(false));

        return () => {
            if (audioRef.current) {
                audioRef.current.srcObject = null;
            }
            speechEvents.stop()
        }
    }, [client.audioStream]);

    useEffect(() => {
        if (mediaDevsIds.outputAudioDevice && audioRef.current) {
            audioRef.current.setSinkId(mediaDevsIds.outputAudioDevice);
            logger.debug("Audio output device updated");
        }
    }, [mediaDevsIds.outputAudioDevice]);

    const handleChangeVolume = (_v: number) => {
        if (!audioRef.current) return;
        audioRef.current.volume = _v / 100;
        setVolume(_v);
    }

    return (
        <UserItemMenu userData={client.userData} isActive={!isMe} onVolumeChange={handleChangeVolume}>
            <ListItemButton
                sx={{
                    display: 'flex',
                    width: '100%',
                    gap: '16px',
                    position: 'relative',
                    boxShadow: 'none',
                    borderRadius: isTopBordered ? '10px 10px 0px 0px' : '0px',
                    ...sx
                }}
                {...props}
            >
                <ListItemAvatar>
                    <Avatar src={client.isStreamReady ? getAvatarSrcById(client.userData.avatarId || null) : undefined} sx={{ 
                        width: 45, 
                        height: 45,
                        bgcolor: color,
                        fontSize: '1.2rem',
                        outline: isSpeaking ? '3px solid #2e7d32' : 'none',
                        outlineOffset: '2px',
                        transition: 'outline 0.2s ease-in-out'
                    }}>
                        {
                            client.isStreamReady
                            ?
                            client.userData.userName[0]
                            :
                            <CircularProgress color="inherit" size={25} />
                        }
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    sx={{ display: 'flex', flexDirection: 'column', gap: '0px' }}
                    primary={
                        <Typography 
                            variant="subtitle2" 
                            noWrap
                            textOverflow="ellipsis"
                            style={{  display: 'flex', gap: '8px' }}
                        >
                            { client.userData.userName }
                        </Typography>
                    }
                    secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color={userStatus.color} sx={{
                                display: 'flex',
                                gap: '4px'
                            }}>
                                { 
                                    client.id === socket?.id
                                    &&
                                    <Typography variant="caption" color="success">({ t("You") })</Typography> 
                                }
                                { userStatus.label }
                            </Typography>
                            {
                                !isMe
                                &&
                                <Box sx={{ display: 'flex', gap: '5px' }}>
                                    {
                                        soundUI
                                        &&
                                        <soundUI.icon sx={{ fontSize: '16px' }} />
                                    }
                                    <Typography variant="caption">{ volume }%</Typography>
                                </Box>    
                            }                      
                        </Box>
                    }
                >
                </ListItemText>
                { 
                    client.isMuted 
                    ? <MicOff color="disabled" />
                    : <Mic color={isSpeaking ? "success" : 'disabled'} /> 
                }
                <audio ref={audioRef} style={{ display: 'none' }} />
            </ListItemButton>
        </UserItemMenu>
    )
}

export default UserItem;