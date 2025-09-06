"use client";
import React, { useState, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerForm } from "@/components/forms/CustomerForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // ADDED: State to hold the customer being edited
  const [editingCustomer, setEditingCustomer] = useState(null);

  const fetchCustomers = async () => {
    const response = await fetch('/api/customers');
    const data = await response.json();
    if (Array.isArray(data)) setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // --- Handler Functions ---
  const handleOpenCreateDialog = () => {
    setEditingCustomer(null);
    setIsDialogOpen(true);
  };
  
  const handleOpenEditDialog = (customer) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };
  
  const handleCustomerUpdated = (updatedCustomer) => {
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };
  
  const handleDeleteCustomer = async (customerId) => {
    await fetch(`/api/customers/${customerId}`, { method: 'DELETE' });
    setCustomers(customers.filter(c => c.id !== customerId));
  };

  return (
    <div className="flex flex-col gap-4">
      <CustomerForm
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onCustomerAdded={fetchCustomers}
        onCustomerUpdated={handleCustomerUpdated}
        initialData={editingCustomer}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={handleOpenCreateDialog}>+ Add New Customer</Button>
      </div>

      <div className="rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.phone || 'N/A'}</TableCell>
                <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {/* WIRED UP: Edit Button */}
                      <DropdownMenuItem onSelect={() => handleOpenEditDialog(customer)}>Edit</DropdownMenuItem>
                      {/* WIRED UP: Delete Button with Confirmation */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete the customer and all their associated orders.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}