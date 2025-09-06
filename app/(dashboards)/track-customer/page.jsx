"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, Hourglass } from "lucide-react";

export default function TrackCustomerPage() {
  const [phone, setPhone] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCustomerData(null);
    setError("");
    try {
      const response = await fetch(`/api/customers/lookup?phone=${phone}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Customer not found");
      }
      setCustomerData(data);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  // Calculate stats if we have customer data
  const stats = customerData ? {
    totalOrders: customerData.orders.length,
    totalSpent: customerData.orders.reduce((sum, order) => sum + order.totalAmount, 0),
    pendingOrders: customerData.orders.filter(order => order.status === 'Pending').length,
  } : null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Customer Lookup</h1>
      <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="tel"
          placeholder="Enter phone number..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      
      {customerData && (
        <div className="flex flex-col gap-6 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{customerData.name}</CardTitle>
            </CardHeader>
          </Card>

          {/* Stats Section */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><CardTitle>Total Orders</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold flex items-center"><Package className="mr-2 h-6 w-6 text-muted-foreground"/>{stats.totalOrders}</div></CardContent></Card>
            <Card><CardHeader><CardTitle>Total Spent</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold flex items-center"><DollarSign className="mr-2 h-6 w-6 text-muted-foreground"/>Rs. {stats.totalSpent.toLocaleString()}</div></CardContent></Card>
            <Card><CardHeader><CardTitle>Pending Orders</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold flex items-center"><Hourglass className="mr-2 h-6 w-6 text-muted-foreground"/>{stats.pendingOrders}</div></CardContent></Card>
          </div>

          {/* Orders Table */}
          <Card>
            <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Order ID</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                <TableBody>
                  {customerData.orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.id.substring(0, 7).toUpperCase()}</TableCell>
                      <TableCell><Badge>{order.status}</Badge></TableCell>
                      <TableCell className="text-right">Rs. {order.totalAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}