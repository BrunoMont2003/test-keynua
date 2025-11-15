import type { ContractStatusData } from '../../../services/api/contracts.api';

interface TimelineProps {
  events: ContractStatusData['webhookEvents'];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="relative">
      {events.map((event, index) => (
        <div key={index} className="flex gap-4 pb-8 last:pb-0">
          {/* Timeline dot and line */}
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5" />
            {index !== events.length - 1 && (
              <div className="w-0.5 h-12 bg-gray-300 mt-2" />
            )}
          </div>
          
          {/* Event content */}
          <div className="pt-1 pb-4">
            <div className="font-medium text-gray-900">{event.event}</div>
            <div className="text-sm text-gray-500 mt-1">
              {new Date(event.timestamp).toLocaleString('es-PE', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
