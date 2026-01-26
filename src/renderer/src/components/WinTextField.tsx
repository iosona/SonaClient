import { TextField, styled } from "@mui/material";

export const WinTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '0.9rem',
        transition: 'background-color 0.2s',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
        '&.Mui-focused': {
            backgroundColor: 'rgba(0,0,0,0.4)',
            '& fieldset': { borderColor: '#60cdff', borderWidth: '1px' },
        }
    },
});