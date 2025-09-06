"use client";
import React, { useState, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { AddNewOrderForm } from "@/components/forms/AddNewOrderForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const fetchOrders = async () => {
    const response = await fetch('/api/orders');
    const data = await response.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
    });
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const handleOpenCreateDialog = () => {
    setEditingOrder(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (order) => {
    setEditingOrder(order);
    setIsDialogOpen(true);
  };

  const handleOrderUpdated = (updatedOrder) => {
    setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ADDED: The form component is now here, controlled by state. It's invisible until opened. */}
      <AddNewOrderForm
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onOrderAdded={fetchOrders}
        onOrderUpdated={handleOrderUpdated}
        initialData={editingOrder}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        {/* CHANGED: This button now just opens the dialog for creating a new order. */}
        <Button onClick={handleOpenCreateDialog}>+ Add New Order</Button>
      </div>

      <div className="rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(orders) && orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.customer.name}</TableCell>
                <TableCell>{order.mediaType}</TableCell>
                <TableCell>
                  <Badge variant={
                    order.status === 'Pending' ? 'destructive' :
                    order.status === 'In Progress' ? 'outline' : 'default'
                  }>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">Rs. {order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      {/* CHANGED: The "Edit" button now opens the dialog with the current order's data. */}
                      <DropdownMenuItem onSelect={() => handleOpenEditDialog(order)}>
                        Edit
                      </DropdownMenuItem>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              order and remove its data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteOrder(order.id)}>
                              Continue
                            </AlertDialogAction>
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