import { Switch, styled } from "@mui/material";

export const WinToggle = styled(Switch)(() => ({
    width: 40,
    height: 20,
    padding: 0,
    display: 'flex',
    '&.Mui-disabled': {
        pointerEvents: 'none !important',
        cursor: 'not-allowed !important',
    },

    '& .MuiSwitch-switchBase': {
        padding: 5,
        transition: 'all 0.2s ease',
    
        '&.Mui-disabled .MuiSwitch-input': {
            pointerEvents: 'none !important',
        },
        '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: '#000',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#60cdff !important',
                border: '1px solid transparent',
            },
            '& .MuiSwitch-thumb': {
                backgroundColor: '#000',
                width: 10,
                height: 10,
            },
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.2) !important',
        },
    },

    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        backgroundColor: '#fff',
        width: 8,
        height: 8,
        borderRadius: '50%',
        transition: 'all 0.2s ease',
    },

    '& .MuiSwitch-track': {
        borderRadius: 10,
        opacity: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
    },

    '&:hover .MuiSwitch-track': {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.3)',
    }
}));