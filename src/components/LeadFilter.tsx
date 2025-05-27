
import React, { useState } from 'react';
import { Calendar, Filter, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/lead';
import { getAllTags } from '@/services/leadService';

interface LeadFilterProps {
  filterStatus: 'all' | 'stale' | 'fresh';
  setFilterStatus: (status: 'all' | 'stale' | 'fresh') => void;
  filterSource: string;
  setFilterSource: (source: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  leads: Lead[];
}

const LeadFilter: React.FC<LeadFilterProps> = ({ 
  filterStatus, 
  setFilterStatus, 
  filterSource, 
  setFilterSource,
  selectedTags,
  setSelectedTags,
  leads 
}) => {
  const [daysFilter, setDaysFilter] = useState<string>('');
  const [qualifiedFilter, setQualifiedFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [intentionFilter, setIntentionFilter] = useState<string>('all');
  const [picFilter, setPicFilter] = useState<string>('all');
  const [lastInteractionFilter, setLastInteractionFilter] = useState<string>('all');

  const handleDaysFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDaysFilter(e.target.value);
  };

  const handleDaysFilterSubmit = () => {
    console.log('Days filter:', daysFilter);
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Get unique sources from leads
  const uniqueSources = Array.from(new Set(leads.map(lead => lead.source)));
  const availableTags = getAllTags(leads);

  const getTagVariant = (tag: string) => {
    if (tag === "Lead hot") return "destructive";
    return "default";
  };

  return (
    <div className="space-y-4">
      {/* Primary Filters Row */}
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

        {/* Date Filter */}
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
                <h4 className="font-medium leading-none">Filter by Date</h4>
                <p className="text-sm text-muted-foreground">
                  Select date range for leads
                </p>
              </div>
              <div className="grid gap-2">
                <p className="text-sm">Date picker functionality coming soon</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Qualified Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Qualified: {qualifiedFilter === 'all' ? 'All' : qualifiedFilter}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-2">
              <Button 
                variant={qualifiedFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setQualifiedFilter('all')}
                className="justify-start"
              >
                All
              </Button>
              <Button 
                variant={qualifiedFilter === 'qualified' ? 'default' : 'outline'}
                onClick={() => setQualifiedFilter('qualified')}
                className="justify-start"
              >
                Qualified
              </Button>
              <Button 
                variant={qualifiedFilter === 'unqualified' ? 'default' : 'outline'}
                onClick={() => setQualifiedFilter('unqualified')}
                className="justify-start"
              >
                Unqualified
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Stage Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Stage: {stageFilter === 'all' ? 'All' : stageFilter}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-2">
              <Button 
                variant={stageFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStageFilter('all')}
                className="justify-start"
              >
                All Stages
              </Button>
              <Button 
                variant={stageFilter === 'prospect' ? 'default' : 'outline'}
                onClick={() => setStageFilter('prospect')}
                className="justify-start"
              >
                Prospect
              </Button>
              <Button 
                variant={stageFilter === 'contacted' ? 'default' : 'outline'}
                onClick={() => setStageFilter('contacted')}
                className="justify-start"
              >
                Contacted
              </Button>
              <Button 
                variant={stageFilter === 'proposal' ? 'default' : 'outline'}
                onClick={() => setStageFilter('proposal')}
                className="justify-start"
              >
                Proposal
              </Button>
              <Button 
                variant={stageFilter === 'closed' ? 'default' : 'outline'}
                onClick={() => setStageFilter('closed')}
                className="justify-start"
              >
                Closed
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Secondary Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Intention Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Intention: {intentionFilter === 'all' ? 'All' : intentionFilter}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-2">
              <Button 
                variant={intentionFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setIntentionFilter('all')}
                className="justify-start"
              >
                All Intentions
              </Button>
              <Button 
                variant={intentionFilter === 'immediate' ? 'default' : 'outline'}
                onClick={() => setIntentionFilter('immediate')}
                className="justify-start"
              >
                Immediate
              </Button>
              <Button 
                variant={intentionFilter === 'within_week' ? 'default' : 'outline'}
                onClick={() => setIntentionFilter('within_week')}
                className="justify-start"
              >
                Within 1 week
              </Button>
              <Button 
                variant={intentionFilter === 'within_month' ? 'default' : 'outline'}
                onClick={() => setIntentionFilter('within_month')}
                className="justify-start"
              >
                Within 1 month
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* PIC Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>PIC: {picFilter === 'all' ? 'All' : picFilter}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-2">
              <Button 
                variant={picFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setPicFilter('all')}
                className="justify-start"
              >
                All PICs
              </Button>
              <Button 
                variant={picFilter === 'john_doe' ? 'default' : 'outline'}
                onClick={() => setPicFilter('john_doe')}
                className="justify-start"
              >
                John Doe
              </Button>
              <Button 
                variant={picFilter === 'jane_smith' ? 'default' : 'outline'}
                onClick={() => setPicFilter('jane_smith')}
                className="justify-start"
              >
                Jane Smith
              </Button>
              <Button 
                variant={picFilter === 'mike_johnson' ? 'default' : 'outline'}
                onClick={() => setPicFilter('mike_johnson')}
                className="justify-start"
              >
                Mike Johnson
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Last Interaction Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last Interaction: {lastInteractionFilter === 'all' ? 'All' : lastInteractionFilter}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-2">
              <Button 
                variant={lastInteractionFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setLastInteractionFilter('all')}
                className="justify-start"
              >
                All
              </Button>
              <Button 
                variant={lastInteractionFilter === 'today' ? 'default' : 'outline'}
                onClick={() => setLastInteractionFilter('today')}
                className="justify-start"
              >
                Today
              </Button>
              <Button 
                variant={lastInteractionFilter === 'this_week' ? 'default' : 'outline'}
                onClick={() => setLastInteractionFilter('this_week')}
                className="justify-start"
              >
                This Week
              </Button>
              <Button 
                variant={lastInteractionFilter === 'this_month' ? 'default' : 'outline'}
                onClick={() => setLastInteractionFilter('this_month')}
                className="justify-start"
              >
                This Month
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Source Filter */}
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

        {/* Days Since Last Update Filter */}
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

      {/* Tag Filter Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Filter by Tags:</Label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? getTagVariant(tag) : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedTags.includes(tag)
                  ? tag === "Lead hot"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTags([])}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all tags
          </Button>
        )}
      </div>
    </div>
  );
};

export default LeadFilter;
