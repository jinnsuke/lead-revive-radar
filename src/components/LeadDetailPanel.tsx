
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lead } from '@/types/lead';
import { Event } from '@/types/event';
import EventForm from './EventForm';
import EventList from './EventList';

interface LeadDetailPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onUpdateEvent: (eventId: string, updates: Partial<Event>) => void;
  onDeleteEvent: (eventId: string) => void;
  initialEditingEvent?: Event | null;
}

const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({
  lead,
  isOpen,
  onClose,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  initialEditingEvent
}) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Set the initial editing event when panel opens
  useEffect(() => {
    if (initialEditingEvent && isOpen) {
      setEditingEvent(initialEditingEvent);
      setShowEventForm(true);
    }
  }, [initialEditingEvent, isOpen]);

  // Reset state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setShowEventForm(false);
      setEditingEvent(null);
    }
  }, [isOpen]);

  if (!lead) return null;

  const leadEvents = events.filter(event => event.leadId === lead.id);
  // Filter out the event being edited from the displayed list
  const displayedEvents = editingEvent 
    ? leadEvents.filter(event => event.id !== editingEvent.id)
    : leadEvents;

  const handleAddEvent = (eventData: Omit<Event, 'id'>) => {
    onAddEvent(eventData);
    setShowEventForm(false);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleUpdateEvent = (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      onUpdateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
      setShowEventForm(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            {lead.customerName}
          </SheetTitle>
          <p className="text-sm text-gray-600">{lead.sku}</p>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="work-diary" className="text-xs">
                Nhật ký làm việc
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                Events
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs">
                <FileText className="w-3 h-3 mr-1" />
                Ghi chú
              </TabsTrigger>
            </TabsList>

            <TabsContent value="work-diary" className="mt-4">
              <div className="text-center py-8 text-gray-500">
                <p>No calls yet.</p>
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Scheduled Events</h3>
                  <Button
                    size="sm"
                    onClick={() => setShowEventForm(true)}
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Event
                  </Button>
                </div>

                {showEventForm && (
                  <EventForm
                    lead={lead}
                    event={editingEvent}
                    onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
                    onCancel={() => {
                      setShowEventForm(false);
                      setEditingEvent(null);
                    }}
                  />
                )}

                <EventList
                  events={displayedEvents}
                  onEdit={handleEditEvent}
                  onDelete={onDeleteEvent}
                />
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <div className="text-center py-8 text-gray-500">
                <p>No history of status changes</p>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetailPanel;
