import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { SearchProvider } from "@/context/SearchContext";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({ children }) {
  return (
      <SearchProvider>
    <div className="flex h-screen bg-[#F4F7FB]">

  <Sidebar />

  <div className="flex-1 ml-64 flex flex-col overflow-hidden">

    <Header />

    <main className="flex-1 overflow-y-auto p-8">
      {children}
       <Toaster position="top-right" />
    </main>

  </div>

</div>
</SearchProvider>
  );
}