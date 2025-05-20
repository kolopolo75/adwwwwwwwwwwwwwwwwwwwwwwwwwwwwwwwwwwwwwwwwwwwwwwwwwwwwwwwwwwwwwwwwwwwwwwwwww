import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { orderSchema, orderStatuses, paymentStatuses, Order, Client, Product } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/components/ui/currency";
import { format } from "date-fns";

interface OrderFormProps {
  editMode: boolean;
  editOrder: Order | null;
  onCancel: () => void;
}

type OrderFormValues = z.infer<typeof orderSchema>;

export default function OrderForm({ editMode, editOrder, onCancel }: OrderFormProps) {
  const { toast } = useToast();
  const [totalValue, setTotalValue] = useState<number>(0);
  
  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"]
  });
  
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });
  
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      clientId: editOrder?.clientId || 0,
      productId: editOrder?.productId || 0,
      quantity: editOrder?.quantity || 1,
      orderDate: editOrder?.orderDate ? new Date(editOrder.orderDate) : new Date(),
      status: editOrder?.status as any || "Em Produção",
      paymentStatus: editOrder?.paymentStatus as any || "Pendente",
      total: editOrder?.total || "0",
      amountPaid: editOrder?.amountPaid || "0",
      remainingAmount: editOrder?.remainingAmount || "0",
    },
  });
  
  // Allow manual price entry instead of automatic calculation
  const updateTotalDisplay = () => {
    const manualTotal = form.getValues("total");
    if (manualTotal) {
      const totalValue = parseFloat(manualTotal);
      if (!isNaN(totalValue)) {
        setTotalValue(totalValue);
        return totalValue;
      }
    }
    
    setTotalValue(0);
    return 0;
  };
  
  // Watch for changes to update total display
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "total") {
        updateTotalDisplay();
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);
  
  // Update display on initial load
  useEffect(() => {
    if (editOrder) {
      updateTotalDisplay();
    }
  }, [editOrder]);
  
  const createMutation = useMutation({
    mutationFn: async (data: OrderFormValues) => {
      const response = await apiRequest("POST", "/api/orders", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Sucesso",
        description: "Pedido criado com sucesso",
      });
      onCancel(); // Reset form
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao criar pedido: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: OrderFormValues) => {
      const response = await apiRequest("PUT", `/api/orders/${editOrder?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Sucesso",
        description: "Pedido atualizado com sucesso",
      });
      onCancel(); // Reset form
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao atualizar pedido: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: OrderFormValues) => {
    // Use the manually entered total value
    if (editMode && editOrder) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };
  
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isLoading = clientsLoading || productsLoading;
  
  if (isLoading) {
    return <div className="py-10 text-center">Loading data...</div>;
  }
  
  return (
    <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {editMode ? 'Editar Pedido' : 'Adicionar Novo Pedido'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Cadastre um novo pedido de impressão para um cliente.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id.toString()}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Produto</FormLabel>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um produto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="orderDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data do Pedido</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            value={format(field.value, 'yyyy-MM-dd')}
                            onChange={(e) => {
                              field.onChange(new Date(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status do Pedido</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {orderStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="paymentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status do Pagamento</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status do pagamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Total (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="Digite o valor total" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateTotalDisplay();
                              
                              // Auto-update remaining amount
                              const totalValue = parseFloat(e.target.value) || 0;
                              const amountPaid = parseFloat(form.getValues("amountPaid") || "0");
                              form.setValue("remainingAmount", (totalValue - amountPaid).toFixed(2));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="amountPaid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Pago (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="Digite o valor pago" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              
                              // Update remaining amount and payment status
                              const totalValue = parseFloat(form.getValues("total") || "0");
                              const amountPaid = parseFloat(e.target.value) || 0;
                              const remainingAmount = totalValue - amountPaid;
                              
                              form.setValue("remainingAmount", remainingAmount.toFixed(2));
                              
                              // Update payment status based on payment
                              if (amountPaid <= 0) {
                                form.setValue("paymentStatus", "Pendente");
                              } else if (amountPaid >= totalValue) {
                                form.setValue("paymentStatus", "Pago 100%");
                              } else {
                                form.setValue("paymentStatus", "Pagamento Parcial");
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="remainingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Restante (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            disabled
                            placeholder="Valor restante" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <div className="bg-gray-50 p-4 rounded-md h-full flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-500 block">Prévia:</span>
                      <span className="text-lg font-bold text-gray-900 block mt-1">
                        {formatCurrency(totalValue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="mr-3"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
