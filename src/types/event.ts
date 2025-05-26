
export interface Event {
  id: string;
  title: string;
  type: 'inspection' | 'call' | 'meeting' | 'other';
  startTime: Date;
  endTime: Date;
  leadId: string;
  leadName: string;
  notes?: string;
  reminderOffset: number; // minutes before event
}

export type EventType = {
  value: Event['type'];
  label: string;
  icon: string;
};
