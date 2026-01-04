import { axiosJSON, defaultAxios } from "../../../api/axios";
import type {
  RoomBooking,
  CreateRoomBookingDTO,
  UpdateRoomBookingDTO,
} from "../types";

export const bookingService = {
  getAll: async (): Promise<RoomBooking[]> => {
    const result = await defaultAxios.get<RoomBooking[]>("/room-booking/");
    return result.data;
  },

  get: async (id: number): Promise<RoomBooking> => {
    const result = await defaultAxios.get<RoomBooking>(`/room-booking/${id}/`);
    return result.data;
  },

  create: async (data: CreateRoomBookingDTO): Promise<RoomBooking> => {
    const result = await axiosJSON.post<RoomBooking>("/room-booking/", data);
    return result.data;
  },

  update: async (
    id: number,
    data: UpdateRoomBookingDTO
  ): Promise<RoomBooking> => {
    const result = await axiosJSON.patch<RoomBooking>(
      `/room-booking/${id}/`,
      data
    );
    return result.data;
  },
};
