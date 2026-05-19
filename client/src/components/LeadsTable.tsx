import toast from "react-hot-toast";

import API from "../api/axios";

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
}

interface Props {
  leads: Lead[];

  fetchLeads: () => void;

  role?: string;
}

function LeadsTable({
  leads,
  fetchLeads,
  role,
}: Props) {
  const handleDelete = async (
    id: string
  ) => {
    try {
      await API.delete(`/leads/${id}`);

      toast.success(
        "Lead deleted successfully"
      );

      fetchLeads();
    } catch (error) {
      toast.error(
        "Failed to delete lead"
      );
    }
  };

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700";

      case "Contacted":
        return "bg-yellow-100 text-yellow-700";

      case "Qualified":
        return "bg-green-100 text-green-700";

      case "Lost":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-700">
              Name
            </th>

            <th className="text-left p-4 font-semibold text-gray-700">
              Email
            </th>

            <th className="text-left p-4 font-semibold text-gray-700">
              Status
            </th>

            <th className="text-left p-4 font-semibold text-gray-700">
              Source
            </th>

            <th className="text-left p-4 font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="border-t border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="p-4 font-medium text-gray-900">
                {lead.name}
              </td>

              <td className="p-4 text-gray-600">
                {lead.email}
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    lead.status
                  )}`}
                >
                  {lead.status}
                </span>
              </td>

              <td className="p-4 text-gray-600">
                {lead.source}
              </td>

              <td className="p-4">
                {role === "admin" ? (
                  <button
                    onClick={() =>
                      handleDelete(
                        lead._id
                      )
                    }
                    className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                ) : (
                  <span className="text-sm text-gray-400">
                    No Actions
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeadsTable;