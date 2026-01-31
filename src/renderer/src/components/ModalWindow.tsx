import Modal, { ModalProps } from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';
import { Fade } from '@mui/material';
import { WindowsCard } from './WindowsCard';

export interface ModalWindowProps extends Omit<ModalProps, 'children'> {
    children: ReactNode
    contentWidth?: string
    contentHeight?: string
}

export default function ModalWindow({
    children,
    contentWidth = '400px',
    contentHeight = 'auto',
    ...props
}: ModalWindowProps) {
  return (
    <Modal 
      closeAfterTransition 
      slotProps={{
        backdrop: {
          timeout: 200,
          sx: { 
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }
        },
      }} 
      {...props}
    >
      <Fade in={props.open}>
          <Box sx={{
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              outline: 'none',
              maxWidth: '95vw', 
              maxHeight: '95vh', 
              display: 'flex'
          }}>
              <WindowsCard sx={{ 
                width: contentWidth, 
                height: contentHeight,
                p: 4, 
                textAlign: 'left',
                maxHeight: '95vh', 
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}>
                  { children }
              </WindowsCard>
          </Box>
      </Fade>
  </Modal>
  );
}