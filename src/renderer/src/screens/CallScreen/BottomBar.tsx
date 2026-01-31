import { CallEnd, Mic, MicOff, ScreenShare, Settings, Sms, StopScreenShare } from "@mui/icons-material";
import { Badge, Box, BoxProps, Divider, Paper, Stack } from "@mui/material";
import LeaveConfirm from "@renderer/components/LeaveConfirm";
import SettingsModal from "@renderer/components/Settings/SettingsModal";
import { WinIconButton } from "@renderer/components/WinIconButton";
import { Client } from "@renderer/types";
import { Dispatch, FC, SetStateAction } from "react";

export interface BottomBarProps extends BoxProps {
    unreadMessages: number
    isMessage: boolean,
    setIsMessage: Dispatch<SetStateAction<boolean>>,
    sharingClient: Client | null
    isShareDisabled: boolean;
    handleShareClick: () => void;
    leave: () => void;
    isMeMuted: boolean
    muteMe: () => void
}

const BottomBar: FC<BottomBarProps> = ({
    unreadMessages,
    isMessage,
    setIsMessage,
    isShareDisabled,
    sharingClient,
    handleShareClick,
    leave,
    isMeMuted,
    muteMe,
    sx,
    ...props
}) => {
    return (
        <Box sx={{ 
            pb: 3, pt: 1,
            display: 'flex', 
            justifyContent: 'center',
            zIndex: 1000,
            ...sx
        }} {...props}>
              <Paper
                elevation={24}
                sx={{ 
                  py: 1.2, px: 2, 
                  borderRadius: '12px',
                  bgcolor: '#2c2c2c',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}
              >
                <Stack direction="row" spacing={1} sx={{ px: 1 }}>
                  <Badge badgeContent={unreadMessages} color="error">
                    <WinIconButton 
                      onClick={() => setIsMessage(prev => !prev)}
                      accent={isMessage}
                    >
                        <Sms fontSize="small" />
                    </WinIconButton>
                  </Badge>
                  <SettingsModal>
                    <WinIconButton>
                      <Settings fontSize="small" />
                    </WinIconButton>
                  </SettingsModal>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 0.5 }} />
                <Stack direction="row" spacing={2} sx={{ px: 1 }}>
                  <WinIconButton
                    onClick={handleShareClick}
                    disabled={isShareDisabled}
                    accent={sharingClient?.isShared}
                  >
                    {sharingClient?.isShared ? <StopScreenShare /> : <ScreenShare />}
                  </WinIconButton>
                  <WinIconButton 
                    onClick={muteMe}
                    error={isMeMuted}
                  >
                    {isMeMuted ? <MicOff /> : <Mic />}
                  </WinIconButton>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 0.5 }} />
                <LeaveConfirm onLeave={leave}>
                  <WinIconButton error>
                    <CallEnd />
                  </WinIconButton>
                </LeaveConfirm>
              </Paper>
          </Box>  
    )
}

export default BottomBar;