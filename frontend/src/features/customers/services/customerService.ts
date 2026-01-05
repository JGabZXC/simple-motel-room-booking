import { defaultAxios } from "../../../api/axios";
import type { CustomerDetail } from "../types";

export const customerService = {
  getAll: async (signal?: AbortSignal): Promise<CustomerDetail[]> => {
    const result = await defaultAxios.get<CustomerDetail[]>(
      "/customer-detail/",
      { signal }
    );
    return result.data;
  },
};
