import React, { HTMLAttributes } from 'react';
import QRCode from 'react-qr-code';

interface QrCodeProps extends HTMLAttributes<HTMLDivElement> {
  value: string; 
  size?: number;
}

const QrCodeDisplay: React.FC<QrCodeProps> = ({ 
    value, 
    size = 128,
    style,
    ...props
}) => {
  return (
    <div style={{ background: 'white', padding: '16px', ...style }} {...props}>
      <QRCode 
        value={value} 
        size={size} 
        bgColor="#FFFFFF" 
        fgColor="#000000"
        level="M" 
      />
    </div>
  );
};

export default QrCodeDisplay;
