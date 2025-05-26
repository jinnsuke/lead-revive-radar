
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addHours } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Lead } from '@/types/lead';
import { Event, EventType } from '@/types/event';

const eventTypes: EventType[] = [
  { value: 'inspection', label: 'Inspection', icon: '🛠️' },
  { value: 'call', label: 'Call', icon: '📞' },
  { value: 'meeting', label: 'Car Sales Meeting', icon: '🚗' },
  { value: 'other', label: 'Other', icon: '📋' }
];

interface EventFormProps {
  lead: Lead;
  event?: Event | null;
  onSubmit: (event: Omit<Event, 'id'>) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ lead, event, onSubmit, onCancel }) => {
  // Function to get the next available hour
  const getNextAvailableHour = () => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(now.getHours() + 1);
    return nextHour;
  };

  const [title, setTitle] = useState(event?.title || '');
  const [type, setType] = useState<Event['type']>(event?.type || 'call');
  
  // Set default dates and times
  const defaultStartTime = event?.startTime || getNextAvailableHour();
  const defaultEndTime = event?.endTime || addHours(defaultStartTime, 1);
  
  const [startDate, setStartDate] = useState<Date>(defaultStartTime);
  const [endDate, setEndDate] = useState<Date>(defaultEndTime);
  const [startTime, setStartTime] = useState(format(defaultStartTime, 'HH:mm'));
  const [endTime, setEndTime] = useState(format(defaultEndTime, 'HH:mm'));
  const [notes, setNotes] = useState(event?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startHour, startMinute);
    
    const endDateTime = new Date(endDate);
    endDateTime.setHours(endHour, endMinute);

    onSubmit({
      title,
      type,
      startTime: startDateTime,
      endTime: endDateTime,
      leadId: lead.id,
      leadName: lead.customerName,
      notes,
      reminderOffset: 15
    });
  };

  // Create today's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Event Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as Event['type'])}>
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((eventType) => (
                <SelectItem key={eventType.value} value={eventType.value}>
                  <span className="flex items-center">
                    <span className="mr-2">{eventType.icon}</span>
                    {eventType.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {startDate ? format(startDate, "MMM dd, yyyy") : "Pick date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  disabled={(date) => date < today}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="h-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {endDate ? format(endDate, "MMM dd, yyyy") : "Pick date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  disabled={(date) => date < today}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="h-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes..."
            rows={3}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {event ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
