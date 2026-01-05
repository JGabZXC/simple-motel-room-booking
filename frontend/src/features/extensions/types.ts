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

export interface ExtensionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TimeExtension[];
}
