import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastNotificationProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastStyles: Record<ToastType, string> = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
};

const ToastNotification = ({ message, type, onClose }: ToastNotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Desaparece automáticamente después de 3 segundos

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-2xl z-50 animate-fade-in-down ${toastStyles[type]}`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg">{message}</span>
        <button onClick={onClose} className="ml-4 text-xl font-bold leading-none">&times;</button>
      </div>
    </div>
  );
};

export default ToastNotification;
