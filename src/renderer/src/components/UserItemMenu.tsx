import { Box, Menu, Stack, Typography } from "@mui/material";
import { useMenu } from "@renderer/hooks/useMenu";
import { UserData } from "@renderer/types";
import { getAvatarSrcById, getHexColorByUsername, getUIFromVolume } from "@renderer/utils";
import { FC, JSX, useMemo } from "react";
import WinSlider from "./WinSlider";

export interface UserItemMenuProps {
    children: JSX.Element;
    onVolumeChange?: (volume: number) => void;
    isActive?: boolean
    userData: UserData
    volume: number
}

const UserItemMenu: FC<UserItemMenuProps> = ({
    children,
    onVolumeChange,
    volume,
    userData,
    isActive = true
}) => {
    const { anchorEl, open, handleClose, handleOpen } = useMenu();

    const data = useMemo(() => getUIFromVolume(volume), [volume]);


    return (
        <>
            <children.type {...children.props} onClick={handleOpen} />
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}                
                PaperProps={{
                    sx: {
                    '& .MuiList-root': {
                        paddingTop: 0,
                        paddingBottom: 0,
                    },
                    },
                }}
            >
                <Box sx={{
                    width: '200px',
                    paddingTop: '0px !important',
                }}>
                    <Box 
                        sx={{ 
                            position: 'relative', 
                            width: "100%",       
                            height: 200,
                            overflow: 'hidden'
                        }}
                    >
                        <Box
                            component={!userData.avatarId ? "div" : "img"}
                            src={getAvatarSrcById(userData.avatarId || null)}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                                userSelect: 'none',
                                bgcolor: getHexColorByUsername(userData.userName)
                            }}
                        >
                            {
                                !userData.avatarId
                                ?
                                <Typography variant="h1">
                                    { userData.userName[0] }
                                </Typography>
                                : undefined
                            }
                        </Box>
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                p: 2,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                            }}
                        >
                            <Typography sx={{ color: 'white' }} variant="subtitle2">
                                { userData.userName }
                            </Typography>
                        </Box>
                    </Box>
                    {
                        isActive
                        &&
                        <Stack marginTop="15px" spacing={2} direction="row" alignItems="center" sx={{
                            padding: "5px 15px 5px 15px",
                            paddingBottom: '15px'
                        }}>
                            {
                                data
                                &&
                                <data.icon />
                            }
                            <WinSlider
                                value={volume}
                                onChange={(_, val: any) => onVolumeChange && onVolumeChange(val)} 
                                min={0}
                                color={data?.color as any}
                                max={100}
                                step={1}
                            />
                        </Stack>
                    }
                </Box>
            </Menu>
        </>
    )
}

export default UserItemMenu;