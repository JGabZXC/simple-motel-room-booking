import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRooms, useDeleteRoom } from "../hooks/useRooms";
import { toast } from "react-toastify";

const RoomList: React.FC = () => {
  const { rooms, count, next, previous, loading, error, fetchRooms } =
    useRooms();
  const { deleteRoom } = useDeleteRoom();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [roomCodeSearch, setRoomCodeSearch] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const pageSize = 10; // Assuming page size is 10

  React.useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchRooms(
        {
          status: statusFilter || undefined,
          page: currentPage,
          code: roomCodeSearch || undefined,
          min_price: minPrice === "" ? undefined : minPrice,
          max_price: maxPrice === "" ? undefined : maxPrice,
        },
        controller.signal
      );
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [statusFilter, currentPage, roomCodeSearch, minPrice, maxPrice]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDelete = async (code: string) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(code);
        toast.success("Room deleted successfully");
        fetchRooms({
          status: statusFilter || undefined,
          page: currentPage,
          code: roomCodeSearch || undefined,
          min_price: minPrice === "" ? undefined : minPrice,
          max_price: maxPrice === "" ? undefined : maxPrice,
        });
      } catch (error) {
        toast.error("Failed to delete room");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  if (loading && rooms.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Rooms</h1>
          <Link
            to="/rooms/new"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Room
          </Link>
        </div>
        <div className="flex gap-4 flex-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={handleFilterChange}
              className="border rounded px-2 py-1"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Code
            </label>
            <input
              type="text"
              placeholder="Search Code"
              value={roomCodeSearch}
              onChange={(e) => setRoomCodeSearch(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Min Price
            </label>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) =>
                setMinPrice(e.target.value ? Number(e.target.value) : "")
              }
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Max Price
            </label>
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(e.target.value ? Number(e.target.value) : "")
              }
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded my-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        )}
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Code</th>
              <th className="py-3 px-6 text-left">Capacity</th>
              <th className="py-3 px-6 text-center">AC</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-right">Price/Hr</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {rooms.map((room) => (
              <tr
                key={room.code}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                  {room.code}
                </td>
                <td className="py-3 px-6 text-left">{room.capacity}</td>
                <td className="py-3 px-6 text-center">
                  {room.is_air_conditioned ? (
                    <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
                      Yes
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">
                      No
                    </span>
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`py-1 px-3 rounded-full text-xs ${
                      room.status === "open"
                        ? "bg-green-200 text-green-600"
                        : room.status === "maintenance"
                        ? "bg-yellow-200 text-yellow-600"
                        : "bg-red-200 text-red-600"
                    }`}
                  >
                    {room.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-right">${room.price_per_hour}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <Link
                      to={`/rooms/${room.code}/edit`}
                      className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(room.code)}
                      className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Total Rooms: {count}</span>
        {renderPagination()}
      </div>
    </div>
  );
};

export default RoomList;
