
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { format, isToday, isTomorrow, isThisWeek, isThisMonth, startOfDay, addDays } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Event } from '@/types/event';
import { Lead } from '@/types/lead';
import { getLeads } from '@/services/leadService';
import LeadDetailPanel from '@/components/LeadDetailPanel';
import EventEditDialog from '@/components/EventEditDialog';

interface ScheduleViewProps {
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onUpdateEvent: (eventId: string, updates: Partial<Event>) => void;
  onDeleteEvent: (eventId: string) => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ events, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const leads = getLeads();

  // Get upcoming events (starting from today)
  const getUpcomingEvents = () => {
    const today = startOfDay(new Date());
    return events
      .filter(event => startOfDay(event.startTime) >= today)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    if (isThisMonth(date)) return format(date, 'EEEE, MMM d');
    return format(date, 'EEEE, MMM d, yyyy');
  };

  const groupEventsByDate = (events: Event[]) => {
    const grouped: { [key: string]: Event[] } = {};
    
    events.forEach(event => {
      const dateKey = format(startOfDay(event.startTime), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    return grouped;
  };

  const handleEventClick = (event: Event) => {
    setEditingEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleLeadNameClick = (event: Event) => {
    const lead = leads.find(l => l.id === event.leadId);
    if (lead) {
      setSelectedLead(lead);
      setIsPanelOpen(true);
    }
  };

  const handleUpdateEvent = (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      onUpdateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
      setIsEventDialogOpen(false);
    }
  };

  const upcomingEvents = getUpcomingEvents();
  const groupedEvents = groupEventsByDate(upcomingEvents);

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <Calendar className="w-6 h-6" />
          Schedule
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow border max-w-4xl">
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No upcoming events</p>
            <p>Your schedule is clear. Time to plan something!</p>
          </div>
        ) : (
          <div className="divide-y">
            {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => {
              const date = new Date(dateKey);
              
              return (
                <div key={dateKey} className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-sm font-medium text-gray-900 min-w-24">
                      {getDateLabel(date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(date, 'MMM d, yyyy')}
                    </div>
                  </div>
                  
                  <div className="space-y-2 ml-6">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-4 p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer bg-gray-50 hover:bg-gray-100"
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-center gap-2 text-sm text-gray-600 min-w-32">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                          <p 
                            className="text-sm text-blue-600 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLeadNameClick(event);
                            }}
                          >
                            {event.leadName}
                          </p>
                          {event.notes && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{event.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <LeadDetailPanel
        lead={selectedLead}
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
        }}
        events={events}
        onAddEvent={onAddEvent}
        onUpdateEvent={onUpdateEvent}
        onDeleteEvent={onDeleteEvent}
      />

      <EventEditDialog
        event={editingEvent}
        isOpen={isEventDialogOpen}
        onClose={() => {
          setIsEventDialogOpen(false);
          setEditingEvent(null);
        }}
        onUpdate={handleUpdateEvent}
        onDelete={onDeleteEvent}
      />
    </div>
  );
};

export default ScheduleView;
