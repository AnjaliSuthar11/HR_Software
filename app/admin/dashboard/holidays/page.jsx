"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function HolidayManagementPage() {

  const currentYear =
    new Date().getFullYear();


  const [year, setYear] =
    useState(currentYear);


  const [holidays, setHolidays] =
    useState([]);


  const [loading, setLoading] =
    useState(false);


  const [saving, setSaving] =
    useState(false);


  const [form, setForm] =
    useState({
      date: "",
      name: "",
      type: "Company Holiday",
      description: "",
      paid: true,
    });


  // ==================================================
  // LOAD HOLIDAYS
  // ==================================================

  const loadHolidays =
    async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(
            `/api/holiday?year=${year}`
          );

        setHolidays(
          response.data?.holidays ||
            []
        );

      } catch (error) {

        console.error(
          "Holiday loading error:",
          error
        );

        alert(
          error.response?.data?.message ||
            "Unable to load holidays"
        );

      } finally {

        setLoading(false);
      }
    };


  // ==================================================
  // YEAR CHANGE
  // ==================================================

  useEffect(() => {
    loadHolidays();
  }, [year]);


  // ==================================================
  // FORM CHANGE
  // ==================================================

  const handleChange =
    (e) => {

      const {
        name,
        value,
        type,
        checked,
      } = e.target;


      setForm(
        (previous) => ({
          ...previous,

          [name]:
            type ===
            "checkbox"
              ? checked
              : value,
        })
      );
    };


  // ==================================================
  // ADD HOLIDAY
  // ==================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      if (
        !form.date
      ) {
        alert(
          "Please select holiday date"
        );

        return;
      }


      if (
        !form.name.trim()
      ) {
        alert(
          "Please enter holiday name"
        );

        return;
      }


      try {

        setSaving(true);


        const response =
          await axios.post(
            "/api/holiday",
            {
              ...form,

              name:
                form.name.trim(),

              description:
                form.description.trim(),

              paid:
                Boolean(
                  form.paid
                ),
            }
          );


        alert(
          response.data.message
        );


        setForm({
          date: "",
          name: "",
          type: "Company Holiday",
          description: "",
          paid: true,
        });


        await loadHolidays();

      } catch (error) {

        console.error(
          "Holiday save error:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Unable to add holiday"
        );

      } finally {

        setSaving(false);
      }
    };


  // ==================================================
  // DELETE
  // ==================================================

  const deleteHoliday =
    async (id) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this holiday?"
        );


      if (!confirmed) {
        return;
      }


      try {

        const response =
          await axios.delete(
            `/api/holiday/${id}`
          );


        alert(
          response.data.message
        );


        await loadHolidays();

      } catch (error) {

        console.error(
          "Holiday delete error:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Unable to delete holiday"
        );
      }
    };


  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate =
    (date) => {

      if (!date) {
        return "-";
      }


      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    };


  // ==================================================
  // GET WEEKDAY
  // ==================================================

  const getWeekday =
    (date) => {

      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          weekday: "long",
        }
      );
    };


  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

          <div>

            <p className="text-sm font-semibold text-blue-600">
              HR MANAGEMENT
            </p>

            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              Holiday Calendar
            </h1>

            <p className="text-gray-500 mt-2">
              Manage national, festival and company holidays.
            </p>

          </div>


          {/* YEAR */}

          <div>

            <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
              Calendar Year
            </label>

            <input
              type="number"
              min="2000"
              max="2100"
              value={year}
              onChange={(e) =>
                setYear(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-32 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold outline-none focus:border-blue-500"
            />

          </div>

        </div>

      </div>


      {/* ==================================================
          INFO
      ================================================== */}

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 mb-8">

        <div className="flex gap-4">

          <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl">
            📅
          </div>

          <div>

            <h3 className="font-bold text-blue-900">
              How holidays work
            </h3>

            <p className="text-sm text-blue-700 mt-1">
              HR-managed holidays are paid holidays. Sundays are handled automatically by the payroll system. Employee birthdays are detected automatically from the employee's date of birth.
            </p>

          </div>

        </div>

      </div>


      {/* ==================================================
          ADD HOLIDAY
      ================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">

        <div className="mb-6">

          <h2 className="text-xl font-bold text-gray-900">
            Add Holiday
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Add a national, festival or company holiday.
          </p>

        </div>


        <form
          onSubmit={
            handleSubmit
          }
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
        >


          {/* DATE */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Holiday Date
            </label>

            <input
              type="date"
              name="date"
              value={
                form.date
              }
              onChange={
                handleChange
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* NAME */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Holiday Name
            </label>

            <input
              type="text"
              name="name"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              placeholder="Diwali"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* TYPE */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Holiday Type
            </label>

            <select
              name="type"
              value={
                form.type
              }
              onChange={
                handleChange
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >

              <option value="National Holiday">
                National Holiday
              </option>

              <option value="Festival">
                Festival
              </option>

              <option value="Company Holiday">
                Company Holiday
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>


          {/* DESCRIPTION */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>

            <input
              type="text"
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              placeholder="Festival holiday"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* PAID */}

          <div className="xl:col-span-4">

            <label className="inline-flex items-center gap-3 cursor-pointer">

              <input
                type="checkbox"
                name="paid"
                checked={
                  form.paid
                }
                onChange={
                  handleChange
                }
                className="h-5 w-5 rounded border-gray-300"
              />

              <span className="text-sm font-semibold text-gray-700">
                Paid Holiday
              </span>

            </label>

            <p className="text-xs text-gray-400 mt-1 ml-8">
              Paid holidays are not deducted from salary.
            </p>

          </div>


          {/* SUBMIT */}

          <div className="xl:col-span-4 flex justify-end">

            <button
              type="submit"
              disabled={
                saving
              }
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >

              {
                saving
                  ? "Saving..."
                  : "+ Add Holiday"
              }

            </button>

          </div>

        </form>

      </div>


      {/* ==================================================
          HOLIDAY LIST
      ================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* HEADER */}

        <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              {year} Holiday List
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {
                holidays.length
              }{" "}
              holiday
              {
                holidays.length !== 1
                  ? "s"
                  : ""
              }{" "}
              added by HR
            </p>

          </div>


          <button
            onClick={
              loadHolidays
            }
            disabled={
              loading
            }
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>


        {/* CONTENT */}

        {loading ? (

          <div className="p-12 text-center">

            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

            <p className="text-gray-500">
              Loading holidays...
            </p>

          </div>

        ) : holidays.length === 0 ? (

          <div className="p-14 text-center">

            <div className="text-5xl mb-4">
              📅
            </div>

            <h3 className="text-lg font-bold text-gray-800">
              No holidays added
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Add your first holiday using the form above.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Day
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Holiday
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Payment
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {holidays.map(
                  (holiday) => (

                    <tr
                      key={
                        holiday._id
                      }
                      className="hover:bg-gray-50"
                    >

                      {/* DATE */}

                      <td className="px-6 py-5 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {
                          formatDate(
                            holiday.date
                          )
                        }
                      </td>


                      {/* DAY */}

                      <td className="px-6 py-5 text-sm text-gray-600 whitespace-nowrap">
                        {
                          getWeekday(
                            holiday.date
                          )
                        }
                      </td>


                      {/* NAME */}

                      <td className="px-6 py-5">

                        <p className="font-semibold text-gray-900">
                          {
                            holiday.name
                          }
                        </p>

                        {holiday.description && (

                          <p className="text-xs text-gray-500 mt-1">
                            {
                              holiday.description
                            }
                          </p>

                        )}

                      </td>


                      {/* TYPE */}

                      <td className="px-6 py-5">

                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                          {
                            holiday.type
                          }
                        </span>

                      </td>


                      {/* PAYMENT */}

                      <td className="px-6 py-5">

                        {holiday.paid ? (

                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                            Paid Holiday
                          </span>

                        ) : (

                          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                            Unpaid
                          </span>

                        )}

                      </td>


                      {/* ACTION */}

                      <td className="px-6 py-5 text-right">

                        <button
                          onClick={() =>
                            deleteHoliday(
                              holiday._id
                            )
                          }
                          className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}