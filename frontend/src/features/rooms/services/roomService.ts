import { axiosJSON, defaultAxios } from "../../../api/axios";
import type { Room, CreateRoomDTO, UpdateRoomDTO } from "../types";

export const roomService = {
  getAll: async (): Promise<Room[]> => {
    const result = await defaultAxios.get<Room[]>("/room/");
    return result.data;
  },

  get: async (code: string): Promise<Room> => {
    const result = await defaultAxios.get<Room>(`/room/${code}`);
    return result.data;
  },

  create: async (data: Omit<CreateRoomDTO, "id">): Promise<Room> => {
    const result = await axiosJSON.post<Room>("/room/", data);
    return result.data;
  },

  update: async (code: string, data: UpdateRoomDTO): Promise<Room> => {
    const result = await axiosJSON.patch<Room>(`/room/${code}`, data);
    return result.data;
  },

  delete: async (code: string): Promise<void> => {
    return axiosJSON.delete(`/room/${code}`);
  },
};
