export interface BedDetails {
  [key: string]: number; // e.g., 'single': 1, 'double': 2
}

export interface Room {
  id: string;
  code: string;
  capacity: number;
  is_air_conditioned: boolean;
  status: "open" | "closed" | "maintenance";
  price_per_hour: string; // Decimal comes as string from API usually
  bed_details: BedDetails;
  created_at: string;
  updated_at: string;
}

export interface CreateRoomDTO {
  id: string;
  code: string;
  capacity: number;
  is_air_conditioned: boolean;
  status: "open" | "closed" | "maintenance";
  price_per_hour: number;
  bed_details: BedDetails;
}

export interface UpdateRoomDTO extends Partial<CreateRoomDTO> {}

export interface RoomResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Room[];
}
