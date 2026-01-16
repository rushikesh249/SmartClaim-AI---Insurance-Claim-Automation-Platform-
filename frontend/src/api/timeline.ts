import client from './client';
import type { TimelineEventResponse } from '@/types/timeline';

export const timelineApi = {
  getTimeline: async (claimId: string): Promise<TimelineEventResponse[]> => {
    const response = await client.get<TimelineEventResponse[]>(`/api/v1/claims/${claimId}/timeline`);
    return response.data;
  },
};