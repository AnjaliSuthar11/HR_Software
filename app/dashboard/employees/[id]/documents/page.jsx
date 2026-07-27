"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

export default function EmployeeDocumentsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [files, setFiles] = useState({
    employeePhoto: null,
    panCardDocument: null,
    aadharCardDocument: null,
    highestEducationDocument: null,
    experienceLetter: null,
    salarySlip: null,
  });

  useEffect(() => {
    getEmployee();
  }, []);

  const getEmployee = async () => {
    try {
      const res = await axios.get(`/api/employee/${id}`);
      setEmployee(res.data.employee);
    } catch (error) {
      console.log(error);
      alert("Failed to load employee.");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleUpload = async () => {
    try {
      setUploading(true);

      const data = new FormData();

      data.append("employeeId", id);

      Object.keys(files).forEach((key) => {
        if (files[key]) {
          data.append(key, files[key]);
        }
      });

      const res = await axios.post(
        "/api/employee/upload-documents",
        data
      );

      alert(res.data.message);

      getEmployee();
    } catch (err) {
      console.log(err);
      alert("Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex justify-center items-center h-screen">
        Employee Not Found
      </div>
    );
  }
// console.log(employee);
  const documents = [
    {
      label: "Employee Photo",
      field: "employeePhoto",
      value: employee.employeePhoto,
    },
    {
      label: "PAN Card",
      field: "panCardDocument",
      value: employee.panCardDocument,
    },
    {
      label: "Aadhar Card",
      field: "aadharCardDocument",
      value: employee.aadharCardDocument,
    },
    {
      label: "Highest Qualification",
      field: "highestEducationDocument",
      value: employee.highestEducationDocument,
    },
    {
      label: "Experience Letter",
      field: "experienceLetter",
      value: employee.experienceLetter,
    },
    {
      label: "Salary Slip",
      field: "salarySlip",
      value: employee.salarySlip,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Employee Documents
          </h1>

          <p className="text-gray-500">
            Upload and Manage Employee Documents
          </p>

        </div>

        <button
          onClick={() => router.back()}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          Back
        </button>

      </div>

      {/* Employee Card */}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

        <div className="flex gap-6">

          <div className="w-36 h-36 rounded-full overflow-hidden border">

            {employee.employeePhoto ? (
              <Image
                src={employee.employeePhoto}
                width={140}
                height={140}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex justify-center items-center text-5xl">
                👤
              </div>
            )}

          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-3">

            <div>
              <span className="font-semibold">
                Employee Code :
              </span>{" "}
              {employee.employeeCode}
            </div>

            <div>
              <span className="font-semibold">
                Name :
              </span>{" "}
              {employee.employeeFullName}
            </div>

            <div>
              <span className="font-semibold">
                Mobile :
              </span>{" "}
              {employee.mobileNo}
            </div>

            <div>
              <span className="font-semibold">
                Email :
              </span>{" "}
              {employee.emailId}
            </div>

            <div>
              <span className="font-semibold">
                Gender :
              </span>{" "}
              {employee.gender}
            </div>

            <div>
              <span className="font-semibold">
                DOB :
              </span>{" "}
              {employee.dateOfBirth
                ? new Date(
                    employee.dateOfBirth
                  ).toLocaleDateString()
                : "-"}

            </div>

            <div>
              <span className="font-semibold">
                Qualification :
              </span>{" "}
              {employee.highestQualification}
            </div>

            <div>
              <span className="font-semibold">
                Status :
              </span>{" "}
              <span className="text-green-600 font-semibold">
                {employee.employeeStatus}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Documents */}

      <div className="bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-6">
          Upload Documents
        </h2>

        <div className="space-y-6">

          {documents.map((doc) => (

            <div
              key={doc.field}
              className="border rounded-lg p-5 flex justify-between items-center"
            >

              <div>

                <h3 className="font-semibold text-lg">
                  {doc.label}
                </h3>

                {doc.value ? (
                  <a
                    href={doc.value}
                    target="_blank"
                    className="text-green-600 underline"
                  >
                    View Uploaded Document
                  </a>
                ) : (
                  <p className="text-red-500">
                    Not Uploaded
                  </p>
                )}

              </div>

              <div>

                <input
                  type="file"
                  name={doc.field}
                  onChange={handleFile}
                  className="border p-2 rounded"
                />

              </div>

            </div>

          ))}

        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
        >
          {uploading
            ? "Uploading..."
            : "Upload Documents"}
        </button>

      </div>

    </div>
  );
}