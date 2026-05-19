import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import API from "../api/axios";

import { useAuthStore } from "../store/auth.store";

function LoginPage() {
  const navigate = useNavigate();

  const { setAuth } =
    useAuthStore();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

 const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await API.post(
      "/auth/login",
      formData
    );

    console.log(response.data);

    const user =
      response.data.user ||
      response.data.data?.user;

    const token =
      response.data.token ||
      response.data.data?.token;

    if (!token) {
      toast.error("Token not found");
      return;
    }

    localStorage.setItem(
      "token",
      token
    );

    setAuth(user, token);

    toast.success(
      "Login successful"
    );

    navigate("/");
  } catch (error: any) {
    console.log(error);

    toast.error(
      error?.response?.data
        ?.message ||
        "Login failed"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={
              formData.password
            }
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 transition text-white py-3 rounded-lg font-medium"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Don&apos;t have an
          account?{" "}
          <Link
            to="/register"
            className="text-black font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;