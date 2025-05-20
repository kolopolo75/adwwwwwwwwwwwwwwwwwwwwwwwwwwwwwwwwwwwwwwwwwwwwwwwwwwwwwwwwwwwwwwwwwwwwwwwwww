import { useState } from "react";
import { Product } from "@shared/schema";
import ProductForm from "@/components/products/ProductForm";
import ProductList from "@/components/products/ProductList";
import { Button } from "@/components/ui/button";

export default function Products() {
  const [editMode, setEditMode] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  
  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setEditMode(true);
  };
  
  const handleCancel = () => {
    setEditProduct(null);
    setEditMode(false);
  };
  
  const handleAddNew = () => {
    setEditProduct(null);
    setEditMode(true);
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <Button 
            onClick={handleAddNew} 
            className="mt-3 md:mt-0 inline-flex items-center"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Button>
        </div>
        
        {/* Product Form */}
        {editMode && (
          <ProductForm 
            editMode={editMode} 
            editProduct={editProduct} 
            onCancel={handleCancel} 
          />
        )}
        
        {/* Product List */}
        <ProductList onEdit={handleEdit} />
      </div>
    </div>
  );
}
