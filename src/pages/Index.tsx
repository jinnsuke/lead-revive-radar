
import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LeadTable from '@/components/LeadTable';
import LeadFilter from '@/components/LeadFilter';
import LeadDetailPanel from '@/components/LeadDetailPanel';
import ScheduleDialog from '@/components/ScheduleDialog';
import { Lead } from '@/types/lead';
import { Event } from '@/types/event';
import { getLeads, toggleHotLead } from '@/services/leadService';
import Sidebar from '@/components/Sidebar';

interface IndexProps {
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onUpdateEvent: (eventId: string, updates: Partial<Event>) => void;
  onDeleteEvent: (eventId: string) => void;
}

const Index: React.FC<IndexProps> = ({ events, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'stale' | 'fresh'>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(getLeads());

  const handleToggleHotLead = (leadId: string) => {
    const updatedLeads = toggleHotLead(leadId, leads);
    setLeads(updatedLeads);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phoneNumber.includes(searchTerm) ||
        lead.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.intention.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.vehicleDescription.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'stale' && lead.isStale) ||
        (filterStatus === 'fresh' && !lead.isStale);

      const matchesSource = filterSource === 'all' || lead.source === filterSource;

      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => lead.tags.includes(tag));

      return matchesSearch && matchesStatus && matchesSource && matchesTags;
    });
  }, [leads, searchTerm, filterStatus, filterSource, selectedTags]);

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsPanelOpen(true);
  };

  const handleCloseLead = () => {
    setSelectedLead(null);
    setIsPanelOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">CRM Dashboard</h1>
            <div className="flex items-center gap-3">
              <ScheduleDialog 
                events={events}
                onAddEvent={onAddEvent}
                onUpdateEvent={onUpdateEvent}
                onDeleteEvent={onDeleteEvent}
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search leads..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4">
              <LeadFilter 
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterSource={filterSource}
                setFilterSource={setFilterSource}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                leads={leads}
              />
            </div>
          )}
        </div>

        <LeadTable 
          leads={filteredLeads} 
          onLeadClick={handleLeadClick}
          onToggleHotLead={handleToggleHotLead}
        />

        <LeadDetailPanel
          lead={selectedLead}
          isOpen={isPanelOpen}
          onClose={handleCloseLead}
          events={events}
          onAddEvent={onAddEvent}
          onUpdateEvent={onUpdateEvent}
          onDeleteEvent={onDeleteEvent}
        />
      </div>
    </div>
  );
};

export default Index;
