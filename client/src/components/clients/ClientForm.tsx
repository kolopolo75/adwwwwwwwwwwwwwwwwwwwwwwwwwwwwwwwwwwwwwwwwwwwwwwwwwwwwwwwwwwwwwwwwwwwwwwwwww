import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertClientSchema, Client } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClientFormProps {
  editMode: boolean;
  editClient: Client | null;
  onCancel: () => void;
}

const clientSchema = insertClientSchema.extend({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function ClientForm({ editMode, editClient, onCancel }: ClientFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: editClient?.name || "",
      phone: editClient?.phone || "",
      address: editClient?.address || "",
    },
  });
  
  const createMutation = useMutation({
    mutationFn: async (data: ClientFormValues) => {
      const response = await apiRequest("POST", "/api/clients", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Success",
        description: "Client created successfully",
      });
      onCancel(); // Reset form
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create client: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: ClientFormValues) => {
      const response = await apiRequest("PUT", `/api/clients/${editClient?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
      onCancel(); // Reset form
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update client: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: ClientFormValues) => {
    if (editMode && editClient) {
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
            {editMode ? 'Edit Client' : 'Add New Client'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Enter the client's contact information.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
