import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function AlertContainer() {
  const { alerts, removeAlert } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBackground = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 space-y-2 max-w-md z-50">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center gap-3 p-4 border rounded-lg ${getBackground(alert.type)}`}
        >
          {getIcon(alert.type)}
          <span className="flex-1 text-sm font-medium">{alert.message}</span>
          <button
            onClick={() => removeAlert(alert.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
