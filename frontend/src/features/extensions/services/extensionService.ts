import { axiosJSON, defaultAxios } from "../../../api/axios";
import type { TimeExtension, CreateTimeExtensionDTO } from "../types";

export const extensionService = {
  getAllForBooking: async (bookingId: number): Promise<TimeExtension[]> => {
    const result = await defaultAxios.get<TimeExtension[]>(
      `/time-extension/${bookingId}/extensions/`
    );
    return result.data;
  },

  create: async (
    bookingId: number,
    data: CreateTimeExtensionDTO
  ): Promise<TimeExtension> => {
    const result = await axiosJSON.post<TimeExtension>(
      `/time-extension/${bookingId}/extensions/`,
      data
    );
    return result.data;
  },

  get: async (id: number): Promise<TimeExtension> => {
    const result = await defaultAxios.get<TimeExtension>(
      `/time-extension/${id}/`
    );
    return result.data;
  },
};
