
import React, { useState } from 'react';
import LeadTable from '@/components/LeadTable';
import LeadFilter from '@/components/LeadFilter';
import Sidebar from '@/components/Sidebar';
import { getLeads, filterLeadsByLastUpdate } from '@/services/leadService';
import { useToast } from "@/components/ui/use-toast";
import { Lead } from '@/types/lead';

const Index: React.FC = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(getLeads());
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(getLeads());
  const [daysFilter, setDaysFilter] = useState<number | null>(null);

  const handleUpdateDaysFilter = (days: number | null) => {
    setDaysFilter(days);
    
    if (days === null) {
      // Reset filter
      setFilteredLeads(leads);
      toast({
        title: "Filter cleared",
        description: "Showing all leads",
      });
    } else {
      // Apply filter
      const filtered = filterLeadsByLastUpdate(leads, days);
      setFilteredLeads(filtered);
      
      toast({
        title: `Filter applied: Last update > ${days} days`,
        description: `Found ${filtered.length} leads with no updates in more than ${days} days`,
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 px-4">
          <LeadFilter onUpdateDaysFilter={handleUpdateDaysFilter} />
          
          <div className="bg-white rounded-lg shadow">
            <LeadTable leads={filteredLeads} />
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
    </div>
  );
};

export default Index;
