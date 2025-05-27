
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addHours } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Lead } from '@/types/lead';
import { Event } from '@/types/event';

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
  
  // Set default dates and times
  const defaultStartTime = event?.startTime || getNextAvailableHour();
  
  const [startDate, setStartDate] = useState<Date>(defaultStartTime);
  const [startTime, setStartTime] = useState(format(defaultStartTime, 'HH:mm'));
  const [notes, setNotes] = useState(event?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startHour, startMinute);
    
    // Automatically set end time to 1 hour after start time
    const endDateTime = addHours(startDateTime, 1);

    onSubmit({
      title,
      type: 'other', // Default type since we removed the dropdown
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

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
          <strong>Duration:</strong> 1 hour (ends at {startTime ? 
            format(addHours(new Date(`2000-01-01T${startTime}`), 1), 'HH:mm') : 
            '--:--'
          })
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
