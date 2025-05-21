
import React, { useState } from 'react';
import { Search, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface LeadFilterProps {
  onUpdateDaysFilter: (days: number | null) => void;
}

const LeadFilter: React.FC<LeadFilterProps> = ({ onUpdateDaysFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [daysFilter, setDaysFilter] = useState<string>('');

  const handleDaysFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDaysFilter(e.target.value);
  };

  const handleDaysFilterSubmit = () => {
    const days = daysFilter ? parseInt(daysFilter) : null;
    onUpdateDaysFilter(days);
  };

  return (
    <div className="flex flex-col space-y-4 mb-4">
      <div className="flex items-center space-x-2">
        <h1 className="text-3xl font-bold flex items-center">
          CRM V2 <span className="ml-2">📊</span>
        </h1>
        <div className="flex-grow"></div>
        <Button className="bg-blue-500 hover:bg-blue-600">
          + Add new car
        </Button>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-grow md:max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search..." 
            className="pl-9 pr-4 py-2" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-2.5 top-2.5 text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">Enter</span>
        </div>
        
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
                {/* Date picker would go here */}
                <p className="text-sm">Date picker functionality coming soon</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Qualified
        </Button>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Stage
        </Button>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Need to sell
        </Button>
        
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
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Column
        </Button>
      </div>
    </div>
  );
};

export default LeadFilter;
