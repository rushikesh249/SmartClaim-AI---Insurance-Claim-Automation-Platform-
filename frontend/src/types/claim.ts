export interface ClaimCreateRequest {
  policy_id: string;
  claim_type: 'health' | 'motor';
  incident_date: string; // ISO date string
  incident_location?: string;
  incident_description?: string;
  claimed_amount: number;
}

export interface ClaimUpdateRequest {
  incident_date?: string; // ISO date string
  incident_location?: string;
  incident_description?: string;
  claimed_amount?: number;
}

export interface ClaimResponse {
  id: string;
  claim_number: string;
  policy_id: string;
  user_id: string;
  claim_type: 'health' | 'motor';
  incident_date: string; // ISO date string
  incident_location?: string;
  incident_description?: string;
  claimed_amount: number;
  approved_amount?: number;
  status: string;
  readiness_score?: number;
  fraud_score?: number;
  decision_type?: string;
  rejection_reason?: string;
  created_at?: string; // ISO date string
  updated_at: string; // ISO date string
}