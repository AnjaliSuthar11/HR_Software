"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function CreateEmployeeLogin() {
  const { id } = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState(null);

  const [form, setForm] = useState({
    companyLoginEmail: "",
    companyLoginPassword: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const res = await axios.get(`/api/employee/${id}`);

        if (res.data.success) {
          setEmployee(res.data.employee);

          setForm({
            companyLoginEmail:
              res.data.employee.companyLoginEmail || "",
            companyLoginPassword: "",
          });
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load employee");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEmployee();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `/api/employee/${id}/login`,
        form
      );

      if (res.data.success) {
        alert("Employee login created successfully");

        router.push("/dashboard/employees");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create employee login"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading employee...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-8">
        Employee not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">

      <div className="bg-white rounded-3xl shadow-lg border p-8">

        <h1 className="text-3xl font-bold mb-2">
          Employee Login
        </h1>

        <p className="text-gray-500 mb-8">
          Create login credentials for the employee.
        </p>

        {/* Employee Information */}

        <div className="bg-gray-50 rounded-2xl p-5 mb-8">

          <h2 className="font-bold text-lg mb-4">
            Employee Information
          </h2>

          <p>
            <strong>Name:</strong>{" "}
            {employee.employeeFullName}
          </p>

          <p>
            <strong>Employee Code:</strong>{" "}
            {employee.employeeCode}
          </p>

          <p>
            <strong>Personal Email:</strong>{" "}
            {employee.emailId || "Not Provided"}
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Company Login Email */}

          <div>

            <label className="block font-semibold mb-2">
              Company Login Email
            </label>

            <input
              type="email"
              name="companyLoginEmail"
              value={form.companyLoginEmail}
              onChange={handleChange}
              placeholder="employee@company.com"
              required
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Password */}

          <div>

            <label className="block font-semibold mb-2">
              Company Login Password
            </label>

            <input
              type="password"
              name="companyLoginPassword"
              value={form.companyLoginPassword}
              onChange={handleChange}
              placeholder="Enter password"
              required
              minLength={6}
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div className="flex gap-4">

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/employees")
              }
              className="px-6 py-3 rounded-xl border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Create Login
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}