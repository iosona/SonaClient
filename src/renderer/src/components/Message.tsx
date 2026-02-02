import { Paper, Avatar, Typography, keyframes, PaperProps, Box, Link } from "@mui/material";
import { UserData } from "@renderer/types";
import { getAvatarSrcById, getHexColorByUsername } from "@renderer/utils";
import Linkify from "linkify-react";
import { FC, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export interface MessageProps extends PaperProps {
    message: string
    userData?: UserData
    onVisible?: () => void;
}

const Message: FC<MessageProps> = ({
    message,
    userData,
    onVisible
}) => {
    const messageRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (!messageRef.current) {
            return;
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    onVisible && onVisible();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(messageRef.current);
    }, []);

    const userName = userData?.userName || t("Anonymous")

    const options = {
        attributes: {
            onClick: (event) => {
                    event.preventDefault();
                    const url = event.currentTarget.href;
                    window.api.openUrl(url);
                }
        },
        render: ({ attributes, content }) => {
            const { href, ...props } = attributes;
            return (
                <Link href={href} {...props}>
                    {content}
                </Link>
            );
        }
    };

    return (
        <Paper
            ref={messageRef}
            elevation={0}
            sx={{
                animation: `${slideUp} 0.2s ease-out forwards`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.2,
                p: '8px 12px',
                borderRadius: '6px',
                width: '100%',
                maxWidth: '100%',        
                bgcolor: 'transparent',
                '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                },
                transition: 'background 0.2s ease',
                pointerEvents: 'auto',
            }}
        >
            <Avatar 
                src={getAvatarSrcById(userData?.avatarId || null)} 
                sx={{ 
                    width: 24, 
                    height: 24, 
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    bgcolor: getHexColorByUsername(userName),
                    borderRadius: '4px',
                    mt: 0.2
                }} 
            >
                { userData?.userName[0].toUpperCase() }
            </Avatar>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2, minWidth: 0 }}>
                <Typography 
                    sx={{ 
                        fontSize: '0.8rem', 
                        fontWeight: 700,
                        color: getHexColorByUsername(userName),
                        lineHeight: 1,
                        mb: 0.5
                    }}
                >
                    { userName }
                </Typography>
                
                <Typography 
                    sx={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.85)',
                        wordBreak: 'break-word',
                        lineHeight: 1.4,
                        letterSpacing: '0.2px',
                        userSelect: 'text'
                    }}
                >
                    <Linkify options={options}>
                        { message }
                    </Linkify>
                </Typography>
            </Box>
        </Paper>
    );
};

export default Message;