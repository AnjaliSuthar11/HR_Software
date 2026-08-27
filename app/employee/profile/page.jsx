"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeProfilePage() {
  const router = useRouter();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================================================
  // LOAD EMPLOYEE
  // ==================================================

  useEffect(() => {
    const loggedIn =
      localStorage.getItem(
        "employeeLoggedIn"
      );

    const employeeData =
      localStorage.getItem(
        "employeeData"
      );

    if (
      loggedIn !== "true" ||
      !employeeData
    ) {
      router.replace(
        "/employee/login"
      );
      return;
    }

    try {
      setEmployee(
        JSON.parse(employeeData)
      );
    } catch (error) {
      console.error(
        "Employee data error:",
        error
      );

      localStorage.removeItem(
        "employeeLoggedIn"
      );

      localStorage.removeItem(
        "employeeId"
      );

      localStorage.removeItem(
        "employeeData"
      );

      router.replace(
        "/employee/login"
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ==================================================
  // LOGOUT
  // ==================================================

  const logout = () => {
    localStorage.removeItem(
      "employeeLoggedIn"
    );

    localStorage.removeItem(
      "employeeId"
    );

    localStorage.removeItem(
      "employeeData"
    );

    router.replace(
      "/employee/login"
    );
  };

  // ==================================================
  // DATE FORMAT
  // ==================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not provided";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Not provided";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==================================================
  // CURRENCY
  // ==================================================

  const formatCurrency = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "Not provided";
    }

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(value);
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (
    loading ||
    !employee
  ) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading profile...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 bg-white border-r border-gray-200 lg:flex lg:flex-col">

        {/* LOGO */}

        <div className="px-6 py-6 border-b border-gray-100">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              E
            </div>

            <div>

              <h1 className="font-bold text-gray-900">
                Employee
              </h1>

              <p className="text-xs text-gray-400">
                Portal
              </p>

            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 p-4">

          <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <div className="space-y-2">

            <SidebarButton
              icon="🏠"
              label="Dashboard"
              onClick={() =>
                router.push(
                  "/employee/dashboard"
                )
              }
            />

            <SidebarButton
              icon="👤"
              label="My Profile"
              active
            />

            <SidebarButton
              icon="📝"
              label="Leave"
              onClick={() =>
                router.push(
                  "/employee/leave"
                )
              }
            />

            <SidebarButton
              icon="📅"
              label="Attendance"
              onClick={() =>
                router.push(
                  "/employee/attendance"
                )
              }
            />

          </div>

        </nav>

        {/* LOGOUT */}

        <div className="p-4 border-t border-gray-100">

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 text-sm font-semibold transition"
          >
            <span>
              🚪
            </span>

            Logout

          </button>

        </div>

      </aside>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="lg:ml-64">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="sticky top-0 z-20 h-20 bg-white/95 backdrop-blur border-b border-gray-200 px-6 lg:px-8 flex items-center justify-between">

          <div>

            <h1 className="text-xl font-bold text-gray-900">
              My Profile
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Complete employee information
            </p>

          </div>

          <button
            onClick={() =>
              router.push(
                "/employee/dashboard"
              )
            }
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            ← Dashboard
          </button>

        </header>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">

          {/* ==================================================
              PROFILE HEADER
          ================================================== */}

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-xl mb-8">

            <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10" />

            <div className="absolute -bottom-24 right-32 h-64 w-64 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">

              {/* PHOTO */}

              {employee.employeePhoto ? (

                <img
                  src={employee.employeePhoto}
                  alt={
                    employee.employeeFullName
                  }
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                />

              ) : (

                <div className="w-28 h-28 rounded-2xl bg-white/15 flex items-center justify-center text-5xl font-bold border border-white/20">
                  {employee.employeeFullName
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

              )}

              {/* NAME */}

              <div className="flex-1">

                <p className="text-blue-100 text-sm font-medium">
                  Employee Profile
                </p>

                <h2 className="text-3xl lg:text-4xl font-bold mt-1">
                  {
                    employee.employeeFullName
                  }
                </h2>

                <p className="text-blue-100 mt-2">
                  Employee Code:{" "}
                  <span className="font-semibold text-white">
                    {
                      employee.employeeCode
                    }
                  </span>
                </p>

                <div className="flex flex-wrap gap-3 mt-4">

                  <span className="px-3 py-1.5 rounded-full bg-white/15 text-sm">
                    Status:{" "}
                    {
                      employee.employeeStatus ||
                      "Not provided"
                    }
                  </span>

                  {employee.gender && (
                    <span className="px-3 py-1.5 rounded-full bg-white/15 text-sm">
                      {employee.gender}
                    </span>
                  )}

                  {employee.joiningDate && (
                    <span className="px-3 py-1.5 rounded-full bg-white/15 text-sm">
                      Joined{" "}
                      {formatDate(
                        employee.joiningDate
                      )}
                    </span>
                  )}

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
              PERSONAL INFORMATION
          ================================================== */}

          <ProfileSection
            title="Personal Information"
            description="Basic personal details of the employee"
            icon="👤"
          >

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

              <InfoItem
                label="Employee Code"
                value={
                  employee.employeeCode
                }
              />

              <InfoItem
                label="Full Name"
                value={
                  employee.employeeFullName
                }
              />

              <InfoItem
                label="Father Name"
                value={
                  employee.fatherName
                }
              />

              <InfoItem
                label="Gender"
                value={
                  employee.gender
                }
              />

              <InfoItem
                label="Marital Status"
                value={
                  employee.maritalStatus
                }
              />

              <InfoItem
                label="Date of Birth"
                value={formatDate(
                  employee.dateOfBirth
                )}
              />

              <InfoItem
                label="Nationality"
                value={
                  employee.nationality
                }
              />

              <InfoItem
                label="Religion"
                value={
                  employee.religion
                }
              />

              <InfoItem
                label="Blood Group"
                value={
                  employee.bloodGroup
                }
              />

            </div>

          </ProfileSection>

          {/* ==================================================
              CONTACT INFORMATION
          ================================================== */}

          <ProfileSection
            title="Contact Information"
            description="Personal and company contact details"
            icon="📞"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              <InfoItem
                label="Mobile Number"
                value={
                  employee.mobileNo
                }
              />

              <InfoItem
                label="Personal Email"
                value={
                  employee.emailId
                }
              />

              <InfoItem
                label="Company Login Email"
                value={
                  employee.companyLoginEmail
                }
              />

            </div>

          </ProfileSection>

          {/* ==================================================
              ADDRESS DETAILS
          ================================================== */}

          <ProfileSection
            title="Address Details"
            description="Current and permanent residential addresses"
            icon="📍"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <InfoItem
                label="Current Address"
                value={
                  employee.address
                }
              />

              <InfoItem
                label="Permanent Address"
                value={
                  employee.permanentAddress
                }
              />

            </div>

          </ProfileSection>

          {/* ==================================================
              IDENTITY DETAILS
          ================================================== */}

          <ProfileSection
            title="Identity Details"
            description="Government identification information"
            icon="🪪"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              <InfoItem
                label="PAN Card Number"
                value={
                  employee.panCardNo
                }
              />

              <InfoItem
                label="Aadhar Card Number"
                value={
                  employee.aadharCardNo
                }
              />

            </div>

          </ProfileSection>

          {/* ==================================================
              PROFESSIONAL INFORMATION
          ================================================== */}

          <ProfileSection
            title="Professional Information"
            description="Education, skills and employment details"
            icon="💼"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              <InfoItem
                label="Highest Qualification"
                value={
                  employee.highestQualification
                }
              />

              <InfoItem
                label="Joining Date"
                value={formatDate(
                  employee.joiningDate
                )}
              />

              <InfoItem
                label="Employee Status"
                value={
                  employee.employeeStatus
                }
              />

            </div>

            {/* SOFTWARE */}

            <div className="mt-6">

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Software Knowledge
              </p>

              {employee.softwareKnowledge?.length >
              0 ? (

                <div className="flex flex-wrap gap-2">

                  {employee.softwareKnowledge.map(
                    (
                      software,
                      index
                    ) => (

                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium"
                      >
                        {software}
                      </span>

                    )
                  )}

                </div>

              ) : (

                <p className="text-sm text-gray-400">
                  No software skills provided
                </p>

              )}

            </div>

          </ProfileSection>

          {/* ==================================================
              HEALTH INFORMATION
          ================================================== */}

          <ProfileSection
            title="Health Information"
            description="Employee health-related information"
            icon="🩺"
          >

            <InfoItem
              label="Health Problem"
              value={
                employee.healthProblem
              }
            />

          </ProfileSection>

          {/* ==================================================
              BANK DETAILS
          ================================================== */}

          <ProfileSection
            title="Bank Details"
            description="Registered bank account information"
            icon="🏦"
          >

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

              <InfoItem
                label="Bank Name"
                value={
                  employee.bankDetails
                    ?.bankName
                }
              />

              <InfoItem
                label="Account Name"
                value={
                  employee.bankDetails
                    ?.accountName
                }
              />

              <InfoItem
                label="Account Number"
                value={
                  employee.bankDetails
                    ?.accountNumber
                }
              />

              <InfoItem
                label="IFSC Code"
                value={
                  employee.bankDetails
                    ?.ifscCode
                }
              />

              <InfoItem
                label="Branch"
                value={
                  employee.bankDetails
                    ?.branch
                }
              />

            </div>

          </ProfileSection>

          {/* ==================================================
              FAMILY DETAILS
          ================================================== */}

          <ProfileSection
            title="Family Details"
            description="Registered family members"
            icon="👨‍👩‍👧"
          >

            {employee.familyDetails?.length >
            0 ? (

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                {employee.familyDetails.map(
                  (
                    member,
                    index
                  ) => (

                    <div
                      key={index}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                    >

                      <div className="flex items-center gap-4 mb-5">

                        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                          👤
                        </div>

                        <div>

                          <h3 className="font-bold text-gray-900">
                            {member.name ||
                              "Not provided"}
                          </h3>

                          <p className="text-sm text-blue-600">
                            {
                              member.relationship ||
                              "Relationship not provided"
                            }
                          </p>

                        </div>

                      </div>

                      <div className="space-y-3">

                        <InfoItem
                          label="Contact Number"
                          value={
                            member.contactNo
                          }
                        />

                        <InfoItem
                          label="Occupation"
                          value={
                            member.occupation
                          }
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <EmptyState
                icon="👨‍👩‍👧"
                text="No family details provided"
              />

            )}

          </ProfileSection>

          {/* ==================================================
              PREVIOUS EMPLOYMENT
          ================================================== */}

          <ProfileSection
            title="Previous Employment"
            description="Employee's previous work experience"
            icon="🏢"
          >

            {employee.previousEmployment?.length >
            0 ? (

              <div className="space-y-5">

                {employee.previousEmployment.map(
                  (
                    employment,
                    index
                  ) => (

                    <div
                      key={index}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-6"
                    >

                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">

                        <div>

                          <h3 className="text-lg font-bold text-gray-900">
                            {
                              employment.companyName ||
                              "Company not provided"
                            }
                          </h3>

                          <p className="text-sm text-blue-600 mt-1">
                            {
                              employment.designation ||
                              "Designation not provided"
                            }
                          </p>

                        </div>

                        <div className="rounded-xl bg-white border border-gray-100 px-4 py-3">

                          <p className="text-xs text-gray-400">
                            Annual Salary
                          </p>

                          <p className="font-bold text-gray-900">
                            {formatCurrency(
                              employment.annualSalary
                            )}
                          </p>

                        </div>

                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                        <InfoItem
                          label="Place"
                          value={
                            employment.place
                          }
                        />

                        <InfoItem
                          label="Joining Date"
                          value={formatDate(
                            employment.joinDate
                          )}
                        />

                        <InfoItem
                          label="Left Date"
                          value={formatDate(
                            employment.leftDate
                          )}
                        />

                        <InfoItem
                          label="Reason for Leaving"
                          value={
                            employment.reasonForLeaving
                          }
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <EmptyState
                icon="🏢"
                text="No previous employment details provided"
              />

            )}

          </ProfileSection>

          {/* ==================================================
              EMERGENCY CONTACTS
          ================================================== */}

          <ProfileSection
            title="Emergency Contacts"
            description="People to contact in an emergency"
            icon="🚨"
          >

            {employee.emergencyContacts?.length >
            0 ? (

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                {employee.emergencyContacts.map(
                  (
                    contact,
                    index
                  ) => (

                    <div
                      key={index}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                    >

                      <div className="flex items-center gap-4 mb-5">

                        <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center text-xl">
                          🚨
                        </div>

                        <div>

                          <h3 className="font-bold text-gray-900">
                            {contact.name ||
                              "Not provided"}
                          </h3>

                          <p className="text-sm text-red-600">
                            {
                              contact.relationship ||
                              "Relationship not provided"
                            }
                          </p>

                        </div>

                      </div>

                      <InfoItem
                        label="Contact Number"
                        value={
                          contact.contactNo
                        }
                      />

                    </div>

                  )
                )}

              </div>

            ) : (

              <EmptyState
                icon="🚨"
                text="No emergency contacts provided"
              />

            )}

          </ProfileSection>

          {/* ==================================================
              DOCUMENTS
          ================================================== */}

          <ProfileSection
            title="Employee Documents"
            description="Documents uploaded to your employee profile"
            icon="📁"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              <DocumentCard
                title="PAN Card"
                url={
                  employee.panCardDocument
                }
                icon="🪪"
              />

              <DocumentCard
                title="Aadhar Card"
                url={
                  employee.aadharCardDocument
                }
                icon="🪪"
              />

              <DocumentCard
                title="Highest Education"
                url={
                  employee.highestEducationDocument
                }
                icon="🎓"
              />

              <DocumentCard
                title="Experience Letter"
                url={
                  employee.experienceLetter
                }
                icon="📄"
              />

              <DocumentCard
                title="Salary Slip"
                url={
                  employee.salarySlip
                }
                icon="💰"
              />

            </div>

          </ProfileSection>

          {/* ==================================================
              ACCOUNT INFORMATION
          ================================================== */}

          <ProfileSection
            title="Employment Information"
            description="Company employment information"
            icon="📋"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              <InfoItem
                label="Employee Code"
                value={
                  employee.employeeCode
                }
              />

              <InfoItem
                label="Company Login Email"
                value={
                  employee.companyLoginEmail
                }
              />

              <InfoItem
                label="Joining Date"
                value={formatDate(
                  employee.joiningDate
                )}
              />

              <InfoItem
                label="Employee Status"
                value={
                  employee.employeeStatus
                }
              />

            </div>

            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

              <p className="text-sm text-blue-700">
                Your company login password is private and is not displayed in your employee profile.
              </p>

            </div>

          </ProfileSection>

        </div>

      </main>

    </div>
  );
}


// ======================================================
// SIDEBAR BUTTON
// ======================================================

function SidebarButton({
  icon,
  label,
  active = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}


// ======================================================
// PROFILE SECTION
// ======================================================

function ProfileSection({
  title,
  description,
  icon,
  children,
}) {
  return (
    <section className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-6 overflow-hidden">

      <div className="px-6 py-5 border-b border-gray-100">

        <div className="flex items-center gap-4">

          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
            {icon}
          </div>

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              {title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {description}
            </p>

          </div>

        </div>

      </div>

      <div className="p-6">
        {children}
      </div>

    </section>
  );
}


// ======================================================
// INFO ITEM
// ======================================================

function InfoItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">

      <p className="text-xs font-medium text-gray-400 mb-1">
        {label}
      </p>

      <p className="text-sm font-semibold text-gray-800 break-words whitespace-pre-line">
        {value || "Not provided"}
      </p>

    </div>
  );
}


// ======================================================
// DOCUMENT CARD
// ======================================================

function DocumentCard({
  title,
  url,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
            {icon}
          </div>

          <div>

            <h3 className="font-bold text-gray-900">
              {title}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              {url
                ? "Document available"
                : "Not uploaded"}
            </p>

          </div>

        </div>

      </div>

      {url ? (

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          View Document
        </a>

      ) : (

        <div className="mt-4 rounded-xl bg-white border border-gray-100 px-4 py-2.5 text-center text-sm text-gray-400">
          Document not uploaded
        </div>

      )}

    </div>
  );
}


// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState({
  icon,
  text,
}) {
  return (
    <div className="rounded-2xl bg-gray-50 border border-dashed border-gray-200 py-10 text-center">

      <div className="text-4xl mb-3">
        {icon}
      </div>

      <p className="text-sm text-gray-400">
        {text}
      </p>

    </div>
  );
}