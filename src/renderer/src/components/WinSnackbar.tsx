import { styled } from "@mui/material";
import { MaterialDesignContent } from "notistack";

export const WinSnackbar = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent": {
    borderRadius: '4px',
    padding: '6px 16px',
    fontSize: '0.9rem',
    fontWeight: 500,
    fontFamily: 'inherit',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s ease',
  },

  "&.notistack-MuiContent-success": {
    backgroundColor: '#60cdff',
    color: '#000',
    boxShadow: '0 4px 12px rgba(96, 205, 255, 0.3)',
  },

  "&.notistack-MuiContent-info, &.notistack-MuiContent-default": {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  },

  "& .SnackbarItem-variantSuccess .MuiSvgIcon-root": {
    color: '#000',
  }
}));