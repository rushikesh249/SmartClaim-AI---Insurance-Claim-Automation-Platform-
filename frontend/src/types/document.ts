export interface DocumentResponse {
  id: string;
  claim_id: string;
  document_type: string;
  file_path: string;
  quality_score: number;
  is_duplicate: boolean;
  created_at: string; // ISO date string
  file_name?: string;
  file_size?: number; // in bytes
  mime_type?: string;
}