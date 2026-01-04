import type {
  CustomerDetail,
  CreateCustomerDetailDTO,
} from "../customers/types";

export interface RoomBooking {
  id: number;
  room_code: string; // FK to Room code
  start_time: string;
  end_time: string;
  original_end_time: string;
  status: "booked" | "checked_in" | "checked_out" | "cancelled";
  total_price: string;
  booked_at: string;
  checked_in_at?: string;
  checked_out_at?: string;
  cancelled_at?: string;
  customer_details: CustomerDetail[];
}

export interface CreateRoomBookingDTO {
  room_code: string;
  start_time: string;
  end_time: string;
  customer_details: CreateCustomerDetailDTO[];
}

export interface UpdateRoomBookingDTO {
  status?: "booked" | "checked_in" | "checked_out" | "cancelled";
  start_time?: string;
  end_time?: string;
}
