
import React from 'react';
import { Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lead } from '@/types/lead';
import { getDaysSinceLastEdit } from '@/services/leadService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface LeadTableProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onToggleHotLead: (leadId: string) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, onLeadClick, onToggleHotLead }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-crm-header">
          <TableRow className="border-none">
            <TableHead className="w-10 text-white">
              <Checkbox className="rounded text-blue-500" />
            </TableHead>
            <TableHead className="text-white font-semibold">SKU</TableHead>
            <TableHead className="text-white font-semibold">Car warehouse link</TableHead>
            <TableHead className="text-white font-semibold">Source</TableHead>
            <TableHead className="text-white font-semibold">Intention</TableHead>
            <TableHead className="text-white font-semibold">Customer name</TableHead>
            <TableHead className="text-white font-semibold">Phone number</TableHead>
            <TableHead className="text-white font-semibold">Tags</TableHead>
            <TableHead className="text-white font-semibold">Vehicle description</TableHead>
            <TableHead className="text-white font-semibold">Last Update</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TooltipProvider key={lead.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableRow 
                    className={lead.isStale ? 'bg-crm-stale hover:bg-crm-stale/80' : 'hover:bg-gray-50'}
                  >
                    <TableCell className="w-10">
                      <Checkbox className="rounded text-blue-500" />
                    </TableCell>
                    <TableCell className="font-medium">{lead.sku}</TableCell>
                    <TableCell className="text-crm-blue">{lead.warehouseLink}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell className="max-w-xs truncate">{lead.intention}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onLeadClick(lead)}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {lead.customerName}
                        </button>
                        <button
                          onClick={() => onToggleHotLead(lead.id)}
                          className="p-1 rounded hover:bg-gray-100 transition-colors"
                        >
                          <Flame
                            size={16}
                            className={lead.isHot ? "text-red-500 fill-red-500" : "text-gray-400"}
                          />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>{lead.phoneNumber}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {lead.tags.filter(tag => tag !== "Lead hot").map((tag, index) => (
                          <span 
                            key={index} 
                            className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{lead.vehicleDescription}</TableCell>
                    <TableCell className="text-sm">
                      {getDaysSinceLastEdit(lead.lastEditTime)} days ago
                    </TableCell>
                  </TableRow>
                </TooltipTrigger>
                {lead.isStale && (
                  <TooltipContent>
                    <p>No update in {getDaysSinceLastEdit(lead.lastEditTime)} days</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadTable;
