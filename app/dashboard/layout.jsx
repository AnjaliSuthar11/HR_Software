
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar.jsx";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">

      <Sidebar/>

      <div className="flex-1 flex flex-col">

        <Header/>

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}