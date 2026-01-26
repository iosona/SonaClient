import { Paper, styled, alpha } from "@mui/material";

export const WindowsCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '12px',
    backgroundColor: alpha('#202020', 0.7),
    backdropFilter: 'blur(30px) saturate(125%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    textAlign: 'center',
}));