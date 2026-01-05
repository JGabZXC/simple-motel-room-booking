import { useEffect, useState } from "react";
import type { CustomerDetail } from "../types";
import { customerService } from "../services/customerService";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<CustomerDetail[]>([]);
  const [count, setCount] = useState<number>(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCustomers(
    params?: { page?: number },
    signal?: AbortSignal
  ) {
    try {
      setLoading(true);
      const response = await customerService.getAll(params, signal);
      setCustomers(response.results);
      setCount(response.count);
      setNext(response.next);
      setPrevious(response.previous);
      setLoading(false);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError(err.message || "Failed to load customers");
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchCustomers(undefined, controller.signal);
    return () => controller.abort();
  }, []);

  return {
    customers,
    count,
    next,
    previous,
    loading,
    error,
    fetchCustomers,
  };
};
