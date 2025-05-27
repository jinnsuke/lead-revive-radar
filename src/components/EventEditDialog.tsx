
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addHours } from 'date-fns';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Event, EventType } from '@/types/event';

const eventTypes: EventType[] = [
  { value: 'inspection', label: 'Inspection', icon: '🛠️' },
  { value: 'call', label: 'Call', icon: '📞' },
  { value: 'meeting', label: 'Car Sales Meeting', icon: '🚗' },
  { value: 'other', label: 'Other', icon: '📋' }
];

interface EventEditDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (event: Omit<Event, 'id'>) => void;
  onDelete: (eventId: string) => void;
}

const EventEditDialog: React.FC<EventEditDialogProps> = ({
  event,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Event['type']>('call');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  // Function to get the next available hour
  const getNextAvailableHour = () => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(now.getHours() + 1);
    return nextHour;
  };

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setType(event.type);
      setStartDate(event.startTime);
      setStartTime(format(event.startTime, 'HH:mm'));
      setNotes(event.notes || '');
    } else {
      // Reset to defaults
      const nextHour = getNextAvailableHour();
      
      setTitle('');
      setType('call');
      setStartDate(nextHour);
      setStartTime(format(nextHour, 'HH:mm'));
      setNotes('');
    }
  }, [event, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startHour, startMinute);
    
    // Automatically set end time to 1 hour after start time
    const endDateTime = addHours(startDateTime, 1);

    onUpdate({
      title,
      type,
      startTime: startDateTime,
      endTime: endDateTime,
      leadId: event.leadId,
      leadName: event.leadName,
      notes,
      reminderOffset: 15
    });
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
      onClose();
    }
  };

  if (!event) return null;

  // Create today's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>

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

          <div className="flex gap-2 justify-between">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Update Event
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditDialog;
