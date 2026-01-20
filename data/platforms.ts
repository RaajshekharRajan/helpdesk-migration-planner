import { PlatformType, PlatformConfig, DataEntity } from '../types';

export const PLATFORMS: Record<PlatformType, PlatformConfig> = {
  zendesk: {
    id: 'zendesk',
    name: 'Zendesk Support',
    plans: {
      // Sources: Zendesk "Managing API usage" docs.
      // Team: 200 RPM, Growth/Pro: 400 RPM, Enterprise: 700 RPM.
      // High Volume Add-on (2500 RPM) is available but treated as an override.
      'suite_team': { prettyName: 'Suite Team', requestsPerMinute: 200, exportLimit: 10 },
      'suite_growth': { prettyName: 'Suite Growth', requestsPerMinute: 400, exportLimit: 10 },
      'suite_pro': { prettyName: 'Suite Professional', requestsPerMinute: 400, exportLimit: 10 },
      'suite_enterprise': { prettyName: 'Suite Enterprise', requestsPerMinute: 700, exportLimit: 10 },
      'legacy_enterprise': { prettyName: 'Legacy Enterprise', requestsPerMinute: 700, exportLimit: 10 },
    },
    capabilities: {
      export: [
        'tickets', 'users', 'organizations', 'groups', 'articles', 
        'macros', 'triggers', 'automations', 'tags', 'custom_fields', 
        'ticket_forms', 'sla_policies'
      ],
      import: [
        'tickets', 'users', 'organizations', 'groups', 'articles', 
        'macros', 'tags', 'custom_fields'
      ],
    },
    features: {
      batchSize: 100,
      complexityMultiplier: 1.2,
    },
    limits: {
      maxAttachmentSizeMB: 50,
      throughputBuffer: 0.15,
    },
  },
  freshdesk: {
    id: 'freshdesk',
    name: 'Freshdesk',
    plans: {
      // CORRECTION: Updated to match Freshdesk Rate Limits v2.
      // Free: 50, Growth: 200, Pro: 400, Enterprise: 700.
      'free': { prettyName: 'Free Plan', requestsPerMinute: 50, createTicketLimit: 20 },
      'growth': { prettyName: 'Growth', requestsPerMinute: 200, createTicketLimit: 80 },
      'pro': { prettyName: 'Pro', requestsPerMinute: 400, createTicketLimit: 160 },
      'enterprise': { prettyName: 'Enterprise', requestsPerMinute: 700, createTicketLimit: 280 },
    },
    capabilities: {
      export: [
        'tickets', 'users', 'organizations', 'groups', 'articles', 
        'macros', 'tags', 'custom_fields'
      ],
      import: [
        'tickets', 'users', 'organizations', 'groups', 'articles', 
        'tags', 'custom_fields'
      ],
    },
    features: {
      batchSize: 1,
      complexityMultiplier: 2.5,
    },
    limits: {
      maxAttachmentSizeMB: 20,
      throughputBuffer: 0.20,
    },
  },
  salesforce: {
    id: 'salesforce',
    name: 'Salesforce Service Cloud',
    plans: {
      // NOTE: Salesforce limits are Daily Allocations (e.g., 15k/day).
      // These RPM values are "Safe Sustained Throughput" heuristics for migration.
      'essentials': { prettyName: 'Essentials', requestsPerMinute: 200, exportLimit: 50 },
      'professional': { prettyName: 'Professional', requestsPerMinute: 500, exportLimit: 200 },
      'enterprise': { prettyName: 'Enterprise', requestsPerMinute: 1000, exportLimit: 500 },
      'unlimited': { prettyName: 'Unlimited', requestsPerMinute: 2000, exportLimit: 1000 },
    },
    capabilities: {
      export: [
        'tickets', 'users', 'organizations', 'groups', 'articles', 
        'macros', 'custom_fields', 'ticket_forms'
      ],
      import: [
        'tickets', 'users', 'organizations', 'groups', 'articles', 
        'macros', 'custom_fields'
      ],
    },
    features: {
      batchSize: 200,          
      complexityMultiplier: 2.0, 
    },
    limits: {
      maxAttachmentSizeMB: 25, 
      throughputBuffer: 0.20,  
    },
  },
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot Service Hub',
    plans: {
      // NOTE: HubSpot limits are Burst-based (e.g. 150/10s).
      // These RPMs are derived estimates (Burst Limit * 6 / Safety Factor).
      'free': { prettyName: 'Free', requestsPerMinute: 250, exportLimit: 100 },
      'starter': { prettyName: 'Starter', requestsPerMinute: 500, exportLimit: 500 },
      'professional': { prettyName: 'Professional', requestsPerMinute: 600, exportLimit: 1000 },
      'enterprise': { prettyName: 'Enterprise', requestsPerMinute: 900, exportLimit: 2000 },
    },
    capabilities: {
      export: [
        'tickets', 'users', 'organizations', 'groups', 'articles', 
        'macros', 'custom_fields', 'automations'
      ],
      import: [
        'tickets', 'users', 'organizations', 'articles', 
        'macros', 'custom_fields'
      ],
    },
    features: {
      batchSize: 100,          
      complexityMultiplier: 1.0, 
    },
    limits: {
      maxAttachmentSizeMB: 20,
      throughputBuffer: 0.05,  
    },
  },
  intercom: {
    id: 'intercom',
    name: 'Intercom',
    plans: {
      // Conservative defaults. Intercom limits are now Workspace-based and can be higher.
      'essential': { prettyName: 'Essential', requestsPerMinute: 200, exportLimit: 200 },
      'advanced': { prettyName: 'Advanced', requestsPerMinute: 500, exportLimit: 500 },
      'expert': { prettyName: 'Expert', requestsPerMinute: 1000, exportLimit: 1000 },
    },
    capabilities: {
      export: [
        'tickets', 'users', 'organizations', 'groups', 'articles', 
        'macros', 'tags', 'custom_fields'
      ],
      import: [
        'tickets', 'users', 'organizations', 'articles', 'tags', 'custom_fields'
      ],
    },
    features: {
      batchSize: 1,            
      complexityMultiplier: 1.8, 
    },
    limits: {
      maxAttachmentSizeMB: 40,
      throughputBuffer: 0.15,  
    },
  },
  helpscout: {
    id: 'helpscout',
    name: 'Help Scout',
    plans: {
      // CORRECTION: Help Scout v2 API limits are Tiered.
      // Standard: 200, Plus: 400, Pro: 800.
      'standard': { prettyName: 'Standard', requestsPerMinute: 200, exportLimit: 200 },
      'plus': { prettyName: 'Plus', requestsPerMinute: 400, exportLimit: 400 },
      'pro': { prettyName: 'Pro', requestsPerMinute: 800, exportLimit: 800 },
    },
    capabilities: {
      export: [
        'tickets', 'users', 'groups', 'articles', 
        'macros', 'tags', 'custom_fields'
      ],
      import: [
        'tickets', 'users', 'articles', 'tags', 'custom_fields'
      ],
    },
    features: {
      batchSize: 1,            
      complexityMultiplier: 0.8, 
    },
    limits: {
      maxAttachmentSizeMB: 10,
      throughputBuffer: 0.05,  
    },
  },
  jira: {
    id: 'jira',
    name: 'Jira Service Management',
    plans: {
      // NOTE: Estimates based on concurrency. 
      // JSM Cloud does not have a simple RPM table.
      'free': { prettyName: 'Free', requestsPerMinute: 600, exportLimit: 1000 },
      'standard': { prettyName: 'Standard', requestsPerMinute: 1500, exportLimit: 5000 },
      'premium': { prettyName: 'Premium', requestsPerMinute: 3000, exportLimit: 10000 },
      'enterprise': { prettyName: 'Enterprise', requestsPerMinute: 5000, exportLimit: 20000 },
    },
    capabilities: {
      export: [
        'tickets', 'users', 'organizations', 'groups', 'articles', 
        'ticket_forms', 'sla_policies', 'custom_fields', 'automations'
      ],
      import: [
        'tickets', 'users', 'organizations', 'articles', 
        'custom_fields', 'ticket_forms'
      ],
    },
    features: {
      batchSize: 50,           
      complexityMultiplier: 2.5, 
    },
    limits: {
      maxAttachmentSizeMB: 100, 
      throughputBuffer: 0.25,   
    },
  },
  front: {
    id: 'front',
    name: 'Front',
    plans: {
      'starter': { prettyName: 'Starter', requestsPerMinute: 50, exportLimit: 50 },
      'growth': { prettyName: 'Growth', requestsPerMinute: 100, exportLimit: 100 },
      'scale': { prettyName: 'Scale', requestsPerMinute: 200, exportLimit: 200 },
      'premier': { prettyName: 'Premier', requestsPerMinute: 400, exportLimit: 400 },
    },
    capabilities: {
      export: [
        'tickets', 'users', 'organizations', 'groups', 
        'macros', 'tags', 'custom_fields'
      ],
      import: [
        'tickets', 'users', 'organizations', 'groups', 'tags'
      ],
    },
    features: {
      batchSize: 1,            
      complexityMultiplier: 1.2, 
    },
    limits: {
      maxAttachmentSizeMB: 25,
      throughputBuffer: 0.05,  
    },
  },
  gladly: {
    id: 'gladly',
    name: 'Gladly',
    plans: {
      // NOTE: "Super Hero" limit (1200) is an estimate for high-volume bursts.
      // Standard Hero limit is ~600 RPM.
      'hero': { prettyName: 'Hero', requestsPerMinute: 600, exportLimit: 600 },
      'super_hero': { prettyName: 'Super Hero', requestsPerMinute: 1200, exportLimit: 1200 },
    },
    capabilities: {
      export: [
        'tickets', 'users', 'groups', 'articles', 
        'macros', 'tags', 'custom_fields'
      ],
      import: [
        'tickets', 'users', 'articles', 'tags'
      ],
    },
    features: {
      batchSize: 1,            
      complexityMultiplier: 1.5, 
    },
    limits: {
      maxAttachmentSizeMB: 25,
      throughputBuffer: 0.10,
    },
  },
  gorgias: {
    id: 'gorgias',
    name: 'Gorgias',
    plans: {
      // Leaky Bucket Model: 40 req / 20s (120 RPM) for most plans.
      // Enterprise increases to 40 req / 10s (240 RPM).
      'starter': { prettyName: 'Starter', requestsPerMinute: 120, exportLimit: 50 },
      'basic': { prettyName: 'Basic', requestsPerMinute: 120, exportLimit: 100 },
      'pro': { prettyName: 'Pro', requestsPerMinute: 120, exportLimit: 200 },
      'advanced': { prettyName: 'Advanced', requestsPerMinute: 120, exportLimit: 500 },
      'enterprise': { prettyName: 'Enterprise', requestsPerMinute: 240, exportLimit: 1000 },
    },
    capabilities: {
      export: [
        'tickets', 'users', 'groups', 'macros', 
        'triggers', 'tags', 'custom_fields'
      ],
      import: [
        'tickets', 'users', 'groups', 'macros', 'tags', 'custom_fields'
      ],
    },
    features: {
      batchSize: 1,           
      complexityMultiplier: 1.3, 
    },
    limits: {
      maxAttachmentSizeMB: 10,
      throughputBuffer: 0.10,
    },
  },
};

