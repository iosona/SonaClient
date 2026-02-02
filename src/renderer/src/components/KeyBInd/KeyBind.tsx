import { Box, BoxProps, Paper, Typography } from "@mui/material";
import { FC } from "react";
import { WinIconButton } from "../WinIconButton";
import { Edit } from "@mui/icons-material";
import KeyBindEditor from "./KeyBindEditor";
import { IKeyBind } from "@renderer/types";
import { useTranslation } from "react-i18next";

export interface KeyBindProps extends BoxProps {
    keybind: IKeyBind
    onBindChange?: (newBind: string) => void;
}

const KeyBind: FC<KeyBindProps> = ({
    keybind,
    onBindChange,
    sx,
    ...props
}) => {
    const { t } = useTranslation();

    return (
        <Box sx={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between'
        }} {...props}>
            <Typography variant="subtitle2">
                { t(keybind.event) }
            </Typography>
            <Paper sx={{
                paddingLeft: '5px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                boxShadow: 'none'
            }}>
                <Typography variant="caption" color="textDisabled">
                    { keybind.keys.map(key => key === "CONTROL" ? "CTRL" : key).join(" + ") }
                </Typography>
                <KeyBindEditor keybind={keybind}>
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