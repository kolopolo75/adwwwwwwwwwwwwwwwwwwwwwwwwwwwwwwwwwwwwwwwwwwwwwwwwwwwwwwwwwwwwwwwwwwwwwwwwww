import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertProductSchema, Product } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductFormProps {
  editMode: boolean;
  editProduct: Product | null;
  onCancel: () => void;
}

const productSchema = insertProductSchema.extend({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm({ editMode, editProduct, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: editProduct?.name || "",
      price: editProduct?.price?.toString() || "",
    },
  });
  
  const createMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const response = await apiRequest("POST", "/api/products", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      onCancel(); // Reset form
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create product: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const response = await apiRequest("PUT", `/api/products/${editProduct?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      onCancel(); // Reset form
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update product: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: ProductFormValues) => {
    if (editMode && editProduct) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };
  
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  
  return (
    <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {editMode ? 'Edit Product' : 'Add New Product'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Enter details for a new print product including name and price per unit.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Business Cards, Flyers, etc." 
                            {...field} 
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="0.00" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="mr-3"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
