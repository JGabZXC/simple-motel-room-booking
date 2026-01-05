import { useEffect, useState } from "react";
import type { CreateRoomDTO, Room } from "../types";
import { roomService } from "../services/roomService";

export const useRooms = (options?: { skipInitialFetch?: boolean }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchRooms(
    params?: { status?: string; start_time?: string; end_time?: string },
    signal?: AbortSignal
  ) {
    try {
      setLoading(true);
      const response = await roomService.getAll(params, signal);
      setRooms(response);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError(err.message || "Failed to load rooms");
      }
    } finally {
      setLoading(false);
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
