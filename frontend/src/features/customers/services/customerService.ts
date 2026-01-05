import { defaultAxios } from "../../../api/axios";
import type { CustomerResponse } from "../types";

export const customerService = {
  getAll: async (
    params?: { page?: number },
    signal?: AbortSignal
  ): Promise<CustomerResponse> => {
    const result = await defaultAxios.get<CustomerResponse>(
      "/customer-detail/",
      { params, signal }
    );
    return result.data;
  },
};
