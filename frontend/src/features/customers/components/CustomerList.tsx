import React, { useState } from "react";
import { useCustomers } from "../hooks/useCustomers";
import { toast } from "react-toastify";

const CustomerList: React.FC = () => {
  const { customers, count, next, previous, loading, error, fetchCustomers } =
    useCustomers();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCustomers({ page });
  };

  const totalPages = Math.ceil(count / pageSize);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxPagesSide = 5;
    const startPage = Math.max(1, currentPage - maxPagesSide);
    const endPage = Math.min(totalPages, currentPage + maxPagesSide);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 border rounded ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 hover:bg-blue-100"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!previous}
          className={`px-3 py-1 mx-1 border rounded ${
            !previous
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-blue-500 hover:bg-blue-100"
          }`}
        >
          Prev
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!next}
          className={`px-3 py-1 mx-1 border rounded ${
            !next
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-blue-500 hover:bg-blue-100"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  if (loading && customers.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <div className="bg-white shadow-md rounded my-6 overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        )}
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
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Total Customers: {count}</span>
        {renderPagination()}
      </div>
    </div>
  );
};

export default CustomerList;
