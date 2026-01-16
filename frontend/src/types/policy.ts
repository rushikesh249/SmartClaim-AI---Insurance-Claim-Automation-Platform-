export interface PolicyLinkRequest {
  policy_number: string;
  policy_type: 'health' | 'motor';
  insurer_name: string;
  sum_insured: number;
  premium_amount?: number;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  coverage_details?: Record<string, any>;
}

export interface PolicyResponse {
  id: string;
  user_id: string;
  policy_number: string;
  policy_type: 'health' | 'motor';
  insurer_name: string;
  sum_insured: number;
  premium_amount?: number;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  status: string;
  coverage_details?: Record<string, any>;
  created_at?: string; // ISO date string
}