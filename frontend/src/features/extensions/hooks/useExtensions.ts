import { useEffect, useState } from "react";
import { extensionService } from "../services/extensionService";
import type { TimeExtension } from "../types";

export const useExtensionsForBooking = (bookingId: number) => {
  const [extensions, setExtensions] = useState<TimeExtension[]>([]);
  const [count, setCount] = useState<number>(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchExtensions(
    bookingId: number,
    params?: { page?: number },
    signal?: AbortSignal
  ) {
    try {
      setLoading(true);
      const data = await extensionService.getAllForBooking(
        bookingId,
        params,
        signal
      );
      setExtensions(data.results);
      setCount(data.count);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError(err.message || "Failed to load extensions");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    if (bookingId) {
      fetchExtensions(bookingId, undefined, controller.signal);
    }
    return () => controller.abort();
  }, [bookingId]);

  return {
    extensions,
    count,
    next,
    previous,
    loading,
    error,
    fetchExtensions,
  };
};

export const useExtension = (id: number) => {
  const [extension, setExtension] = useState<TimeExtension | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchExtension(id: number, signal?: AbortSignal) {
    try {
      setLoading(true);
      const data = await extensionService.get(id, signal);
      setExtension(data);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError(err.message || "Failed to load extension");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    if (id) {
      fetchExtension(id, controller.signal);
    }
    return () => controller.abort();
  }, [id]);

  return {
    extension,
    loading,
    error,
    fetchExtension,
  };
};

export const useUpdateExtension = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function updateExtension(id: number, data: Partial<TimeExtension>) {
    try {
      setLoading(true);
      await extensionService.update(id, data);
    } catch (err: any) {
      setError(err.message || "Failed to update extension");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    updateExtension,
  };
};

export const useCreateExtension = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function createExtension(
    bookingId: number,
    data: { duration: number }
  ) {
    try {
      setLoading(true);
      await extensionService.create(bookingId, data);
    } catch (err: any) {
      setError(err.message || "Failed to create extension");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    createExtension,
  };
};
