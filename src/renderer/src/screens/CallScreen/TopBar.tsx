import { People } from "@mui/icons-material";
import { alpha, Box, BoxProps, Stack, Typography } from "@mui/material";
import { useStorage } from "@renderer/providers/useStorage";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export interface TopBarProps extends BoxProps {
    callTime: string
}

const TopBar: FC<TopBarProps> = ({
    callTime,
    sx,
    ...props
}) => {
    const { clients } = useStorage();
    const { t } = useTranslation();

    return (
        <Box sx={{ 
            px: 3, py: 1.5, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            ...sx
        }} {...props}>
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ bgcolor: alpha('#60cdff', 0.1), p: 0.5, borderRadius: 1, display: 'flex' }}>
                <People sx={{ color: '#60cdff', fontSize: 20 }} />
                </Box>
                <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>
                    { t("VoiceChat") }
                    <Box component="span" sx={{ color: 'rgba(255,255,255,0.4)', ml: 1 }}>{clients.length}</Box>
                </Typography>
            </Stack>
            <Typography color="textDisabled">
                { callTime }
            </Typography>
        </Box>
    )
}

export default TopBar;

/*
lang
you
select
new message
enter id
*/