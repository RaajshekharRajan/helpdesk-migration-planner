// src/utils/calculator.ts
import { PLATFORMS, ENTITY_LABELS } from '../data/platforms';
import { CalculatorInputs, TimelineResult, DataEntity } from '../types';

export const calculateTimeline = (inputs: CalculatorInputs): TimelineResult => {
  const srcConfig = PLATFORMS[inputs.source];
  const dstConfig = PLATFORMS[inputs.destination];
  
  // These lookups now work with dynamic string keys
  const srcPlan = srcConfig.plans[inputs.sourcePlan];
  const dstPlan = dstConfig.plans[inputs.destPlan];

  // Safety check in case plan doesn't exist (defensive coding)
  if (!srcPlan || !dstPlan) {
    console.error("Plan not found for platform");
    return {
      totalDurationHours: 0, minDurationHours: 0, maxDurationHours: 0,
      breakdown: { foundation: 0, coreData: 0, attachments: 0 },
      entityBreakdown: {}, bottleneck: "Invalid Configuration", riskLevel: "High",
      apiTasks: [], manualTasks: []
    };
  }

  // 1. Categorize Tasks (API vs Manual)
  const apiTasks: string[] = [];
  const manualTasks: string[] = [];

  inputs.selectedEntities.forEach(entity => {
    const canExport = srcConfig.capabilities.export.includes(entity);
    const canImport = dstConfig.capabilities.import.includes(entity);

    if (canExport && canImport) {
      apiTasks.push(ENTITY_LABELS[entity]);
    } else {
      manualTasks.push(ENTITY_LABELS[entity]);
    }
  });

  // 2. Determine Speed Limits
  const srcExportBatchSize = inputs.source === 'zendesk' ? 1000 : 30; 
  const srcLimit = srcPlan.exportLimit || srcPlan.requestsPerMinute;
  const srcRecordsPerMin = srcLimit * srcExportBatchSize;

  const dstImportBatchSize = dstConfig.features.batchSize; 
  const dstLimit = dstPlan.createTicketLimit || dstPlan.requestsPerMinute;
  const dstRecordsPerMin = dstLimit * dstImportBatchSize;

  const effectiveRecordsPerMin = Math.min(srcRecordsPerMin, dstRecordsPerMin);
  const bottleneckName = srcRecordsPerMin < dstRecordsPerMin 
    ? `${srcConfig.name} (${srcPlan.prettyName}) Limits` 
    : `${dstConfig.name} (${dstPlan.prettyName}) Limits`;

  // 3. Define Confidence Scenarios
  const baseBuffer = Math.min(srcConfig.limits.throughputBuffer, dstConfig.limits.throughputBuffer);
  
  const scenarios = {
    likely: 1 - baseBuffer,
    optimistic: 0.95,
    conservative: 0.60
  };

  // 4. Calculation Helper
  const calculateDuration = (efficiency: number) => {
    const speed = effectiveRecordsPerMin * efficiency;
    const finalSpeed = speed > 0 ? speed : 1;

    let foundationMinutes = 0;
    let coreDataMinutes = 0; // Tickets
    const breakdown: Partial<Record<DataEntity, number>> = {};

    inputs.selectedEntities.forEach(entity => {
      const isApi = srcConfig.capabilities.export.includes(entity) && dstConfig.capabilities.import.includes(entity);
      if (!isApi) {
        breakdown[entity] = 0;
        return;
      }

      const volume = inputs.volumes[entity] || 0;
      let ops = volume;

      if (entity === 'tickets') {
        ops = volume * dstConfig.features.complexityMultiplier;
      }

      const minutes = ops / finalSpeed;
      breakdown[entity] = minutes / 60; // Store as hours

      if (entity === 'tickets') {
        coreDataMinutes += minutes;
      } else {
        foundationMinutes += minutes;
      }
    });

    return { foundationMinutes, coreDataMinutes, breakdown };
  };

  const likely = calculateDuration(scenarios.likely);
  const optimistic = calculateDuration(scenarios.optimistic);
  const conservative = calculateDuration(scenarios.conservative);

  // 5. Attachments
  let attachmentMinutes = 0;
  let totalDataMB = 0;
  if (inputs.selectedEntities.includes('tickets')) {
    const ticketCount = inputs.volumes['tickets'] || 0;
    const totalAttachments = ticketCount * inputs.avgAttachmentsPerTicket;
    totalDataMB = totalAttachments * inputs.avgAttachmentSizeMB;
    const estimatedBandwidthMBPerMin = 90; 
    attachmentMinutes = totalDataMB / estimatedBandwidthMBPerMin;
  }
  
  const attLikely = attachmentMinutes;
  const attOptimistic = attachmentMinutes * 0.9; 
  const attConservative = attachmentMinutes * 1.3;

  // 6. Sum Totals
  const totalLikely = (likely.foundationMinutes + likely.coreDataMinutes + attLikely) / 60;
  const totalOptimistic = (optimistic.foundationMinutes + optimistic.coreDataMinutes + attOptimistic) / 60;
  const totalConservative = (conservative.foundationMinutes + conservative.coreDataMinutes + attConservative) / 60;

  // 7. Risk Assessment
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  const ticketCount = inputs.volumes['tickets'] || 0;
  
  if (ticketCount > 100000 || totalDataMB > 50000) riskLevel = 'High';
  else if (manualTasks.length > 2 || ticketCount > 50000) riskLevel = 'Medium'; 

  return {
    totalDurationHours: totalLikely,
    minDurationHours: totalOptimistic,
    maxDurationHours: totalConservative,
    breakdown: {
      foundation: likely.foundationMinutes / 60,
      coreData: likely.coreDataMinutes / 60,
      attachments: attLikely / 60,
    },
    entityBreakdown: likely.breakdown,
    bottleneck: bottleneckName,
    riskLevel,
    apiTasks,
    manualTasks
  };
};