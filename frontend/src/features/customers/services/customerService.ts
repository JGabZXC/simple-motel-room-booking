import { defaultAxios } from "../../../api/axios";
import type { CustomerDetail } from "../types";

export const customerService = {
  getAll: async (): Promise<CustomerDetail[]> => {
    const result = await defaultAxios.get<CustomerDetail[]>(
      "/customer-detail/"
    );
    return result.data;
  },
};
