import client from './client';
import type { PolicyLinkRequest, PolicyResponse } from '@/types/policy';

export const policyApi = {
  linkPolicy: async (payload: PolicyLinkRequest): Promise<PolicyResponse> => {
    const response = await client.post<PolicyResponse>('/api/v1/policies/link', payload);
    return response.data;
  },

  listPolicies: async (): Promise<PolicyResponse[]> => {
    const response = await client.get<PolicyResponse[]>('/api/v1/policies/');
    return response.data;
  },

  getPolicy: async (policyId: string): Promise<PolicyResponse> => {
    const response = await client.get<PolicyResponse>(`/api/v1/policies/${policyId}`);
    return response.data;
  },
};