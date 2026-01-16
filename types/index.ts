// src/types/index.ts

export type PlatformType = 'zendesk' | 'freshdesk';

// Expanded list of all possible helpdesk data types
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
  prettyName: string; // NEW: The display name (e.g. "Suite Professional")
  requestsPerMinute: number;
  createTicketLimit?: number;
  exportLimit?: number; 
}

export interface PlatformConfig {
  id: PlatformType;
  name: string;
  // CHANGED: Plans are now dynamic strings, not fixed types
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
  sourcePlan: string; // CHANGED: Now accepts any string key
  destination: PlatformType;
  destPlan: string;   // CHANGED: Now accepts any string key
  
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