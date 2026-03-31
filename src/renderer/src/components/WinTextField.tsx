import { TextField, TextFieldProps, styled } from "@mui/material";
import { useState } from 'react';
import { InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { WinIconButton } from '@renderer/components/WinIconButton';

export const WinTextField = styled(TextField)({
    '& .MuiInputBase-input': {
        padding: '8px 12px',
        fontFamily: 'monospace',
        '&::placeholder': {
            color: 'rgba(255,255,255,0.3)',
            opacity: 1,
        },
    },
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
        display: 'none',
        margin: 0,
    },

    '& input[type=number]': {
        MozAppearance: 'textfield',
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '0.85rem',
        transition: 'all 0.2s',
        '& fieldset': { 
            borderColor: 'rgba(255,255,255,0.1)',
            transition: 'border-color 0.2s',
        },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
        '&.Mui-focused': {
            backgroundColor: 'rgba(0,0,0,0.4)',
            '& fieldset': { 
                borderColor: '#60cdff', 
                borderWidth: '1px',
                boxShadow: '0 0 8px rgba(96, 205, 255, 0.2)' 
            },
        }
    },
});

export const PasswordField = (props: TextFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <WinTextField
            type={showPassword ? 'text' : 'password'}
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end" sx={{ mr: -1 }}>
                        <WinIconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                            size="small"
                            sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                        >
                            {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                        </WinIconButton>
                    </InputAdornment>
                ),
            }}
            {...props}
        />
    );
};