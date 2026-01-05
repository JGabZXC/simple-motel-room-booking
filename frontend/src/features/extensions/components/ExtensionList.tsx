import React from "react";
import type { TimeExtension } from "../types";

interface ExtensionListProps {
  extensions: TimeExtension[];
  count: number;
  next: string | null;
  previous: string | null;
  onPageChange: (page: number) => void;
  currentPage: number;
  loading?: boolean;
}

const ExtensionList: React.FC<ExtensionListProps> = ({
  extensions,
  count,
  next,
  previous,
  onPageChange,
  currentPage,
  loading,
}) => {
  const pageSize = 10;
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
          onClick={() => onPageChange(i)}
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
          onClick={() => onPageChange(currentPage - 1)}
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
          onClick={() => onPageChange(currentPage + 1)}
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

  if (loading && extensions.length === 0) {
    return <div>Loading...</div>;
  }

  if (extensions.length === 0) {
    return <div className="text-gray-500 italic">No extensions found.</div>;
  }

  return (
    <div className="bg-white shadow rounded overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Duration (hours)
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Cost
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Added At
            </th>
          </tr>
        </thead>
        <tbody>
          {extensions.map((ext) => (
            <tr key={ext.id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {ext.duration}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                ${ext.additional_cost}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {new Date(ext.added_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">
            Total Extensions: {count}
          </span>
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default ExtensionList;
