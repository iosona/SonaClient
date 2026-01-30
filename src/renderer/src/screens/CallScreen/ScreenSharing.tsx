import { Box, CircularProgress, Paper, PaperProps, Typography } from "@mui/material";
import { Client } from "@renderer/types";
import { FC, RefObject } from "react";

export interface ScreenSharingProps extends PaperProps {
    sharingClient: Client | null;
    screenVideoRef: RefObject<HTMLVideoElement | null>
}

const ScreenSharing: FC<ScreenSharingProps> = ({
    sharingClient,
    screenVideoRef,
    sx,
    ...props
}) => {
    if (!sharingClient?.isShared) {
        return <></>
    }

    return (
        <Paper
            elevation={0}
            sx={{ 
                flex: 1, 
                bgcolor: '#000', 
                borderRadius: '8px', 
                overflow: 'hidden',
                border: '2px solid #60cdff',
                boxShadow: '0 0 20px rgba(96, 205, 255, 0.2)',
                position: 'relative',
                ...sx
            }}
            {...props}
        >
            <video autoPlay playsInline ref={screenVideoRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            <Box sx={{ 
                position: 'absolute', 
                top: 12, 
                left: 12, 
                bgcolor: 'rgba(0,0,0,0.6)', 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 1 
            }}>
                <Typography variant="caption" sx={{ color: '#fff' }}>{sharingClient.userData?.userName}</Typography>
            </Box>
            {
                !screenVideoRef.current?.played
                &&
                <Box sx={{ 
                    position: 'absolute',
                    top: '50%', 
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <CircularProgress size={50} />
                </Box>
            }
        </Paper>
    )
}

export default ScreenSharing;