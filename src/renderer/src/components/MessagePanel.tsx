import { Paper, PaperProps } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { FC, FormEvent, useState, useRef } from "react";
import { WinIconButton } from "./WinIconButton";
import { WinTextField } from "./WinTextField";
import { useMenu } from "@renderer/hooks/useMenu";
import { useTranslation } from "react-i18next";

export interface MessagePanelProps extends PaperProps {
    onMessage?: (message: string) => void;
}

const MessagePanel: FC<MessagePanelProps> = ({
    onMessage,
    ...props
}) => {
    const [message, setMessage] = useState<string>('');
    const commandMenu = useMenu();
    const formRef = useRef<HTMLFormElement>(null);
    const { t } = useTranslation();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim() || message.length > 1000) return;
        onMessage?.(message);
        setMessage('');
        commandMenu.handleClose();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setMessage(val);

        if (val === '/') {
            commandMenu.handleOpen({ currentTarget: formRef.current } as any);
        } else if (!val.startsWith('/') || val === '') {
            commandMenu.handleClose();
        }
    };

    return (
        <Paper 
            elevation={0}
            sx={{
                p: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                boxSizing: 'border-box',
                borderRadius: 0,
                position: 'relative',
                bgcolor: 'transparent',
                ...props.sx
            }}
            {...props}
        >
            <form 
                ref={formRef}
                onSubmit={handleSubmit} 
                style={{ 
                    display: 'flex', 
                    width: '100%', 
                    alignItems: 'center', 
                    gap: '8px' 
                }}
            >
                <WinTextField 
                    value={message}
                    autoFocus
                    onChange={handleInputChange}
                    placeholder={ t("WriteMessage") }
                    size="small"
                    sx={{ 
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                            transition: 'all 0.3s ease',
                            '&.Mui-focused': {
                                boxShadow: '0 0 12px rgba(96, 205, 255, 0.3)',
                            }
                        }
                    }}
                />

                <WinIconButton 
                    type="submit"
                    disabled={!message.trim()}
                    accent
                >
                    <SendIcon fontSize="small" sx={{ fontSize: 18 }} />
                </WinIconButton>
            </form>
        </Paper>
    );
}

export default MessagePanel;
