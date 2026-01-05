import React from "react";
import { useCustomers } from "../hooks/useCustomers";
import { toast } from "react-toastify";

const CustomerList: React.FC = () => {
  const { customers, loading, error } = useCustomers();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Age</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-center">Gender</th>
              <th className="py-3 px-6 text-center">Booking ID</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                  {customer.name}
                </td>
                <td className="py-3 px-6 text-left">{customer.age}</td>
                <td className="py-3 px-6 text-left">{customer.email || "-"}</td>
                <td className="py-3 px-6 text-left">
                  {customer.phone_number || "-"}
                </td>
                <td className="py-3 px-6 text-center capitalize">
                  {customer.gender}
                </td>
                <td className="py-3 px-6 text-center">
                  {customer.room_booking}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;
