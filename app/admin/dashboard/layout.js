import AdminDashboardGuard from "@/components/admin/AdminDashboardGuard";


export default function AdminDashboardLayout({ children }) {
  return (
    <AdminDashboardGuard>
      {children}
    </AdminDashboardGuard>
  );
}