import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? "bg-gray-700" : "";
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Motel Admin
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/rooms"
              className={`block p-2 rounded hover:bg-gray-700 ${isActive(
                "/rooms"
              )}`}
            >
              Rooms
            </Link>
          </li>
          <li>
            <Link
              to="/bookings"
              className={`block p-2 rounded hover:bg-gray-700 ${isActive(
                "/bookings"
              )}`}
            >
              Bookings
            </Link>
          </li>
          <li>
            <Link
              to="/customers"
              className={`block p-2 rounded hover:bg-gray-700 ${isActive(
                "/customers"
              )}`}
            >
              Customers
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
