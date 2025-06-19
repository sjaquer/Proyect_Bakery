import React from 'react';
import { QrCode, Banknote } from 'lucide-react';

interface PaymentMethodIconProps extends React.SVGProps<SVGSVGElement> {
  method: string | undefined;
}

const PaymentMethodIcon: React.FC<PaymentMethodIconProps> = ({ method, ...props }) => {
  if (method === 'yape') return <QrCode {...props} />;
  if (method === 'cash') return <Banknote {...props} />;
  return null;
};

export default PaymentMethodIcon;
