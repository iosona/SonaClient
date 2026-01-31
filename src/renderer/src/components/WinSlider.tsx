import { Box, Slider, SliderProps, Typography } from "@mui/material";
import { FC } from "react";

export interface WinSliderProps extends SliderProps {
    leftLabel?: string;
    rightLabel?: string;
    isThumb?: boolean
}

const WinSlider: FC<WinSliderProps> = ({
    leftLabel,
    rightLabel,
    isThumb,
    sx,
    ...props
}) => {
    return (
        <Box sx={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'center', 
            alignItems: 'center',
            whiteSpace: 'nowrap',
            width: '100%'
        }}>
            {
                leftLabel
                &&
                <Typography variant="caption" color="textDisabled">
                    { leftLabel } 
                </Typography>
            }
            <Slider
                sx={{
                    '& .MuiSlider-thumb': {
                        display: !isThumb ? 'none' : 'flex',
                        width: '12px',
                        height: '12px'
                    },
                    '& .MuiSlider-rail': {
                        opacity: 0.5,
                        backgroundColor: '#bfbfbf',
                        borderRadius: '0px'
                    },
                    '& .MuiSlider-track': {
                        border: 'none',
                        borderRadius: '0px'
                    },
                    ...sx
                }}
                {...props}
            />
            {
                rightLabel
                &&
                <Typography variant="caption" color="textDisabled">
                    { rightLabel }
                </Typography>
            }
        </Box>
        
    )
}

export default WinSlider;