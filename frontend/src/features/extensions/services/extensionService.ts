import { axiosJSON, defaultAxios } from "../../../api/axios";
import type {
  TimeExtension,
  CreateTimeExtensionDTO,
  ExtensionResponse,
} from "../types";

export const extensionService = {
  getAllForBooking: async (
    bookingId: number,
    params?: { page?: number },
    signal?: AbortSignal
  ): Promise<ExtensionResponse> => {
    const result = await defaultAxios.get<ExtensionResponse>(
      `/time-extension/${bookingId}/extensions/`,
      { params, signal }
    );
    return result.data;
  },

  create: async (
    bookingId: number,
    data: CreateTimeExtensionDTO,
    signal?: AbortSignal
  ): Promise<TimeExtension> => {
    const result = await axiosJSON.post<TimeExtension>(
      `/time-extension/${bookingId}/extensions/`,
      data,
      { signal }
    );
    return result.data;
  },

  get: async (id: number, signal?: AbortSignal): Promise<TimeExtension> => {
    const result = await defaultAxios.get<TimeExtension>(
      `/time-extension/${id}/`,
      { signal }
    );
    return result.data;
  },

  update: async (
    id: number,
    data: Partial<CreateTimeExtensionDTO>,
    signal?: AbortSignal
  ): Promise<TimeExtension> => {
    const result = await axiosJSON.patch<TimeExtension>(
      `/time-extension/${id}/`,
      data,
      { signal }
    );
    return result.data;
  },
};
