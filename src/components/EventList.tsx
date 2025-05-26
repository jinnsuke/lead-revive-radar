
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '@/types/event';

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const getEventIcon = (type: Event['type']) => {
  switch (type) {
    case 'inspection': return '🛠️';
    case 'call': return '📞';
    case 'meeting': return '🚗';
    default: return '📋';
  }
};

const EventList: React.FC<EventListProps> = ({ events, onEdit, onDelete }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No events scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="border rounded-lg p-3 bg-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{getEventIcon(event.type)}</span>
                <h4 className="font-medium text-sm">{event.title}</h4>
              </div>
              <p className="text-xs text-gray-600 mb-1">
                {format(event.startTime, 'MMM dd, yyyy')} • {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
              </p>
              {event.notes && (
                <p className="text-xs text-gray-500">{event.notes}</p>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(event)}
                className="h-6 w-6 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(event.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
