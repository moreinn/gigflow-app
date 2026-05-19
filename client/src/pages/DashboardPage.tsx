import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";

import { useAuthStore } from "../store/auth.store";

import LeadsTable from "../components/LeadsTable";

import CreateLeadForm from "../components/CreateLeadForm";

import useDebounce from "../hooks/useDebounce";

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
}

function DashboardPage() {
  const navigate = useNavigate();

  const { user, logout } =
    useAuthStore();

  const [leads, setLeads] = useState<
    Lead[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [source, setSource] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const debouncedSearch =
    useDebounce(search, 500);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        `/leads?search=${debouncedSearch}&status=${status}&source=${source}&page=${page}`
      );

      setLeads(response.data.data);

      setTotalPages(
        response.data.pagination.totalPages
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [
    debouncedSearch,
    status,
    source,
    page,
  ]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  useEffect(() => {
    setPage(1);
  }, [source]);

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  const handleCSVExport = () => {
    window.open(
      "http://localhost:5000/api/leads/export/csv",
      "_blank"
    );
  };

  const qualifiedLeads = leads.filter(
    (lead) =>
      lead.status === "Qualified"
  ).length;

  const lostLeads = leads.filter(
    (lead) => lead.status === "Lost"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-black text-white px-8 py-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold">
              Smart Leads Dashboard
            </h1>

            <p className="text-gray-300 mt-2">
              Welcome back,{" "}
              {user?.name}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCSVExport}
              className="bg-green-500 hover:bg-green-600 transition duration-200 active:scale-95 px-5 py-3 rounded-xl font-medium"
            >
              Export CSV
            </button>

            <button
              onClick={handleLogout}
              className="bg-white text-black hover:bg-gray-200 transition duration-200 active:scale-95 px-5 py-3 rounded-xl font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition duration-300">
            <p className="text-gray-500 text-sm">
              Total Leads
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {leads.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition duration-300">
            <p className="text-gray-500 text-sm">
              Qualified Leads
            </p>

            <h2 className="text-4xl font-bold mt-3 text-green-600">
              {qualifiedLeads}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition duration-300">
            <p className="text-gray-500 text-sm">
              Lost Leads
            </p>

            <h2 className="text-4xl font-bold mt-3 text-red-500">
              {lostLeads}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Create Lead
          </h2>

          <CreateLeadForm
            fetchLeads={fetchLeads}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="flex-1 border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">
                All Status
              </option>

              <option value="New">
                New
              </option>

              <option value="Contacted">
                Contacted
              </option>

              <option value="Qualified">
                Qualified
              </option>

              <option value="Lost">
                Lost
              </option>
            </select>

            <select
              value={source}
              onChange={(e) =>
                setSource(e.target.value)
              }
              className="border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">
                All Sources
              </option>

              <option value="Website">
                Website
              </option>

              <option value="Instagram">
                Instagram
              </option>

              <option value="Referral">
                Referral
              </option>
            </select>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="w-14 h-14 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>

              <p className="mt-6 text-lg font-medium">
                Loading leads...
              </p>
            </div>
          ) : leads.length === 0 ? (
            <div className="py-24 text-center">
              <div className="text-6xl mb-4">
                📭
              </div>

              <h3 className="text-2xl font-bold text-gray-700">
                No Leads Found
              </h3>

              <p className="text-gray-500 mt-2">
                Try changing filters or
                create a new lead.
              </p>
            </div>
          ) : (
            <>
              <LeadsTable
                leads={leads}
                fetchLeads={fetchLeads}
                role={user?.role}
              />

              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() =>
                    setPage(
                      (prev) => prev - 1
                    )
                  }
                  className="bg-black text-white px-6 py-3 rounded-xl disabled:opacity-50"
                >
                  Previous
                </button>

                <div className="bg-gray-100 px-6 py-3 rounded-xl font-medium">
                  Page {page} of{" "}
                  {totalPages}
                </div>

                <button
                  disabled={
                    page === totalPages
                  }
                  onClick={() =>
                    setPage(
                      (prev) => prev + 1
                    )
                  }
                  className="bg-black text-white px-6 py-3 rounded-xl disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;