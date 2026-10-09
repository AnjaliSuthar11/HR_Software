"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HRDashboardGuard({ children }) {
const router = useRouter();
const [authorized, setAuthorized] = useState(false);

useEffect(() => {
const loggedIn = localStorage.getItem("HRLoggedIn");
const hrId = localStorage.getItem("HRId");


if (loggedIn !== "true" || !hrId) {
  router.replace("/HR/login");
  return;
}

setAuthorized(true);


}, [router]);

if (!authorized) {
return ( <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB]"> <p className="text-gray-500">Checking login...</p> </div>
);
}

return children;
}
