export interface TimelineEventResponse {
  id: string;
  claim_id: string;
  event_type: string;
  description: string;
  timestamp: string; // ISO date string
  user_id?: string;
  metadata?: Record<string, any>;
}