import { axiosJSON, defaultAxios } from "../../../api/axios";
import type {
  RoomBooking,
  CreateRoomBookingDTO,
  UpdateRoomBookingDTO,
  BookingResponse,
} from "../types";

interface BookingQueryParams {
  status?: string;
  start_time?: string;
  end_time?: string;
  guest_name?: string;
  page?: number;
}

export const bookingService = {
  getAll: async (
    params?: BookingQueryParams,
    signal?: AbortSignal
  ): Promise<BookingResponse> => {
    const result = await defaultAxios.get<BookingResponse>("/room-booking/", {
      params,
      signal,
    });
    return result.data;
  },

  get: async (id: number, signal?: AbortSignal): Promise<RoomBooking> => {
    const result = await defaultAxios.get<RoomBooking>(`/room-booking/${id}/`, {
      signal,
    });
    return result.data;
  },

  create: async (
    data: CreateRoomBookingDTO,
    signal?: AbortSignal
  ): Promise<RoomBooking> => {
    const result = await axiosJSON.post<RoomBooking>("/room-booking/", data, {
      signal,
    });
    return result.data;
  },

  update: async (
    id: number,
    data: UpdateRoomBookingDTO,
    signal?: AbortSignal
  ): Promise<RoomBooking> => {
    const result = await axiosJSON.patch<RoomBooking>(
      `/room-booking/${id}/`,
      data,
      { signal }
    );
    return result.data;
  },

  updateStatus: async (
    id: number,
    status: string,
    signal?: AbortSignal
  ): Promise<RoomBooking> => {
    const result = await axiosJSON.patch<RoomBooking>(
      `/room-booking/${id}/`,
      { status },
      { signal }
    );
    return result.data;
  },
};
