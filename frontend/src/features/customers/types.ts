export interface CustomerDetail {
  id: number;
  room_booking: number | null; // ID of the booking
  name: string;
  age: number;
  email?: string;
  phone_number?: string;
  gender: "male" | "female" | "other";
}

export interface CreateCustomerDetailDTO {
  name: string;
  age: number;
  email?: string;
  phone_number?: string;
  gender: "male" | "female" | "other";
}
