import { useEffect, useState } from "react";
import type { CreateRoomBookingDTO, RoomBooking } from "../types";
import { bookingService } from "../services/bookingService";

export const useBookings = (options?: { skipInitialFetch?: boolean }) => {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchBookings(
    params?: {
      status?: string;
      start_time?: string;
      end_time?: string;
      guest_name?: string;
    },
    signal?: AbortSignal
  ) {
    try {
      setLoading(true);
      const response = await bookingService.getAll(params, signal);
      setBookings(response);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError(err.message || "Failed to load bookings");
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateBookingStatus(
    id: number,
    status: RoomBooking["status"]
  ) {
    try {
      await bookingService.updateStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update booking status");
      throw err;
    }
  }

  useEffect(() => {
    if (options?.skipInitialFetch) return;
    const controller = new AbortController();
    fetchBookings(undefined, controller.signal);
    return () => controller.abort();
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    updateBookingStatus,
  };
};

export const useBooking = (id: number) => {
  const [booking, setBooking] = useState<RoomBooking | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchBooking(id: number, signal?: AbortSignal) {
    try {
      setLoading(true);
      const response = await bookingService.get(id, signal);
      setBooking(response);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError(err.message || "Failed to load booking");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    if (id) {
      fetchBooking(id, controller.signal);
    }
    return () => controller.abort();
  }, [id]);

  return {
    booking,
    loading,
    error,
    fetchBooking,
  };
};

export const useCreateBooking = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function createBooking(data: CreateRoomBookingDTO) {
    try {
      setLoading(true);
      await bookingService.create(data);
    } catch (err: any) {
      setError(err.message || "Failed to create booking");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    createBooking,
    loading,
    error,
  };
};

export const useUpdateBooking = (id: number) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function updateBooking(data: Partial<RoomBooking>) {
    try {
      setLoading(true);
      await bookingService.update(id, data);
    } catch (err: any) {
      setError(err.message || "Failed to update booking");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    updateBooking,
    loading,
    error,
  };
};
