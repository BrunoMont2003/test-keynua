import { CheckCircle, Eye, Clock } from 'lucide-react';
import type { ContractStatusData } from '../../../services/api/contracts.api';

interface SignersListProps {
  users: ContractStatusData['users'];
}

export const SignersList: React.FC<SignersListProps> = ({ users }) => {
  const getStatusIcon = (status: string) => {
    const baseClasses = "w-6 h-6";
    switch (status) {
      case 'signed':
        return <CheckCircle size={24} className={`${baseClasses} text-green-600`} />;
      case 'viewed':
        return <Eye size={24} className={`${baseClasses} text-blue-500`} />;
      default:
        return <Clock size={24} className={`${baseClasses} text-gray-400`} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'signed':
        return <span className={`${baseClasses} bg-green-50 text-green-700`}>Firmado</span>;
      case 'viewed':
        return <span className={`${baseClasses} bg-blue-50 text-blue-700`}>Visto</span>;
      default:
        return <span className={`${baseClasses} bg-gray-50 text-gray-700`}>Pendiente</span>;
    }
  };

  const getItemBgColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-50';
      case 'viewed':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="space-y-2">
      {users.map((user, index) => (
        <div key={index} className={`flex items-start gap-4 p-4 rounded-lg border border-gray-200 ${getItemBgColor(user.status)}`}>
          <div className="flex-shrink-0 pt-1">
            {getStatusIcon(user.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-600 break-all">{user.email}</div>
            {user.signedAt && (
              <div className="text-xs text-gray-500 mt-1">
                Firmado {new Date(user.signedAt).toLocaleString('es-PE', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            {getStatusBadge(user.status)}
          </div>
        </div>
      ))}
    </div>
  );
};
