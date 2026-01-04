import React from "react";
import type { TimeExtension } from "../types";

interface ExtensionListProps {
  extensions: TimeExtension[];
}

const ExtensionList: React.FC<ExtensionListProps> = ({ extensions }) => {
  if (extensions.length === 0) {
    return <div className="text-gray-500 italic">No extensions found.</div>;
  }

  return (
    <div className="bg-white shadow rounded overflow-hidden">
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
    </div>
  );
};

export default ExtensionList;
