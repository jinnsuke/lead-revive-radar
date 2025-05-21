
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lead } from '@/types/lead';
import { getDaysSinceLastEdit } from '@/services/leadService';

interface LeadTableProps {
  leads: Lead[];
}

const LeadTable: React.FC<LeadTableProps> = ({ leads }) => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {/* Table Header */}
        <div className="bg-crm-header text-white py-3 px-2">
          <div className="flex items-center">
            <div className="w-10">
              <input type="checkbox" className="rounded text-blue-500" />
            </div>
            <div className="w-1/8 font-semibold">SKU</div>
            <div className="w-1/8 font-semibold">Car warehouse link</div>
            <div className="w-1/8 font-semibold">Source</div>
            <div className="w-1/5 font-semibold">Intention</div>
            <div className="w-1/8 font-semibold">Customer name</div>
            <div className="w-1/8 font-semibold">Phone number</div>
            <div className="w-1/8 font-semibold">Tags</div>
            <div className="w-1/8 font-semibold">Vehicle description</div>
            <div className="w-1/8 font-semibold">Last Update</div>
          </div>
        </div>

        {/* Table Body */}
        <div>
          {leads.map((lead) => (
            <TooltipProvider key={lead.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                      lead.isStale ? 'bg-crm-stale' : ''
                    }`}
                  >
                    <div className="flex items-center py-3 px-2">
                      <div className="w-10">
                        <input type="checkbox" className="rounded text-blue-500" />
                      </div>
                      <div className="w-1/8">{lead.sku}</div>
                      <div className="w-1/8 text-crm-blue">{lead.warehouseLink}</div>
                      <div className="w-1/8">{lead.source}</div>
                      <div className="w-1/5 truncate">{lead.intention}</div>
                      <div className="w-1/8">{lead.customerName}</div>
                      <div className="w-1/8">{lead.phoneNumber}</div>
                      <div className="w-1/8">
                        {lead.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="w-1/8 truncate">{lead.vehicleDescription}</div>
                      <div className="w-1/8 text-sm">
                        {getDaysSinceLastEdit(lead.lastEditTime)} days ago
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                {lead.isStale && (
                  <TooltipContent>
                    <p>No update in {getDaysSinceLastEdit(lead.lastEditTime)} days</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadTable;
