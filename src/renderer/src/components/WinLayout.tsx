import { Box, styled } from "@mui/material";

export const WinLayout = styled(Box)({
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1e2a4a 0%, #111827 100%)',
    backgroundImage: `radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
                      radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)`,
    overflow: 'hidden',
});
