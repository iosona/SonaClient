import { Box, BoxProps, Paper, Typography } from "@mui/material";
import { FC } from "react";
import { WinIconButton } from "../WinIconButton";
import { Edit } from "@mui/icons-material";
import KeyBindEditor from "./KeyBindEditor";

export interface KeyBindProps extends BoxProps {
    keybind: string;
    label: string;
    onBindChange?: (newBind: string) => void;
}

const KeyBind: FC<KeyBindProps> = ({
    keybind,
    label,
    onBindChange,
    sx,
    ...props
}) => {
    return (
        <Box sx={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between'
        }} {...props}>
            <Typography variant="subtitle2">
                { label }
            </Typography>
            <Paper sx={{
                paddingLeft: '5px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                boxShadow: 'none'
            }}>
                <Typography variant="caption" color="textDisabled">
                    { keybind }
                </Typography>
                <KeyBindEditor action={label}>
                    <WinIconButton sx={{
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '0px 6px 6px 0px'
                    }} size="small">
                        <Edit fontSize="small" />
                    </WinIconButton>
                </KeyBindEditor>
            </Paper>
        </Box>
    )
}

export default KeyBind;