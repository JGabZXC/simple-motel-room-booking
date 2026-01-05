import { axiosJSON, defaultAxios } from "../../../api/axios";
import type { Room, CreateRoomDTO, UpdateRoomDTO } from "../types";

interface RoomQueryParams {
  status?: string;
  start_time?: string;
  end_time?: string;
}

export const roomService = {
  getAll: async (
    params?: RoomQueryParams,
    signal?: AbortSignal
  ): Promise<Room[]> => {
    const result = await defaultAxios.get<Room[]>("/room/", { params, signal });
    return result.data;
  },

  get: async (code: string, signal?: AbortSignal): Promise<Room> => {
    const result = await defaultAxios.get<Room>(`/room/${code}`, { signal });
    return result.data;
  },

  create: async (
    data: Omit<CreateRoomDTO, "id">,
    signal?: AbortSignal
  ): Promise<Room> => {
    const result = await axiosJSON.post<Room>("/room/", data, { signal });
    return result.data;
  },

  update: async (
    code: string,
    data: UpdateRoomDTO,
    signal?: AbortSignal
  ): Promise<Room> => {
    const result = await axiosJSON.patch<Room>(`/room/${code}`, data, {
      signal,
    });
    return result.data;
  },

  delete: async (code: string, signal?: AbortSignal): Promise<void> => {
    return axiosJSON.delete(`/room/${code}`, { signal });
  },
};
