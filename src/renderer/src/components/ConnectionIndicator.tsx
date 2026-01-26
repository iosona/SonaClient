import { FiberManualRecord } from "@mui/icons-material"
import { Box, BoxProps, Tooltip, Typography, alpha, keyframes } from "@mui/material"
import { useSocket } from "@renderer/providers/useSocket"
import { FC } from "react"

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

const ConnectionIndicator: FC<BoxProps> = (props) => {
    const { isConnected, isVerificationError } = useSocket();

    const statusColor = isVerificationError 
        ? '#ff99a4'
        : isConnected 
            ? '#6ccb5f'
            : '#ffb900';

    const statusText = isVerificationError 
        ? 'Ошибка верификации' 
        : isConnected 
            ? 'В сети' 
            : 'Подключение...';

    return (
        <Tooltip 
            arrow
            placement="bottom"
            title={
                isVerificationError
                ? 'Клиент не прошёл верификацию.'
                : isConnected
                ? 'Защищенное соединение установлено.'
                : 'Попытка установить соединение с сервером Sona...'
            }
        >
            <Box 
                display="flex" 
                alignItems="center" 
                gap={1.2} 
                {...props}
                sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '20px',
                    backgroundColor: alpha(statusColor, 0.05),
                    border: `1px solid ${alpha(statusColor, 0.2)}`,
                    transition: 'all 0.3s ease',
                    cursor: 'help',
                    userSelect: 'none',
                    ...props.sx
                }}
            >
                <Box sx={{ position: 'relative', display: 'flex' }}>
                    <FiberManualRecord
                        sx={{
                            color: statusColor,
                            fontSize: 10,
                            filter: isConnected ? `drop-shadow(0 0 4px ${statusColor})` : 'none',
                            animation: !isConnected && !isVerificationError ? `${pulse} 1.5s infinite ease-in-out` : 'none'
                        }}
                    />
                </Box>
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: alpha('#fff', 0.8),
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        fontFamily: '"Segoe UI Variable", "Segoe UI", sans-serif',
                        letterSpacing: '0.02em'
                    }}
                >
                    {statusText}
                </Typography>
            </Box>
        </Tooltip>
    )   
}

export default ConnectionIndicator;