export const ENTITY_LABELS: Record<DataEntity, string> = {
  tickets: 'Tickets & Conversations',
  users: 'Users (Agents & Customers)',
  organizations: 'Organizations',
  groups: 'Groups / Teams',
  articles: 'Knowledge Base',
  macros: 'Macros / Canned Responses',
  triggers: 'Triggers',
  automations: 'Automations',
  tags: 'Tags',
  custom_fields: 'Custom Fields',
  ticket_forms: 'Ticket Forms',
  sla_policies: 'SLA Policies',
};

export const ENTITY_DESCRIPTIONS: Record<DataEntity, string> = {
  tickets: 'Core support records including status, priority, comments, and file attachments.',
  users: 'Profiles for both Support Agents and End-Users (Customers).',
  organizations: 'Company profiles that group multiple users together.',
  groups: 'Agent teams or departments (e.g., "Sales", "Support").',
  articles: 'Public or private help center documentation and categories.',
  macros: 'Pre-written responses used by agents to reply quickly.',
  triggers: '"If-This-Then-That" rules that run immediately on ticket updates.',
  automations: 'Time-based rules (e.g., "Close ticket after 4 days of inactivity").',
  tags: 'Labels attached to tickets for categorization and reporting.',
  custom_fields: 'Non-standard data fields added to tickets or user profiles.',
  ticket_forms: 'Different ticket layouts presented to customers based on request type.',
  sla_policies: 'Service Level Agreement rules defining response/resolution deadlines.',
};