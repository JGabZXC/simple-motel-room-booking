import { useEffect, useState } from "react";
import type { CreateRoomDTO, Room } from "../types";
import { roomService } from "../services/roomService";

export const useRooms = (options?: { skipInitialFetch?: boolean }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [count, setCount] = useState<number>(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRooms(
    params?: {
      status?: string;
      start_time?: string;
      end_time?: string;
      page?: number;
      code?: string;
      min_price?: number;
      max_price?: number;
    },
    signal?: AbortSignal
  ) {
    try {
      setLoading(true);
      const response = await roomService.getAll(params, signal);
      setRooms(response.results);
      setCount(response.count);
      setNext(response.next);
      setPrevious(response.previous);
      setLoading(false);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError(err.message || "Failed to load rooms");
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (options?.skipInitialFetch) return;
    const controller = new AbortController();
    fetchRooms(undefined, controller.signal);
    return () => controller.abort();
  }, []);

  return {
    rooms,
    count,
    next,
    previous,
    loading,
    error,
    fetchRooms,
  };
};

export const useRoom = (code: string) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchRoom(code: string, signal?: AbortSignal) {
    try {
      setLoading(true);
      const response = await roomService.get(code, signal);
      setRoom(response);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError(err.message || "Failed to load room");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    if (code) {
      fetchRoom(code, controller.signal);
    }
    return () => controller.abort();
  }, [code]);

  return {
    room,
    loading,
    error,
    fetchRoom,
  };
};

export const useCreateRoom = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  async function createRoom(data: Omit<CreateRoomDTO, "id">) {
    try {
      setLoading(true);
      await roomService.create(data);
    } catch (err: any) {
      setError(err.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  }
  return {
    loading,
    error,
    createRoom,
  };
};

export const useUpdateRoom = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function updateRoom(code: string, data: Partial<CreateRoomDTO>) {
    try {
      setLoading(true);
      await roomService.update(code, data);
    } catch (err: any) {
      setError(err.message || "Failed to update room");
    } finally {
      setLoading(false);
    }
  }
  return {
    loading,
    error,
    updateRoom,
  };
};

export const useDeleteRoom = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteRoom(code: string) {
    try {
      setLoading(true);
      await roomService.delete(code);
    } catch (err: any) {
      setError(err.message || "Failed to delete room");
    } finally {
      setLoading(false);
    }
  }
  return {
    loading,
    error,
    deleteRoom,
  };
};

// in-memory cache
const roomsCache = new Map<string, { data: Room[]; next: string | null }>();

export const useInfiniteRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async (
    params: {
      status?: string;
      start_time?: string;
      end_time?: string;
      code?: string;
      min_price?: number;
      max_price?: number;
    },
    reset = false
  ) => {
    const paramsString = JSON.stringify(params);

    if (reset) {
      if (roomsCache.has(paramsString)) {
        const cached = roomsCache.get(paramsString)!;
        setRooms(cached.data);
        setNext(cached.next);
        return;
      }

      // Client-side filtering optimization
      if (params.code) {
        const { code, ...baseParams } = params;
        const baseParamsString = JSON.stringify(baseParams);

        if (roomsCache.has(baseParamsString)) {
          const baseCache = roomsCache.get(baseParamsString)!;
          const filteredRooms = baseCache.data.filter((r) =>
            r.code.toLowerCase().includes(code!.toLowerCase())
          );

          if (filteredRooms.length > 0 || !baseCache.next) {
            setRooms(filteredRooms);
            setNext(null);
            roomsCache.set(paramsString, { data: filteredRooms, next: null });
            return;
          }
        }
      }

      setRooms([]);
      setNext(null);
    }

    if (!reset && rooms.length > 0 && !next) return;

    try {
      setLoading(true);
      const nextPage = reset ? 1 : Math.ceil(rooms.length / 10) + 1;

      const response = await roomService.getAll({ ...params, page: nextPage });

      setRooms((prev) => {
        const newRooms = reset
          ? response.results
          : [...prev, ...response.results];
        roomsCache.set(paramsString, {
          data: newRooms,
          next: response.next,
        });
        return newRooms;
      });
      setNext(response.next);
      setLoading(false);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError(err.message || "Failed to load rooms");
        setLoading(false);
      }
    }
  };

  return {
    rooms,
    next,
    loading,
    error,
    fetchRooms,
  };
};
