
import { Lead } from "../types/lead";

// Calculate if a lead is stale (not updated in more than 3 days)
const calculateIsStale = (lastEditTime: Date): boolean => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastEditTime.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 3;
};

// Mock lead data
const generateMockLeads = (): Lead[] => {
  const leads: Lead[] = [
    {
      id: "1",
      sku: "SKU-476396",
      warehouseLink: "Link",
      source: "Website",
      intention: "Within 1 week - Vucar AZ - Owner - Change to new car - Not available yet, Vucar supports consulting",
      customerName: "Page",
      phoneNumber: "097****977",
      tags: ["OTP", "Khách hàng cũ"],
      vehicleDescription: "Toyota Camry 2.5",
      lastEditTime: new Date(new Date().setDate(new Date().getDate() - 5)),
      isStale: false,
      isHot: true
    },
    {
      id: "2",
      sku: "SKU-162351",
      warehouseLink: "Link",
      source: "Referral",
      intention: "N/A",
      customerName: "Huynh Xuan Phong",
      phoneNumber: "096****914",
      tags: ["OTP", "Đã kiểm định"],
      vehicleDescription: "Honda Civic 1.5",
      lastEditTime: new Date(new Date().setDate(new Date().getDate() - 1)),
      isStale: false,
      isHot: false
    },
    {
      id: "3",
      sku: "SKU-579229",
      warehouseLink: "Link",
      source: "Direct",
      intention: "N/A",
      customerName: "Nguyen Thi Hoa",
      phoneNumber: "077****701",
      tags: ["OTP"],
      vehicleDescription: "Mercedes GLC 300",
      lastEditTime: new Date(new Date().setDate(new Date().getDate() - 4)),
      isStale: false,
      isHot: false
    },
    {
      id: "4",
      sku: "SKU-298347",
      warehouseLink: "Link",
      source: "Exhibition",
      intention: "Looking for luxury SUV - Ready to buy within 2 weeks",
      customerName: "Tran Van Nam",
      phoneNumber: "090****234",
      tags: ["Đã kiểm định", "Khách hàng cũ"],
      vehicleDescription: "BMW X5",
      lastEditTime: new Date(new Date().setDate(new Date().getDate() - 6)),
      isStale: false,
      isHot: true
    },
    {
      id: "5",
      sku: "SKU-438901",
      warehouseLink: "Link",
      source: "Social Media",
      intention: "First time buyer - Needs financing options",
      customerName: "Le Minh Tuan",
      phoneNumber: "098****567",
      tags: ["OTP"],
      vehicleDescription: "Hyundai Accent",
      lastEditTime: new Date(new Date().setDate(new Date().getDate() - 2)),
      isStale: false,
      isHot: false
    }
  ];

  // Calculate staleness for each lead
  return leads.map(lead => ({
    ...lead,
    isStale: calculateIsStale(lead.lastEditTime)
  }));
};

// Format date to display
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Get the difference in days between now and last edit
export const getDaysSinceLastEdit = (date: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Mock service to fetch leads
export const getLeads = (): Lead[] => {
  return generateMockLeads();
};

// Filter leads by days since last update
export const filterLeadsByLastUpdate = (leads: Lead[], days: number): Lead[] => {
  const now = new Date();
  return leads.filter(lead => {
    const diffTime = Math.abs(now.getTime() - lead.lastEditTime.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > days;
  });
};

// Toggle hot lead status
export const toggleHotLead = (leadId: string, leads: Lead[]): Lead[] => {
  return leads.map(lead => {
    if (lead.id === leadId) {
      const isHot = !lead.isHot;
      const tags = isHot 
        ? [...lead.tags.filter(tag => tag !== "Lead hot"), "Lead hot"]
        : lead.tags.filter(tag => tag !== "Lead hot");
      
      return {
        ...lead,
        isHot,
        tags
      };
    }
    return lead;
  });
};

// Get all unique tags from leads (excluding "Lead hot")
export const getAllTags = (leads: Lead[]): string[] => {
  const allTags = leads.flatMap(lead => lead.tags);
  const uniqueTags = Array.from(new Set(allTags));
  return uniqueTags.filter(tag => tag !== "Lead hot");
};
