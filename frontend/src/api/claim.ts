import client from './client';
import type { ClaimCreateRequest, ClaimUpdateRequest, ClaimResponse } from '@/types/claim';
import { toIsoDateTime } from '@/lib/dateUtils';

export const claimApi = {
  createClaim: async (payload: ClaimCreateRequest): Promise<ClaimResponse> => {
    // Transform the payload to ensure incident_date is in ISO datetime format
    const transformedPayload = {
      ...payload,
      incident_date: toIsoDateTime(payload.incident_date)
    };
    
    const response = await client.post<ClaimResponse>('/api/v1/claims/', transformedPayload);
    return response.data;
  },

  listClaims: async (status?: string): Promise<ClaimResponse[]> => {
    const params = status ? { status } : {};
    const response = await client.get<ClaimResponse[]>('/api/v1/claims/', { params });
    return response.data;
  },

  getClaim: async (claimId: string): Promise<ClaimResponse> => {
    const response = await client.get<ClaimResponse>(`/api/v1/claims/${claimId}`);
    return response.data;
  },

  updateClaim: async (claimId: string, payload: ClaimUpdateRequest): Promise<ClaimResponse> => {
    const response = await client.put<ClaimResponse>(`/api/v1/claims/${claimId}`, payload);
    return response.data;
  },
};