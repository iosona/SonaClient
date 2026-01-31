import { Button, styled } from "@mui/material";

export const WinButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'accent',
})<{ accent?: boolean }>(({ accent }) => ({
    textTransform: 'none',
    borderRadius: '4px',
    padding: '6px 16px',
    fontWeight: 500,
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    ...(accent ? {
        backgroundColor: '#60cdff',
        color: '#000',
        border: '1px solid transparent',
        '&:hover': { backgroundColor: '#56b8e6' },
        '&:disabled': {
            opacity: "0.8",
            color: "#000"
        }
    } : {
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)',
        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' },
    }),
}));