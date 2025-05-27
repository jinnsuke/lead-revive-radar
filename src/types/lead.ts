
export interface Lead {
  id: string;
  sku: string;
  warehouseLink: string;
  source: string;
  intention: string;
  customerName: string;
  phoneNumber: string;
  tags: string[];
  vehicleDescription: string;
  lastEditTime: Date;
  isStale: boolean;
  isHot: boolean;
}
