import { ArrowDownward, Chat, DeleteSweepOutlined, ForumOutlined } from "@mui/icons-material";
import { alpha, Badge, Box, Fab, IconButton, Stack, Typography } from "@mui/material";
import Message from "./Message";
import { useStorage } from "@renderer/providers/useStorage";
import MessagePanel from "./MessagePanel";
import { useSocket } from "@renderer/providers/useSocket";
import { EmitEvent } from "@renderer/providers/SocketProvider.types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageItem } from "@renderer/types";

export function ChatPanel() {
    const { messages, clients, setMessages } = useStorage();
    const messagesRef = useRef<HTMLDivElement>(null);
    const { emitEvent, socket } = useSocket();
    const [isFullScrolled, setIsFullScrolled] = useState<boolean>(true);

    const handleScroll = () => {
        messagesRef.current?.scrollTo({ 
            behavior: 'smooth', 
            top: messagesRef.current.scrollHeight 
        });
    }

    const handleSendMessage = (message: string) => {
        emitEvent(EmitEvent.SEND_MESSAGE, { message });
    }

    const handleClearChat = () => {
        setMessages([]);
    }

    const unreadMessages = useMemo(() => {
        return messages.filter(msg => !msg.isRead).length;
    }, [messages]);

    useEffect(() => {
        if (messages.length === 0) {
            setIsFullScrolled(true);
        }
        if (isFullScrolled || messages[messages.length - 1]?.userId === socket?.id) {
            handleScroll();
        }
    }, [messages.length]);

    const handleVisible = useCallback((message: MessageItem) => {
        if (message.isRead) {
            return;
        };
        setMessages(prev => prev.map(msg => {
            if (msg.id === message.id) {
                return {
                    ...msg,
                    isRead: true
                }
            }
            return msg;
        }))
    }, [messages]);

    useEffect(() => {
        messagesRef.current?.addEventListener("scroll", () => {
            const offset = Number(messagesRef.current?.scrollHeight) - (Number(messagesRef.current?.scrollTop) + Number(messagesRef.current?.clientHeight))
            const scrolled = offset <= 100;
            setIsFullScrolled(scrolled);
        });
    }, []);

    return (
        <Box sx={{
            width: '30%',
            marginTop: '32px',
            bgcolor: '#111111',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 32px)', 
            position: 'relative',
            boxSizing: 'border-box'
        }}>
            <Box sx={{ 
                px: 3, py: 1.5, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                flexShrink: 0
            }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ bgcolor: alpha('#60cdff', 0.1), p: 0.5, borderRadius: 1, display: 'flex' }}>
                        <Chat sx={{ color: '#60cdff', fontSize: 20 }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                        чат
                    </Typography>
                </Stack>
                <IconButton 
                    size="small" 
                    sx={{ borderRadius: '0px' }} 
                    color="error"
                    onClick={handleClearChat}
                >
                    <DeleteSweepOutlined fontSize="small" color="error" />
                </IconButton>
            </Box>
            <div ref={messagesRef} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '15px',
                flex: '1 1 auto',
                overflowY: 'auto'
            }}>
                {
                    !messages.length
                    ?
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        textAlign: 'center'
                    }}>
                        <ForumOutlined color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="body2" color="textDisabled">
                            Сообщений пока нет
                        </Typography>
                    </Box>
                    :
                    messages.map((message, index) => (
                        <Message
                            key={index}
                            message={message.message} 
                            onVisible={() => handleVisible(message)}
                            userData={clients.find(c => c.id === message.userId)?.userData} 
                        />
                    ))
                }
            </div>
            <MessagePanel onMessage={handleSendMessage} />
            {
                !isFullScrolled
                &&
                <div style={{
                    position: 'absolute',
                    right: '20px',
                    bottom: '80px'
                }}>
                    <Badge badgeContent={unreadMessages} color="error">
                        <Fab onClick={handleScroll} size="small" color="info">
                            <ArrowDownward />
                        </Fab>
                    </Badge>
                </div>
            }
        </Box>
    )
}