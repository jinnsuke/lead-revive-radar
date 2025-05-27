
import React from 'react';
import ScheduleView from '@/components/ScheduleView';
import { Event } from '@/types/event';

interface CalendarPageProps {
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onUpdateEvent: (eventId: string, updates: Partial<Event>) => void;
  onDeleteEvent: (eventId: string) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ events, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  return (
    <ScheduleView 
      events={events}
      onAddEvent={onAddEvent}
      onUpdateEvent={onUpdateEvent}
      onDeleteEvent={onDeleteEvent}
    />
  );
};

export default CalendarPage;
