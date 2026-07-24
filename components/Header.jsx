"use client";

import { useSearch } from "@/context/SearchContext";
import { Bell, Search } from "lucide-react";

export default function Header() {
  const {search,setSearch} = useSearch("")
  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8">

      {/* Search */}

      <div className="relative w-[420px]">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

       <input
  type="text"
  placeholder="Search candidate or employee..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
/>

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        <button className="relative">

          <Bell size={22} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>

        </button>

        <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex justify-center items-center font-semibold">
          HR
        </div>

      </div>

    </header>
  );
}