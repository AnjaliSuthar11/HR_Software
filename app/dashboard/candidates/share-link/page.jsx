"use client";

import { useState } from "react";
import {
  Link as LinkIcon,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function ShareCandidateLink() {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] =
  useState("");

const [appliedPosition, setAppliedPosition] =
  useState("");

  // ================================
  // GENERATE UNIQUE LINK
  // ================================

  const generateLink = async () => {
    try {
     
if (!department) {
  toast.error(
    "Please select a department"
  );
  return;
}

if (!appliedPosition.trim()) {
  toast.error(
    "Please enter the applied position"
  );
  return;
}

 setLoading(true);
      setCopied(false);

      
      const { data } = await axios.post(
        "/api/candidates/generate-link",{
    department,
    appliedPosition,
  }
      );

      console.log("Generate link response:", data);

      if (!data.success) {
        toast.error(
          data.message || "Failed to generate registration link"
        );
        return;
      }

      // IMPORTANT:
      // candidate-registration must match your folder:
      //
      // app/
      //   candidate-registration/
      //      [token]/
      //         page.jsx

      const generatedLink =
        `${window.location.origin}/candidates-registration/${data.token}`;

      setLink(generatedLink);

      toast.success("Unique registration link generated");

    } catch (error) {
      console.error("Generate link error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to generate link"
      );

    } finally {
      setLoading(false);
    }
  };

  // ================================
  // COPY LINK
  // ================================

  const handleCopy = async () => {
    try {
      if (!link) {
        toast.error("No registration link available");
        return;
      }

      // Modern Clipboard API
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(link);
      } else {
        // Fallback for local HTTP
        const textarea =
          document.createElement("textarea");

        textarea.value = link;

        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        const successful =
          document.execCommand("copy");

        document.body.removeChild(textarea);

        if (!successful) {
          throw new Error("Copy command failed");
        }
      }

      setCopied(true);

      toast.success("Link copied successfully!");

      // Change button back after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error(
        "Failed to copy link:",
        error
      );

      toast.error(
        "Unable to copy. Please copy the link manually."
      );
    }
  };

  // ================================
  // GENERATE ANOTHER LINK
  // ================================

  const handleGenerateAnother = () => {
    setLink("");
    setCopied(false);

    // Generate immediately
    generateLink();
  };

  return (
    <div className="min-h-screen p-8">

      <div className="max-w-3xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

              <LinkIcon size={22} />

            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Candidate Registration Link
            </h1>

          </div>

          <p className="text-gray-500">
            Generate a unique registration link and
            share it with the candidate.
          </p>

        </div>


        {/* ================= CARD ================= */}

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

          {/* CARD HEADER */}

          <div className="flex items-center gap-4 mb-8">

            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

              <LinkIcon size={24} />

            </div>

            <div>

              <h2 className="text-xl font-semibold text-gray-900">
                Generate Registration Link
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                This link is created for one candidate.
              </p>

            </div>

          </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

  {/* DEPARTMENT */}

  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Department
    </label>

    <select
      value={department}
      onChange={(e) =>
        setDepartment(
          e.target.value
        )
      }
      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500"
    >
      <option value="">
        Select Department
      </option>

      <option value="HR">
        HR
      </option>

      <option value="Creative">
        Creative
      </option>

      <option value="Technology">
        Technology
      </option>

      <option value="Sales">
        Sales
      </option>

      <option value="Marketing">
        Marketing
      </option>
    </select>
  </div>


  {/* POSITION */}

  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Applied Position
    </label>

    <input
      type="text"
      value={appliedPosition}
      onChange={(e) =>
        setAppliedPosition(
          e.target.value
        )
      }
      placeholder="Motion Graphic Designer"
      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
    />
  </div>

</div>
          {/* ================= GENERATE BUTTON ================= */}

          {!link && (

            <button
              type="button"
              onClick={generateLink}
              disabled={loading}
              className="
                w-full
                bg-blue-600
                hover:bg-blue-700
                disabled:bg-blue-400
                text-white
                py-3.5
                rounded-xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
              "
            >

              {loading ? (
                <>

                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />

                  Generating...

                </>
              ) : (
                <>

                  <LinkIcon size={18} />

                  Generate Unique Link

                </>
              )}

            </button>

          )}


          {/* ================= GENERATED LINK ================= */}

          {link && (

            <div>

              {/* LINK BOX */}

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">

                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Registration Link
                </p>

                <div className="flex flex-col sm:flex-row gap-3">

                  <input
                    type="text"
                    value={link}
                    readOnly
                    className="
                      flex-1
                      border
                      border-gray-300
                      rounded-lg
                      px-4
                      py-3
                      bg-white
                      text-sm
                      text-gray-700
                      outline-none
                      focus:border-blue-500
                    "
                  />

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="
                      px-5
                      py-3
                      bg-gray-900
                      hover:bg-black
                      text-white
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      gap-2
                      transition
                    "
                  >

                    {copied ? (
                      <>

                        <Check size={18} />

                        Copied

                      </>
                    ) : (
                      <>

                        <Copy size={18} />

                        Copy

                      </>
                    )}

                  </button>

                </div>

              </div>


              {/* ================= INFORMATION ================= */}

              <div className="mt-6 p-5 bg-blue-50 border border-blue-100 rounded-xl">

                <div className="flex gap-3">

                  <div className="mt-0.5">

                    <LinkIcon
                      size={18}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-blue-900">
                      Share this link with the candidate
                    </p>

                    <p className="text-sm text-blue-800 mt-2 leading-6">
                      The candidate can open this link
                      without logging into the HR dashboard
                      and complete the registration form.
                    </p>

                    <p className="text-sm text-blue-800 mt-2 leading-6 font-medium">
                      Once the candidate submits the form,
                      this registration link will become
                      inactive.
                    </p>

                  </div>

                </div>

              </div>


              {/* ================= ANOTHER LINK ================= */}

              <button
                type="button"
                onClick={handleGenerateAnother}
                disabled={loading}
                className="
                  mt-6
                  text-sm
                  text-blue-600
                  hover:text-blue-700
                  font-semibold
                  flex
                  items-center
                  gap-2
                "
              >

                <RefreshCw
                  size={16}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Generate Another Link

              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}