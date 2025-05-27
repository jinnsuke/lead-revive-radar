
import React, { useState } from 'react';
import { Search, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Lead } from '@/types/lead';

interface LeadFilterProps {
  filterStatus: 'all' | 'stale' | 'fresh';
  setFilterStatus: (status: 'all' | 'stale' | 'fresh') => void;
  filterSource: string;
  setFilterSource: (source: string) => void;
  leads: Lead[];
}

const LeadFilter: React.FC<LeadFilterProps> = ({ 
  filterStatus, 
  setFilterStatus, 
  filterSource, 
  setFilterSource, 
  leads 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [daysFilter, setDaysFilter] = useState<string>('');

  const handleDaysFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDaysFilter(e.target.value);
  };

  const handleDaysFilterSubmit = () => {
    // This functionality can be implemented later if needed
    console.log('Days filter:', daysFilter);
  };

  // Get unique sources from leads
  const uniqueSources = Array.from(new Set(leads.map(lead => lead.source)));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button 
        variant={filterStatus === 'all' ? 'default' : 'outline'}
        onClick={() => setFilterStatus('all')}
      >
        All
      </Button>
      
      <Button 
        variant={filterStatus === 'stale' ? 'default' : 'outline'}
        onClick={() => setFilterStatus('stale')}
      >
        Stale
      </Button>
      
      <Button 
        variant={filterStatus === 'fresh' ? 'default' : 'outline'}
        onClick={() => setFilterStatus('fresh')}
      >
        Fresh
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Source: {filterSource === 'all' ? 'All' : filterSource}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-2">
            <Button 
              variant={filterSource === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterSource('all')}
              className="justify-start"
            >
              All Sources
            </Button>
            {uniqueSources.map(source => (
              <Button
                key={source}
                variant={filterSource === source ? 'default' : 'outline'}
                onClick={() => setFilterSource(source)}
                className="justify-start"
              >
                {source}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Select date range</h4>
              <p className="text-sm text-muted-foreground">
                Filter leads by date range
              </p>
            </div>
            <div className="grid gap-2">
              <p className="text-sm">Date picker functionality coming soon</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Last Update (days)</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filter by days since last update</h4>
              <p className="text-sm text-muted-foreground">
                Show leads with no updates in more than X days
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="days">Days:</Label>
                <Input
                  id="days"
                  type="number"
                  className="col-span-2"
                  placeholder="e.g., 3"
                  value={daysFilter}
                  onChange={handleDaysFilterChange}
                  min="0"
                />
              </div>
              <Button onClick={handleDaysFilterSubmit}>
                Apply Filter
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LeadFilter;
