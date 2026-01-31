import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import { FC } from "react";

interface SettingsCategoryProps extends BoxProps {
    title: string
    titleProps?: TypographyProps
    subTitle?: string;
}

export const SettingsCategory: FC<SettingsCategoryProps> = ({
    title,
    sx,
    children,
    titleProps,
    subTitle,
    ...props
}) => {
    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '6px',
            ...sx 
        }} {...props}>
            <Typography variant="body2" color="info" sx={{ 
                fontWeight: 500,
                ...titleProps?.sx
            }} {...titleProps}>
                { title }
            </Typography>
            { children }
            {
                subTitle
                &&
                <Typography variant="caption" color="textDisabled">
                    {subTitle}
                </Typography>
            }
        </Box>
    )
}