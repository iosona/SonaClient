import { Paper, InputBase, IconButton, PaperProps } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { FC, FormEvent, useState } from "react";

export interface MessagePanelProps extends PaperProps {
    onMessage?: (message: string) => void;
}

const MessagePanel: FC<MessagePanelProps> = ({
    onMessage,
    ...props
}) => {
    const [message, setMessage] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim() || message.length > 1000) {
            return;
        }
        onMessage?.(message);
        setMessage('');
    }

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
                ...props.sx
            }}
            {...props}
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '8px' }}>
                <InputBase
                    value={message}
                    autoFocus
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Написать сообщение..."
                    sx={{ 
                        flex: 1,
                        fontSize: '0.9rem',
                        color: '#fff',
                        bgcolor: 'rgba(255,255,255,0.03)',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '4px',
                        '& input::placeholder': {
                            color: 'rgba(255, 255, 255, 0.4)',
                            opacity: 1
                        }
                    }}
                />
                <IconButton 
                    type="submit"
                    disabled={!message.trim()}
                    sx={{ 
                        p: '8px',
                        borderRadius: '6px',
                        bgcolor: message.trim() ? '#60cdff' : 'rgba(255,255,255,0.05)',
                        color: message.trim() ? '#000' : 'rgba(255,255,255,0.3)',
                        '&:hover': {
                            bgcolor: message.trim() ? '#56b8e6' : 'rgba(255,255,255,0.1)',
                        },
                        transition: 'all 0.2s ease',
                        width: 36,
                        height: 36,
                        flexShrink: 0
                    }}
                >
                    <SendIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </form>
        </Paper>
    );
}

export default MessagePanel;