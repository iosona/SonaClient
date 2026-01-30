import { CopyAll } from "@mui/icons-material";
import { Box, BoxProps, Typography } from "@mui/material";
import { FC } from "react";
import { WinIconButton } from "./WinIconButton";

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
            <WinIconButton size="small" onClick={onCopy}>
                <CopyAll fontSize="small" />
            </WinIconButton>
        </Box>
    )
}

export default CopyText;