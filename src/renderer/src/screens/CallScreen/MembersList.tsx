import { AddCircle } from "@mui/icons-material";
import { Box, BoxProps, ListItemButton, Paper, Typography } from "@mui/material";
import InviteModal from "@renderer/components/InviteModal";
import UserItem from "@renderer/components/UserItem";
import { useStorage } from "@renderer/providers/useStorage";
import { Client } from "@renderer/types";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export interface MembersListProps extends BoxProps {
    sharingClient: Client | null;
    displayStream: MediaStream | null;
}

const MembersList: FC<MembersListProps> = ({
    sharingClient,
    displayStream,
    sx,
    ...props
}) => {
    const { clients, roomId } = useStorage();
    const { t } = useTranslation();

    return (
        <Box sx={{
            width: sharingClient?.isShared || displayStream ? '300px' : '100%',
            maxWidth: sharingClient?.isShared || displayStream ? '300px' : '800px',
            mx: 'auto',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            ...sx
        }} {...props}>
            <Paper elevation={0} sx={{ 
                bgcolor: '#252525', 
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '100%'
                }}>
                <Box sx={{ overflowY: 'auto', flex: 1 }}>
                    {clients.map((client, index) => (
                    <UserItem
                        key={client.id} 
                        isTopBordered={index === 0} 
                        client={client} 
                    />
                    ))}
                </Box>

                <InviteModal id={roomId || ''}>
                    <ListItemButton sx={{
                        py: 2,
                        gap: 2,
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
                    }}>
                    <AddCircle sx={{ color: '#60cdff' }} />
                    <Typography sx={{ color: '#60cdff', fontWeight: 500, fontSize: '0.85rem' }}>
                        { t("InviteMembers") }
                    </Typography>
                    </ListItemButton>
                </InviteModal>
            </Paper>
        </Box>
    )
}

export default MembersList;