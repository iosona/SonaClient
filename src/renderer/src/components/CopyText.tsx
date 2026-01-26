import { CopyAll } from "@mui/icons-material";
import { Box, BoxProps, IconButton, Typography } from "@mui/material";
import { FC } from "react";

const CopyText: FC<BoxProps> = ({
    children,
    sx,
    ...props
}) => {
    const onCopy = () => {
        const val = children?.toString();
        if (!val)
            return;
        navigator.clipboard.writeText(val);
    }

    return (
        <Box sx={{
            display: 'flex',
            gap: '8px',
            width: '100%',
            paddingLeft: '4px',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px',
            boxShadow: 'none',
            ...sx
        }} {...props}>
            <Typography noWrap>
                { children }
            </Typography>
            <IconButton onClick={onCopy}>
                <CopyAll />
            </IconButton>
        </Box>
    )
}

export default CopyText;