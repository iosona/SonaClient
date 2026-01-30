import styled from "@emotion/styled";
import { alpha, Menu } from "@mui/material";

export const WinMenu = styled(Menu)({
    '& .MuiPaper-root': {
        backgroundColor: '#1a1a1a',
        backgroundImage: 'none',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(96, 205, 255, 0.1)',
        marginTop: '8px',
        minWidth: '150px',
    },
    '& .MuiMenuItem-root': {
        fontSize: '0.85rem',
        color: 'rgba(255, 255, 255, 0.8)',
        padding: '8px 16px',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: alpha('#60cdff', 0.1),
            color: '#60cdff',
        },
        '&.Mui-selected': {
            backgroundColor: alpha('#60cdff', 0.15),
            color: '#60cdff',
        }
    },
});