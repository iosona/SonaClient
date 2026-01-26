import { Close, CropSquare, Minimize } from '@mui/icons-material';
import { IconButton, Box, Stack, Typography, alpha } from '@mui/material';
import { VERSION } from '@renderer/constants';

export const TitleBar: React.FC = () => {
  return (
    <Box sx={{ 
      height: 32,
      display: 'flex', 
      alignItems: 'center',
      WebkitAppRegion: 'drag',
      zIndex: (theme) => theme.zIndex.modal + 2000,
      backgroundColor: alpha('#202020', 0.8),
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
    }}>
      <Typography 
        variant='caption' 
        sx={{ 
          ml: 1.5, 
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '0.7rem',
          fontFamily: '"Segoe UI Variable", "Segoe UI", sans-serif',
          fontWeight: 400,
          userSelect: 'none'
        }}
      >
        Sona Client { VERSION }
      </Typography>

      <Stack direction="row" sx={{ ml: 'auto', height: '100%', WebkitAppRegion: 'none' }}>
        <IconButton 
          onClick={window.api.minimize} 
          sx={{ 
            borderRadius: 0, 
            width: 46, 
            height: '100%',
            color: 'rgba(255, 255, 255, 0.8)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
          }}
        >
          <Minimize sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton 
          onClick={window.api.maximize} 
          sx={{ 
            borderRadius: 0, 
            width: 46, 
            height: '100%',
            color: 'rgba(255, 255, 255, 0.8)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
          }}
        >
          <CropSquare sx={{ fontSize: 14 }} />
        </IconButton>
        <IconButton 
          onClick={window.api.close} 
          sx={{ 
            borderRadius: 0, 
            width: 46, 
            height: '100%',
            color: 'rgba(255, 255, 255, 0.8)',
            '&:hover': { 
              backgroundColor: '#e81123', 
              color: '#fff' 
            },
            '&:active': {
              backgroundColor: '#f1707a',
              color: '#fff'
            }
          }}
        >
          <Close sx={{ fontSize: 18 }} />
        </IconButton>
      </Stack>
    </Box>
  )
};