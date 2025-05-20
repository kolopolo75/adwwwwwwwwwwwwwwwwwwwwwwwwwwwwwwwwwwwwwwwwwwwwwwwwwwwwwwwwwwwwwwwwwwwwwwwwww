import { useState } from "react";
import { Client } from "@shared/schema";
import ClientForm from "@/components/clients/ClientForm";
import ClientList from "@/components/clients/ClientList";
import { Button } from "@/components/ui/button";

export default function Clients() {
  const [editMode, setEditMode] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  
  const handleEdit = (client: Client) => {
    setEditClient(client);
    setEditMode(true);
  };
  
  const handleCancel = () => {
    setEditClient(null);
    setEditMode(false);
  };
  
  const handleAddNew = () => {
    setEditClient(null);
    setEditMode(true);
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <Button 
            onClick={handleAddNew} 
            className="mt-3 md:mt-0 inline-flex items-center"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Client
          </Button>
        </div>
        
        {/* Client Form */}
        {editMode && (
          <ClientForm 
            editMode={editMode} 
            editClient={editClient} 
            onCancel={handleCancel} 
          />
        )}
        
        {/* Client List */}
        <ClientList onEdit={handleEdit} />
      </div>
    </div>
  );
}
