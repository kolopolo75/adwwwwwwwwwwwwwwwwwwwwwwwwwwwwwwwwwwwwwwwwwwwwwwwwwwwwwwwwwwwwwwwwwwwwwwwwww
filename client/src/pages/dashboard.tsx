import DashboardCards from "@/components/dashboard/DashboardCards";
import RecentOrders from "@/components/dashboard/RecentOrders";

export default function Dashboard() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        {/* Dashboard Cards */}
        <DashboardCards />
        
        {/* Recent Orders */}
        <RecentOrders />
      </div>
    </div>
  );
}
