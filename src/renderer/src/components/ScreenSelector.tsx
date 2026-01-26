import { useEffect, useState } from "react";
import ModalWindow from "./ModalWindow";
import { Box, ImageList, ImageListItem, ImageListItemBar, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { WinButton } from "./WinButton";

export interface DisplayInfo {
    displayId: string;
    isSound: boolean
}

export interface ScreenSelectorProps {
    onSelect?: (info: DisplayInfo) => void;
    onClose?: () => void;
    open: boolean;
}

export default function ScreenSelector({
    open,
    onClose,
    onSelect
}: ScreenSelectorProps) {
  const [screens, setScreens] = useState<any[]>([]);
  const [screenId, setScreenId] = useState<string | null>(null);
  const [isSound, _] = useState<boolean>(false);

  useEffect(() => {
    if (!open) {
        setScreens([]);
        setScreenId(null);
        return;
    }
    window.api.getScreenSources().then(setScreens);
  }, [open]);

  const handleConfirm = () => {
    if (onSelect && screenId) {
        onSelect({ displayId: screenId, isSound });
    }
  };

  return (
    <ModalWindow open={open} onClose={onClose} contentWidth="520px">
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
            Демонстрация экрана
        </Typography>
        
        <ImageList 
            cols={2} 
            gap={16} 
            sx={{ 
                width: '100%', 
                maxHeight: 420,
                overflowY: 'auto',
                p: 1,
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }
            }}
        >
            {screens.map((screen) => {
                const isSelected = screen.id === screenId;
                return (
                    <ImageListItem 
                        key={screen.id}
                        onClick={() => setScreenId(isSelected ? null : screen.id)}
                        sx={{
                            cursor: 'pointer',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            position: 'relative',
                            outline: isSelected ? `2px solid #60cdff` : '1px solid rgba(255,255,255,0.1)',
                            outlineOffset: '2px',
                            backgroundColor: '#000',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                outline: isSelected ? `2px solid #60cdff` : '1px solid rgba(255,255,255,0.4)',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        <img 
                            src={screen.image} 
                            alt={screen.name} 
                            loading="lazy" 
                            style={{ 
                                height: '140px', 
                                objectFit: 'contain',
                                opacity: isSelected ? 1 : 0.8 
                            }}
                        />
                        <ImageListItemBar
                            title={
                                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                    {screen.name}
                                </Typography>
                            }
                            sx={{
                                background: 'rgba(32, 32, 32, 0.85)',
                                height: '36px',
                                '& .MuiImageListItemBar-titleWrap': { p: '0 12px' }
                            }}
                            actionIcon={
                                isSelected && (
                                    <CheckCircle sx={{ color: '#60cdff', fontSize: 18, mr: 1 }} />
                                )
                            }
                        />
                    </ImageListItem>
                );
            })}
        </ImageList>

        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mt: 2,
            pt: 2,
            borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
            {/*<FormControlLabel 
                control={
                    <Checkbox 
                        checked={isSound} 
                        onChange={e => setIsSound(e.target.checked)}
                        sx={{ 
                            color: 'rgba(255,255,255,0.3)',
                            '&.Mui-checked': { color: '#60cdff' }
                        }} 
                    />
                } 
                label={
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Транслировать звук
                    </Typography>
                } 
            />*/}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
                <WinButton onClick={onClose} sx={{ minWidth: '100px' }}>
                    Отмена
                </WinButton>
                <WinButton 
                    accent 
                    disabled={!screenId}
                    onClick={handleConfirm}
                    sx={{ minWidth: '120px' }}
                >
                    Начать показ
                </WinButton>
            </Box>
        </Box>
    </ModalWindow>
  );
}
