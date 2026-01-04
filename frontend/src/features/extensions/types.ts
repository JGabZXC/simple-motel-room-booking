export interface TimeExtension {
  id: number;
  room_booking: number;
  duration: number; // minutes
  additional_cost: string;
  added_at: string;
}

export interface CreateTimeExtensionDTO {
  duration: number;
}
