import { useState } from "react";
import { Order } from "@shared/schema";
import OrderForm from "@/components/orders/OrderForm";
import OrderList from "@/components/orders/OrderList";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const [editMode, setEditMode] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  
  const handleEdit = (order: Order) => {
    setEditOrder(order);
    setEditMode(true);
  };
  
  const handleCancel = () => {
    setEditOrder(null);
    setEditMode(false);
  };
  
  const handleAddNew = () => {
    setEditOrder(null);
    setEditMode(true);
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <Button 
            onClick={handleAddNew} 
            className="mt-3 md:mt-0 inline-flex items-center"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Order
          </Button>
        </div>
        
        {/* Order Form */}
        {editMode && (
          <OrderForm 
            editMode={editMode} 
            editOrder={editOrder} 
            onCancel={handleCancel} 
          />
        )}
        
        {/* Order List */}
        <OrderList onEdit={handleEdit} />
      </div>
    </div>
  );
}
