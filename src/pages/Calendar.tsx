
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay, startOfDay } from 'date-fns';
import { Event } from '@/types/event';

interface CalendarPageProps {
  events: Event[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.startTime, day));
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'inspection': return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'call': return 'bg-green-100 border-green-200 text-green-800';
      case 'meeting': return 'bg-purple-100 border-purple-200 text-purple-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'inspection': return '🛠️';
      case 'call': return '📞';
      case 'meeting': return '🚗';
      default: return '📋';
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" />
            Calendar
          </h1>
          
          <div className="flex items-center gap-4">
            <Select value={view} onValueChange={(value) => setView(value as 'day' | 'week' | 'month')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold min-w-64">
              {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <Button onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
        </div>
      </div>

      {view === 'week' && (
        <div className="bg-white rounded-lg shadow border">
          <div className="grid grid-cols-8 border-b">
            <div className="p-3 text-xs font-medium text-gray-500 border-r">Time</div>
            {daysInWeek.map((day) => (
              <div key={day.toISOString()} className="p-3 text-center border-r last:border-r-0">
                <div className="text-xs font-medium text-gray-500 uppercase">
                  {format(day, 'EEE')}
                </div>
                <div className={`text-lg font-semibold mt-1 ${
                  isSameDay(day, new Date()) ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-8">
            <div className="border-r">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="h-16 border-b flex items-start p-2">
                  <span className="text-xs text-gray-500">
                    {format(new Date().setHours(i, 0), 'HH:mm')}
                  </span>
                </div>
              ))}
            </div>
            
            {daysInWeek.map((day) => (
              <div key={day.toISOString()} className="border-r last:border-r-0">
                {Array.from({ length: 24 }, (_, hour) => {
                  const dayEvents = getEventsForDay(day).filter(event => 
                    event.startTime.getHours() === hour
                  );
                  
                  return (
                    <div key={hour} className="h-16 border-b p-1 relative">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded border mb-1 cursor-pointer hover:shadow-sm ${getEventTypeColor(event.type)}`}
                        >
                          <div className="flex items-center gap-1">
                            <span>{getEventIcon(event.type)}</span>
                            <span className="font-medium truncate">{event.title}</span>
                          </div>
                          <div className="text-xs opacity-75">
                            {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
                          </div>
                          <div className="text-xs opacity-75 truncate">
                            {event.leadName}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'day' && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold mb-4">
            {format(currentDate, 'EEEE, MMMM dd, yyyy')}
          </h3>
          
          <div className="space-y-3">
            {getEventsForDay(currentDate).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No events scheduled for this day.</p>
            ) : (
              getEventsForDay(currentDate).map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border ${getEventTypeColor(event.type)}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getEventIcon(event.type)}</span>
                    <h4 className="font-semibold">{event.title}</h4>
                  </div>
                  <p className="text-sm mb-1">
                    {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
                  </p>
                  <p className="text-sm font-medium">{event.leadName}</p>
                  {event.notes && (
                    <p className="text-sm text-gray-600 mt-2">{event.notes}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
