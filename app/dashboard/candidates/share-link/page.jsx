"use client";

import { useState } from "react";
import { Copy, Check, Link as LinkIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ShareCandidateLink() {
  const [copied, setCopied] = useState(false);

  const formLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/candidate-form`
      : "";

const handleCopy = async () => {
  try {
    // Modern Clipboard API
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      await navigator.clipboard.writeText(formLink);
    } else {
      // Fallback for browsers/environments
      const textarea = document.createElement("textarea");

      textarea.value = formLink;

      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      document.execCommand("copy");

      document.body.removeChild(textarea);
    }

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);

  } catch (error) {
    console.error("Failed to copy link", error);

    // Last fallback: select the input so HR can manually copy
    const input = document.getElementById("candidate-form-link");

    if (input) {
      input.focus();
      input.select();
    }
  }
};

  return (
    <div className="min-h-screen p-8 bg-gray-50">

      {/* Header */}
      <div className="max-w-3xl mx-auto">

        <Link
          href="/dashboard/candidates"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={18} />
          Back to Candidates
        </Link>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
            <LinkIcon
              size={28}
              className="text-blue-600"
            />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-900">
            Share Candidate Registration Link
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Share this link with the candidate. They can open the form
            and submit their details without accessing the HR dashboard.
          </p>

          {/* Link box */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">

            <p className="text-sm font-medium text-gray-500 mb-2">
              Candidate Form Link
            </p>

            <div className="flex flex-col sm:flex-row gap-3">

             <input
  id="candidate-form-link"
  type="text"
  value={formLink}
  readOnly
  className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 outline-none"
/>

              <button
                onClick={handleCopy}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white font-medium transition ${
                  copied
                    ? "bg-green-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy Link
                  </>
                )}
              </button>

            </div>

          </div>

          {/* Information */}
          <div className="mt-8 border-t border-gray-100 pt-6">

            <h2 className="font-semibold text-gray-900 mb-3">
              How it works
            </h2>

            <div className="space-y-3 text-sm text-gray-600">

              <div className="flex gap-3">
                <span className="font-semibold text-blue-600">
                  1.
                </span>
                <p>
                  Copy the candidate registration link.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="font-semibold text-blue-600">
                  2.
                </span>
                <p>
                  Send the link to the candidate through WhatsApp,
                  email, or any other method.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="font-semibold text-blue-600">
                  3.
                </span>
                <p>
                  The candidate fills and submits the registration form.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="font-semibold text-blue-600">
                  4.
                </span>
                <p>
                  The candidate will automatically appear in your
                  Candidates dashboard.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}