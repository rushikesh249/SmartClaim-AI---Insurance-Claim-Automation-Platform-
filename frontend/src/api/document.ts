import client from './client';
import type { DocumentResponse } from '@/types/document';

export const documentApi = {
  listDocuments: async (claimId: string): Promise<DocumentResponse[]> => {
    const response = await client.get<DocumentResponse[]>(`/api/v1/claims/${claimId}/documents`);
    return response.data;
  },

  uploadDocument: async (claimId: string, file: File, documentType: string): Promise<DocumentResponse> => {
    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('file', file);

    const response = await client.post<DocumentResponse>(
      `/api/v1/claims/${claimId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};