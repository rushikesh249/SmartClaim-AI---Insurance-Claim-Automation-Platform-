import client from './client';

export const workflowApi = {
  submitClaim: async (claimId: string): Promise<any> => {
    const response = await client.post(`/api/v1/claims/${claimId}/submit`);
    return response.data;
  },

  getSummaryPdf: async (claimId: string): Promise<Blob> => {
    const response = await client.get(`/api/v1/claims/${claimId}/summary-pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },
};