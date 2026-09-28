"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

export default function EditEmployee() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    employeeCode: "",
    employeeFullName: "",
    designation: "",
    employeeStatus: "Active",

    emailId: "",
    mobileNo: "",
    gender: "",
    joiningDate: "",

    fatherName: "",
    dateOfBirth: "",
    nationality: "",
    religion: "",
    maritalStatus: "",
    bloodGroup: "",
    healthProblem: "",

    address: "",
    permanentAddress: "",

    panCardNo: "",
    aadharCardNo: "",

    highestQualification: "",
    softwareKnowledge: "",

    bankDetails: {
      bankName: "",
      accountName: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
    },

    familyDetails: [],
    emergencyContacts: [],
    previousEmployment: [],
  });

  // ========================================
  // LOAD EMPLOYEE
  // ========================================

  useEffect(() => {
    if (id) {
      getEmployee();
    }
  }, [id]);

  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().split("T")[0];
  };

  const getEmployee = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/api/employee/${id}`
      );

      const employee = res.data.employee;

      setFormData({
        employeeCode:
          employee.employeeCode || "",

        employeeFullName:
          employee.employeeFullName || "",

        designation:
          employee.designation || "",

        employeeStatus:
          employee.employeeStatus || "Active",

        emailId:
          employee.emailId || "",

        mobileNo:
          employee.mobileNo || "",

        gender:
          employee.gender || "",

        joiningDate:
          formatDate(employee.joiningDate),

        fatherName:
          employee.fatherName || "",

        dateOfBirth:
          formatDate(employee.dateOfBirth),

        nationality:
          employee.nationality || "",

        religion:
          employee.religion || "",

        maritalStatus:
          employee.maritalStatus || "",

        bloodGroup:
          employee.bloodGroup || "",

        healthProblem:
          employee.healthProblem || "",

        address:
          employee.address || "",

        permanentAddress:
          employee.permanentAddress || "",

        panCardNo:
          employee.panCardNo || "",

        aadharCardNo:
          employee.aadharCardNo || "",

        highestQualification:
          employee.highestQualification || "",

        softwareKnowledge:
          Array.isArray(
            employee.softwareKnowledge
          )
            ? employee.softwareKnowledge.join(", ")
            : employee.softwareKnowledge || "",

        bankDetails: {
          bankName:
            employee.bankDetails?.bankName || "",

          accountName:
            employee.bankDetails?.accountName || "",

          accountNumber:
            employee.bankDetails?.accountNumber || "",

          ifscCode:
            employee.bankDetails?.ifscCode || "",

          branch:
            employee.bankDetails?.branch || "",
        },

        familyDetails:
          Array.isArray(employee.familyDetails)
            ? employee.familyDetails
            : [],

        emergencyContacts:
          Array.isArray(employee.emergencyContacts)
            ? employee.emergencyContacts
            : [],

        previousEmployment:
          Array.isArray(employee.previousEmployment)
            ? employee.previousEmployment
            : [],
      });
    } catch (error) {
      console.error(
        "GET EMPLOYEE ERROR:",
        error
      );

      setError(
        "Failed to load employee."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // NORMAL INPUT
  // ========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // BANK
  // ========================================

  const handleBankChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,

      bankDetails: {
        ...prev.bankDetails,
        [name]: value,
      },
    }));
  };

  // ========================================
  // FAMILY
  // ========================================

  const addFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,

      familyDetails: [
        ...prev.familyDetails,
        {
          name: "",
          relationship: "",
          contactNo: "",
          occupation: "",
        },
      ],
    }));
  };

  const updateFamilyMember = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => {
      const updated = [...prev.familyDetails];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        familyDetails: updated,
      };
    });
  };

  const removeFamilyMember = (index) => {
    setFormData((prev) => ({
      ...prev,

      familyDetails:
        prev.familyDetails.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // ========================================
  // EMERGENCY CONTACT
  // ========================================

  const addEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,

      emergencyContacts: [
        ...prev.emergencyContacts,
        {
          name: "",
          relationship: "",
          contactNo: "",
        },
      ],
    }));
  };

  const updateEmergencyContact = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => {
      const updated = [
        ...prev.emergencyContacts,
      ];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        emergencyContacts: updated,
      };
    });
  };

  const removeEmergencyContact = (index) => {
    setFormData((prev) => ({
      ...prev,

      emergencyContacts:
        prev.emergencyContacts.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // ========================================
  // PREVIOUS EMPLOYMENT
  // ========================================

  const addPreviousEmployment = () => {
    setFormData((prev) => ({
      ...prev,

      previousEmployment: [
        ...prev.previousEmployment,
        {
          companyName: "",
          place: "",
          joinDate: "",
          leftDate: "",
          designation: "",
          annualSalary: "",
          reasonForLeaving: "",
        },
      ],
    }));
  };

  const updatePreviousEmployment = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => {
      const updated = [
        ...prev.previousEmployment,
      ];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        previousEmployment: updated,
      };
    });
  };

  const removePreviousEmployment = (index) => {
    setFormData((prev) => ({
      ...prev,

      previousEmployment:
        prev.previousEmployment.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // ========================================
  // SAVE
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        employeeCode:
          formData.employeeCode.trim(),

        employeeFullName:
          formData.employeeFullName.trim(),

        designation:
          formData.designation.trim(),

        employeeStatus:
          formData.employeeStatus,

        emailId:
          formData.emailId.trim(),

        mobileNo:
          formData.mobileNo.trim(),

        gender:
          formData.gender || "",

        joiningDate:
          formData.joiningDate || null,

        fatherName:
          formData.fatherName.trim(),

        dateOfBirth:
          formData.dateOfBirth || null,

        nationality:
          formData.nationality.trim(),

        religion:
          formData.religion.trim(),

        maritalStatus:
          formData.maritalStatus || "",

        bloodGroup:
          formData.bloodGroup || "",

        healthProblem:
          formData.healthProblem.trim(),

        address:
          formData.address.trim(),

        permanentAddress:
          formData.permanentAddress.trim(),

        panCardNo:
          formData.panCardNo.trim(),

        aadharCardNo:
          formData.aadharCardNo.trim(),

        highestQualification:
          formData.highestQualification.trim(),

        softwareKnowledge:
          formData.softwareKnowledge
            ? formData.softwareKnowledge
                .split(",")
                .map((item) =>
                  item.trim()
                )
                .filter(Boolean)
            : [],

        bankDetails:
          formData.bankDetails,

        familyDetails:
          formData.familyDetails.filter(
            (item) =>
              item.name ||
              item.relationship ||
              item.contactNo ||
              item.occupation
          ),

        emergencyContacts:
          formData.emergencyContacts.filter(
            (item) =>
              item.name ||
              item.relationship ||
              item.contactNo
          ),

        previousEmployment:
          formData.previousEmployment.filter(
            (item) =>
              item.companyName ||
              item.place ||
              item.joinDate ||
              item.leftDate ||
              item.designation ||
              item.annualSalary ||
              item.reasonForLeaving
          ),
      };

      await axios.put(
        `/api/employee/${id}`,
        payload
      );

      alert(
        "Employee updated successfully."
      );

      router.push(
        `/dashboard/employees/${id}`
      );
    } catch (error) {
      console.error(
        "UPDATE EMPLOYEE ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to update employee."
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold">
          Loading Employee...
        </p>
      </div>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <div className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-8 py-6">

          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="flex items-center gap-2 text-blue-600 hover:underline mb-3"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Edit Employee
          </h1>

          <p className="text-gray-500 mt-1">
            Edit employee information
          </p>

        </div>

      </div>

      <div className="max-w-7xl mx-auto p-8">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ========================================
              BASIC EMPLOYEE INFORMATION
          ======================================== */}

          <section className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="border-b px-8 py-6">

              <h2 className="text-2xl font-bold text-gray-800">
                Employee Information
              </h2>

              <p className="text-gray-500 mt-1">
                Basic employee and employment information.
              </p>

            </div>

            <div className="p-8 grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              <Input
                label="Employee Code"
                name="employeeCode"
                value={formData.employeeCode}
                onChange={handleChange}
              />

              <Input
                label="Full Name"
                name="employeeFullName"
                value={formData.employeeFullName}
                onChange={handleChange}
              />

              <Input
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />

              <Select
                label="Employee Status"
                name="employeeStatus"
                value={formData.employeeStatus}
                onChange={handleChange}
                options={[
                  "Active",
                  "Inactive",
                  "Resigned",
                  "Terminated",
                ]}
              />

              <Input
                label="Email"
                name="emailId"
                type="email"
                value={formData.emailId}
                onChange={handleChange}
              />

              <Input
                label="Mobile"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
              />

              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  "Male",
                  "Female",
                  "Other",
                ]}
              />

              <Input
                label="Joining Date"
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />

            </div>

          </section>

          {/* ========================================
              PERSONAL INFORMATION
          ======================================== */}

          <section className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="border-b px-8 py-6">

              <h2 className="text-2xl font-bold text-gray-800">
                Personal Information
              </h2>

              <p className="text-gray-500 mt-1">
                Basic employee profile and personal details.
              </p>

            </div>

            <div className="p-8 grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              <Input
                label="Father Name"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
              />

              <Input
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />

              <Input
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              />

              <Input
                label="Religion"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
              />

              <Select
                label="Marital Status"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                options={[
                  "Single",
                  "Married",
                  "Divorced",
                  "Widowed",
                  "Other",
                ]}
              />

              <Select
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                options={[
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "AB+",
                  "AB-",
                  "O+",
                  "O-",
                ]}
              />

              <Input
                label="Health Problem"
                name="healthProblem"
                value={formData.healthProblem}
                onChange={handleChange}
              />

            </div>

          </section>

          {/* ========================================
              ADDRESS
          ======================================== */}

          <section className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="border-b px-8 py-6">

              <h2 className="text-2xl font-bold text-gray-800">
                Address Information
              </h2>

              <p className="text-gray-500 mt-1">
                Current and permanent address details.
              </p>

            </div>

            <div className="p-8 grid md:grid-cols-2 gap-6">

              <Textarea
                label="Current Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />

              <Textarea
                label="Permanent Address"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
              />

            </div>

          </section>

          {/* ========================================
              IDENTITY
          ======================================== */}

          <section className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="border-b px-8 py-6">

              <h2 className="text-2xl font-bold text-gray-800">
                Identity Details
              </h2>

              <p className="text-gray-500 mt-1">
                Government-issued identity information.
              </p>

            </div>

            <div className="p-8 grid md:grid-cols-2 gap-6">

              <Input
                label="PAN Card Number"
                name="panCardNo"
                value={formData.panCardNo}
                onChange={handleChange}
              />

              <Input
                label="Aadhar Card Number"
                name="aadharCardNo"
                value={formData.aadharCardNo}
                onChange={handleChange}
              />

            </div>

          </section>

          {/* ========================================
              EDUCATION
          ======================================== */}

          <section className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="border-b px-8 py-6">

              <h2 className="text-2xl font-bold text-gray-800">
                Education & Skills
              </h2>

              <p className="text-gray-500 mt-1">
                Academic qualification and technical expertise.
              </p>

            </div>

            <div className="p-8 grid md:grid-cols-2 gap-6">

              <Input
                label="Highest Qualification"
                name="highestQualification"
                value={
                  formData.highestQualification
                }
                onChange={handleChange}
              />

              <Textarea
                label="Software Knowledge"
                name="softwareKnowledge"
                value={
                  formData.softwareKnowledge
                }
                onChange={handleChange}
              />

            </div>

          </section>

          {/* ========================================
              BANK DETAILS
          ======================================== */}

          <section className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="border-b px-8 py-6">

              <h2 className="text-2xl font-bold text-gray-800">
                Bank Details
              </h2>

              <p className="text-gray-500 mt-1">
                Banking information for salary and payroll processing.
              </p>

            </div>

            <div className="p-8 grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              <Input
                label="Bank Name"
                name="bankName"
                value={
                  formData.bankDetails.bankName
                }
                onChange={handleBankChange}
              />

              <Input
                label="Account Holder"
                name="accountName"
                value={
                  formData.bankDetails.accountName
                }
                onChange={handleBankChange}
              />

              <Input
                label="Account Number"
                name="accountNumber"
                value={
                  formData.bankDetails.accountNumber
                }
                onChange={handleBankChange}
              />

              <Input
                label="IFSC Code"
                name="ifscCode"
                value={
                  formData.bankDetails.ifscCode
                }
                onChange={handleBankChange}
              />

              <Input
                label="Branch"
                name="branch"
                value={
                  formData.bankDetails.branch
                }
                onChange={handleBankChange}
              />

            </div>

          </section>

          {/* ========================================
              FAMILY DETAILS
          ======================================== */}

          <section className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="border-b px-8 py-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Family Details
                </h2>

                <p className="text-gray-500 mt-1">
                  Family members and their relationship.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  addFamilyMember
                }
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                <Plus size={17} />
                Add Member
              </button>

            </div>

            <div className="p-8 space-y-6">

              {formData.familyDetails.length ===
                0 ? (
                <p className="text-gray-500">
                  No Family Details Found
                </p>
              ) : (
                formData.familyDetails.map(
                  (member, index) => (
                    <div
                      key={index}
                      className="border rounded-2xl p-6"
                    >

                      <div className="flex items-center justify-between mb-5">

                        <h3 className="text-lg font-semibold">
                          Family Member #
                          {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            removeFamilyMember(
                              index
                            )
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2
                            size={18}
                          />
                        </button>

                      </div>

                      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

                        <Input
                          label="Name"
                          value={
                            member.name
                          }
                          onChange={(e) =>
                            updateFamilyMember(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          label="Relationship"
                          value={
                            member.relationship
                          }
                          onChange={(e) =>
                            updateFamilyMember(
                              index,
                              "relationship",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          label="Contact Number"
                          value={
                            member.contactNo
                          }
                          onChange={(e) =>
                            updateFamilyMember(
                              index,
                              "contactNo",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          label="Occupation"
                          value={
                            member.occupation
                          }
                          onChange={(e) =>
                            updateFamilyMember(
                              index,
                              "occupation",
                              e.target.value
                            )
                          }
                        />

                      </div>

                    </div>
                  )
                )
              )}

            </div>

          </section>

          {/* ========================================
              EMERGENCY CONTACTS
          ======================================== */}

          <section className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="border-b px-8 py-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Emergency Contacts
                </h2>

                <p className="text-gray-500 mt-1">
                  Emergency contact persons for the employee.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  addEmergencyContact
                }
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                <Plus size={17} />
                Add Contact
              </button>

            </div>

            <div className="p-8 space-y-6">

              {formData.emergencyContacts.length ===
                0 ? (
                <p className="text-gray-500">
                  No Emergency Contacts Added
                </p>
              ) : (
                formData.emergencyContacts.map(
                  (contact, index) => (
                    <div
                      key={index}
                      className="border rounded-2xl p-6"
                    >

                      <div className="flex items-center justify-between mb-5">

                        <h3 className="text-lg font-semibold">
                          Emergency Contact #
                          {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            removeEmergencyContact(
                              index
                            )
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2
                            size={18}
                          />
                        </button>

                      </div>

                      <div className="grid md:grid-cols-3 gap-5">

                        <Input
                          label="Name"
                          value={
                            contact.name
                          }
                          onChange={(e) =>
                            updateEmergencyContact(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          label="Relationship"
                          value={
                            contact.relationship
                          }
                          onChange={(e) =>
                            updateEmergencyContact(
                              index,
                              "relationship",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          label="Contact Number"
                          value={
                            contact.contactNo
                          }
                          onChange={(e) =>
                            updateEmergencyContact(
                              index,
                              "contactNo",
                              e.target.value
                            )
                          }
                        />

                      </div>

                    </div>
                  )
                )
              )}

            </div>

          </section>

          {/* ========================================
              PREVIOUS EMPLOYMENT
          ======================================== */}

          <section className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="border-b px-8 py-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Previous Employment
                </h2>

                <p className="text-gray-500 mt-1">
                  Employment history and professional experience.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  addPreviousEmployment
                }
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                <Plus size={17} />
                Add Employment
              </button>

            </div>

            <div className="p-8 space-y-6">

              {formData.previousEmployment.length ===
                0 ? (
                <p className="text-gray-500">
                  No Previous Employment Found
                </p>
              ) : (
                formData.previousEmployment.map(
                  (job, index) => (
                    <div
                      key={index}
                      className="border rounded-2xl p-6"
                    >

                      <div className="flex items-center justify-between mb-5">

                        <h3 className="text-lg font-semibold">
                          Employment #
                          {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            removePreviousEmployment(
                              index
                            )
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2
                            size={18}
                          />
                        </button>

                      </div>

                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                        <Input
                          label="Company Name"
                          value={
                            job.companyName
                          }
                          onChange={(e) =>
                            updatePreviousEmployment(
                              index,
                              "companyName",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          label="Designation"
                          value={
                            job.designation
                          }
                          onChange={(e) =>
                            updatePreviousEmployment(
                              index,
                              "designation",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          label="Place"
                          value={
                            job.place
                          }
                          onChange={(e) =>
                            updatePreviousEmployment(
                              index,
                              "place",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          label="Annual Salary"
                          value={
                            job.annualSalary
                          }
                          onChange={(e) =>
                            updatePreviousEmployment(
                              index,
                              "annualSalary",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          label="Joining Date"
                          type="date"
                          value={formatDate(
                            job.joinDate
                          )}
                          onChange={(e) =>
                            updatePreviousEmployment(
                              index,
                              "joinDate",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          label="Leaving Date"
                          type="date"
                          value={formatDate(
                            job.leftDate
                          )}
                          onChange={(e) =>
                            updatePreviousEmployment(
                              index,
                              "leftDate",
                              e.target.value
                            )
                          }
                        />

                      </div>

                      <div className="mt-5">

                        <Textarea
                          label="Reason For Leaving"
                          value={
                            job.reasonForLeaving
                          }
                          onChange={(e) =>
                            updatePreviousEmployment(
                              index,
                              "reasonForLeaving",
                              e.target.value
                            )
                          }
                        />

                      </div>

                    </div>
                  )
                )
              )}

            </div>

          </section>

          {/* ========================================
              SAVE
          ======================================== */}

          <div className="bg-white rounded-2xl border p-6 flex items-center justify-between">

            <button
              type="button"
              onClick={() =>
                router.back()
              }
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              <Save size={18} />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}


// ========================================
// INPUT
// ========================================

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
      />

    </div>
  );
}


// ========================================
// SELECT
// ========================================

function Select({
  label,
  name,
  value,
  onChange,
  options = [],
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
      >

        <option value="">
          Select {label}
        </option>

        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}

      </select>

    </div>
  );
}


// ========================================
// TEXTAREA
// ========================================

function Textarea({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        rows={4}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 resize-none"
      />

    </div>
  );
}