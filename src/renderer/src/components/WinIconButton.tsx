import { IconButton, styled } from "@mui/material";

export const WinIconButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'accent',
})<{ accent?: boolean, error?: boolean }>(({ accent, error }) => ({
    textTransform: 'none',
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    ...(accent ? {
        backgroundColor: '#60cdff',
        color: '#000',
        border: '1px solid #60cdff',
        '&:hover': { backgroundColor: '#56b8e6' },
        '&:disabled': {
            border: '1px solid rgba(255,255,255,0.1)',
        }
    } : 
      error
      ?
        {
            backgroundColor: '#e81123',
            border: '1px solid transparent',
            color: 'white', 
            '&:hover': { backgroundColor: '#c40e1d' },
        }
        :
        {
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' },
        }
    ),
    
}));