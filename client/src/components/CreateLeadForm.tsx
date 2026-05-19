import { useState } from "react";

import toast from "react-hot-toast";

import API from "../api/axios";

interface Props {
  fetchLeads: () => void;
}

function CreateLeadForm({
  fetchLeads,
}: Props) {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      status: "New",
      source: "Website",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post(
        "/leads",
        formData
      );

      toast.success(
        "Lead created successfully"
      );

      setFormData({
        name: "",
        email: "",
        status: "New",
        source: "Website",
      });

      fetchLeads();
    } catch (error) {
      toast.error(
        "Failed to create lead"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid md:grid-cols-5 gap-4"
    >
      <input
        type="text"
        name="name"
        placeholder="Enter name"
        value={formData.name}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />

      <input
        type="email"
        name="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      >
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
        name="source"
        value={formData.source}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      >
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

      <button
        type="submit"
        disabled={loading}
        className="bg-black hover:bg-gray-800 transition text-white rounded-lg font-medium"
      >
        {loading
          ? "Creating..."
          : "Create Lead"}
      </button>
    </form>
  );
}

export default CreateLeadForm;