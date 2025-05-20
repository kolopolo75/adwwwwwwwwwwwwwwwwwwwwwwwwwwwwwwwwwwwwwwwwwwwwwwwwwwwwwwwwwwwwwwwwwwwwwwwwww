import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Order, Client, Product } from "@shared/schema";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/components/ui/currency";
import { StatusBadge } from "@/components/ui/status-badge";
import { PaymentBadge } from "@/components/ui/payment-badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface OrderListProps {
  onEdit: (order: Order) => void;
}

export default function OrderList({ onEdit }: OrderListProps) {
  const { toast } = useToast();
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
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
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Sucesso",
        description: "Pedido excluído com sucesso",
      });
      setOrderToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao excluir pedido: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const handleDelete = () => {
    if (orderToDelete) {
      deleteMutation.mutate(orderToDelete.id);
    }
  };
  
  // Helper functions to get client and product names
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente Desconhecido';
  };
  
  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Produto Desconhecido';
  };
  
  // Filter orders based on search query
  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase();
    
    if (!query) return true;
    
    const clientName = getClientName(order.clientId).toLowerCase();
    const productName = getProductName(order.productId).toLowerCase();
    const status = order.status.toLowerCase();
    
    return (
      clientName.includes(query) ||
      productName.includes(query) ||
      status.includes(query)
    );
  });
  
  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar pedidos..."
            className="pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamento</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    Carregando pedidos...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchQuery ? "Nenhum pedido encontrado na busca" : "Nenhum pedido cadastrado"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{getClientName(order.clientId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getProductName(order.productId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(order.orderDate), 'yyyy-MM-dd')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.paymentStatus ? (
                        <PaymentBadge 
                          paymentStatus={order.paymentStatus} 
                          amountPaid={order.amountPaid} 
                          remainingAmount={order.remainingAmount} 
                        />
                      ) : (
                        <PaymentBadge paymentStatus="Pendente" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(Number(order.total))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => onEdit(order)} 
                        className="text-primary hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-red-600 hover:text-red-900">
                            Excluir
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Isso excluirá permanentemente este pedido.
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => {
                                setOrderToDelete(order);
                                handleDelete();
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
