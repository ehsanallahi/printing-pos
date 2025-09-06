"use client";
import React, { useState, useEffect } from "react";
import { MoreHorizontal, Search } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner"; // Make sure toast is imported
import { AddNewOrderForm } from "@/components/forms/AddNewOrderForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const fetchOrders = async (page, search) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders?page=${page}&search=${search}`);
      const data = await response.json();
      if (data.orders) {
        setOrders(data.orders);
        setTotalPages(Math.ceil(data.totalCount / 10));
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders(currentPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm]);

  // --- Handler Functions ---
  const handleOpenCreateDialog = () => { setEditingOrder(null); setIsDialogOpen(true); };
  const handleOpenEditDialog = (order) => { setEditingOrder(order); setIsDialogOpen(true); };

  const handleOrderUpdated = (updatedOrder) => {
    // ADDED: Toast notification for successful update
    toast.success("Order updated successfully!");
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };
  
  const handleStatusChange = async (orderId, newStatus) => {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    const updatedOrder = await response.json();
    // ADDED: Toast notification for status change
    toast.info(`Order status changed to "${newStatus}".`);
    handleOrderUpdated(updatedOrder);
  };

  const handleDeleteOrder = async (orderId) => {
    await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    // ADDED: Toast notification for successful deletion
    toast.error("Order has been deleted.");
    fetchOrders(currentPage, debouncedSearchTerm);
  };
  
  return (
    <div className="flex flex-col gap-4">
       <AddNewOrderForm
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onOrderAdded={() => {
          toast.success("Order created successfully!");
          fetchOrders(1, ""); // Go to first page after adding
        }}
        onOrderUpdated={handleOrderUpdated}
        initialData={editingOrder}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button onClick={handleOpenCreateDialog}>+ Add New Order</Button>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
  type="search"
  placeholder="Search by name or phone..."
  className="pl-8 sm:w-[300px]"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
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
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell></TableRow>
            ) : (Array.isArray(orders) && orders.length > 0) ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.customer?.name || 'N/A'}</TableCell>
                  <TableCell>{order.mediaType}</TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}>
                      <SelectTrigger className="w-[150px] focus:ring-0 focus:ring-offset-0"><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Ready for Delivery">Ready for Delivery</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">Rs. {order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* NEW: View Details button that navigates to the details page */}
                        <DropdownMenuItem onSelect={() => router.push(`/orders/${order.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleOpenEditDialog(order)}>Edit</DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteOrder(order.id)}>Continue</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="h-24 text-center">No orders found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || isLoading}>Previous</Button>
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || isLoading}>Next</Button>
      </div>
    </div>
  );
}