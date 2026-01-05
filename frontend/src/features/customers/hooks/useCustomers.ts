import { useEffect, useState } from "react";
import type { CustomerDetail } from "../types";
import { customerService } from "../services/customerService";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<CustomerDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCustomers(signal?: AbortSignal) {
    try {
      setLoading(true);
      const reseponse = await customerService.getAll(signal);
      setCustomers(reseponse);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError(err.message || "Failed to load customers");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchCustomers(controller.signal);
    return () => controller.abort();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
  };
};
