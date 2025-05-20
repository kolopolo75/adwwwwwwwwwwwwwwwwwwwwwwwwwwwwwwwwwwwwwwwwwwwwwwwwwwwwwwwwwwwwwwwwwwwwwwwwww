import { useQuery } from "@tanstack/react-query";
import { Client, Order, Product } from "@shared/schema";
import { formatCurrency } from "@/components/ui/currency";
import { StatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";

export default function RecentOrders() {
  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"]
  });
  
  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"]
  });
  
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });
  
  const isLoading = ordersLoading || clientsLoading || productsLoading;
  
  // Helper functions to get client and product names
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };
  
  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };
  
  // Sort orders by date (newest first) and get the 5 most recent
  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);
  
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading recent orders...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{getClientName(order.clientId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getProductName(order.productId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(order.orderDate), 'yyyy-MM-dd')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(Number(order.total))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
