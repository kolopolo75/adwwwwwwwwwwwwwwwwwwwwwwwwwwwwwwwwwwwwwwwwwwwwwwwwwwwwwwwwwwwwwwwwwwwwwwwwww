import { useQuery } from "@tanstack/react-query";
import { Client, Order, Product } from "@shared/schema";
import { formatCurrency } from "@/components/ui/currency";

export default function DashboardCards() {
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"]
  });
  
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"]
  });
  
  // Calculate total values
  const totalClients = clients.length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, order) => {
    const total = typeof order.total === 'string' 
      ? parseFloat(order.total) 
      : Number(order.total);
    return sum + total;
  }, 0);

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Clients Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary rounded-md p-3">
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Clients</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{totalClients}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      {/* Total Orders Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-secondary rounded-md p-3">
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{totalOrders}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      {/* Total Sales Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accent rounded-md p-3">
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{formatCurrency(totalSales)}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
