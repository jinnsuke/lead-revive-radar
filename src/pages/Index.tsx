
import React, { useState } from 'react';
import LeadTable from '@/components/LeadTable';
import LeadFilter from '@/components/LeadFilter';
import LeadDetailPanel from '@/components/LeadDetailPanel';
import Sidebar from '@/components/Sidebar';
import { getLeads, filterLeadsByLastUpdate } from '@/services/leadService';
import { useToast } from "@/components/ui/use-toast";
import { Lead } from '@/types/lead';
import { Event } from '@/types/event';

interface IndexProps {
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onUpdateEvent: (eventId: string, updates: Partial<Event>) => void;
  onDeleteEvent: (eventId: string) => void;
}

const Index: React.FC<IndexProps> = ({ events, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(getLeads());
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(getLeads());
  const [daysFilter, setDaysFilter] = useState<number | null>(null);
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

  const handleAddEventWithToast = (eventData: Omit<Event, 'id'>) => {
    onAddEvent(eventData);
    
    toast({
      title: "Event created",
      description: `${eventData.title} has been scheduled`,
    });
  };

  const handleUpdateEventWithToast = (eventId: string, updates: Partial<Event>) => {
    onUpdateEvent(eventId, updates);
    
    toast({
      title: "Event updated",
      description: "Event has been successfully updated",
    });
  };

  const handleDeleteEventWithToast = (eventId: string) => {
    onDeleteEvent(eventId);
    
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
        onAddEvent={handleAddEventWithToast}
        onUpdateEvent={handleUpdateEventWithToast}
        onDeleteEvent={handleDeleteEventWithToast}
      />
    </div>
  );
};

export default Index;
