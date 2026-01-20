// src/types/index.ts

// 1. UPDATE THIS LIST to include all 10 platforms
export type PlatformType = 
  | 'zendesk' 
  | 'freshdesk' 
  | 'salesforce' 
  | 'hubspot' 
  | 'intercom' 
  | 'helpscout' 
  | 'jira' 
  | 'front' 
  | 'gladly' 
  | 'gorgias';

// 2. Keep the rest the same (but ensure PlanType is removed if you haven't already)
export type DataEntity = 
  | 'tickets' 
  | 'users' 
  | 'organizations' 
  | 'groups' 
  | 'articles' 
  | 'macros' 
  | 'triggers' 
  | 'automations'
  | 'tags'
  | 'custom_fields'
  | 'ticket_forms'
  | 'sla_policies';

export interface PlanLimits {
  prettyName?: string; // Optional but good for UI
  requestsPerMinute: number;
  createTicketLimit?: number;
  exportLimit?: number; 
}

export interface PlatformConfig {
  id: PlatformType;
  name: string;
  // Plans are dynamic strings now
  plans: Record<string, PlanLimits>;
  
  capabilities: {
    export: DataEntity[]; 
    import: DataEntity[]; 
  };

  features: {
    batchSize: number; 
    complexityMultiplier: number; 
  };
  limits: {
    maxAttachmentSizeMB: number;
    throughputBuffer: number; 
  };
}

export interface CalculatorInputs {
  source: PlatformType;
  sourcePlan: string;
  destination: PlatformType;
  destPlan: string;
  
  selectedEntities: DataEntity[]; 
  volumes: Partial<Record<DataEntity, number>>;

  avgAttachmentsPerTicket: number;
  avgAttachmentSizeMB: number;
}

export interface TimelineResult {
  totalDurationHours: number;
  minDurationHours: number;
  maxDurationHours: number;
  
  breakdown: {
    foundation: number;
    coreData: number;
    attachments: number;
  };

  entityBreakdown: Partial<Record<DataEntity, number>>;

  bottleneck: string; 
  riskLevel: 'Low' | 'Medium' | 'High';
  
  apiTasks: string[];
  manualTasks: string[];
}