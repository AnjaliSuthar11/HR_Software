"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardGuard({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    try {
      const loggedIn =
        localStorage.getItem("OwnerAdminLoggedIn") === "true";

      const adminId = localStorage.getItem("OwnerAdminId");
      const storedData = localStorage.getItem("OwnerAdminData");
      const admin = storedData ? JSON.parse(storedData) : null;

      if (
        !loggedIn ||
        !adminId ||
        !admin ||
        admin.id !== adminId
      ) {
        localStorage.removeItem("OwnerAdminLoggedIn");
        localStorage.removeItem("OwnerAdminId");
        localStorage.removeItem("OwnerAdminData");

        router.replace("/admin/login");
        return;
      }

      setAuthorized(true);
    } catch (error) {
      localStorage.removeItem("OwnerAdminLoggedIn");
      localStorage.removeItem("OwnerAdminId");
      localStorage.removeItem("OwnerAdminData");

      router.replace("/admin/login");
    } finally {
      setChecking(false);
    }
  }, [router]);

  if (checking || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Checking owner access...
        </p>
      </div>
    );
  }

  return children;
}