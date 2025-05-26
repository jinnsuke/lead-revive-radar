
import React, { useState } from 'react';
import LeadTable from '@/components/LeadTable';
import LeadFilter from '@/components/LeadFilter';
import LeadDetailPanel from '@/components/LeadDetailPanel';
import Sidebar from '@/components/Sidebar';
import { getLeads, filterLeadsByLastUpdate } from '@/services/leadService';
import { useToast } from "@/components/ui/use-toast";
import { Lead } from '@/types/lead';
import { Event } from '@/types/event';

const Index: React.FC = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(getLeads());
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(getLeads());
  const [daysFilter, setDaysFilter] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleUpdateDaysFilter = (days: number | null) => {
    setDaysFilter(days);
    
    if (days === null) {
      setFilteredLeads(leads);
      toast({
        title: "Filter cleared",
        description: "Showing all leads",
      });
    } else {
      const filtered = filterLeadsByLastUpdate(leads, days);
      setFilteredLeads(filtered);
      
      toast({
        title: `Filter applied: Last update > ${days} days`,
        description: `Found ${filtered.length} leads with no updates in more than ${days} days`,
      });
    }
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsPanelOpen(true);
  };

  const handleAddEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString()
    };
    setEvents([...events, newEvent]);
    
    toast({
      title: "Event created",
      description: `${newEvent.title} has been scheduled`,
    });
  };

  const handleUpdateEvent = (eventId: string, updates: Partial<Event>) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
    
    toast({
      title: "Event updated",
      description: "Event has been successfully updated",
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    
    toast({
      title: "Event deleted",
      description: "Event has been removed from calendar",
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 px-4">
          <LeadFilter onUpdateDaysFilter={handleUpdateDaysFilter} />
          
          <div className="bg-white rounded-lg shadow">
            <LeadTable leads={filteredLeads} onLeadClick={handleLeadClick} />
          </div>
          
          {daysFilter !== null && filteredLeads.length === 0 && (
            <div className="mt-4 p-4 text-center text-gray-600">
              No leads found that haven't been updated in more than {daysFilter} days.
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-500">
            <p>
              <span className="inline-block w-3 h-3 bg-crm-stale mr-2"></span>
              Highlighted rows indicate stale leads (not updated in more than 3 days)
            </p>
          </div>
        </div>
      </div>

      <LeadDetailPanel
        lead={selectedLead}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        events={events}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
};

export default Index;
