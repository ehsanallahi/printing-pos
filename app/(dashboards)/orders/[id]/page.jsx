"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddPaymentForm } from '@/components/forms/AddPaymentForm';

export default function OrderDetailsPage() {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const { id: orderId } = params;

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        setOrder(await response.json());
      } else {
        setOrder(null);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      setOrder(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) return <div className="text-center p-10">Loading order details...</div>;
  if (!order) return <div className="text-center p-10">Order not found.</div>;

  const balanceDue = order.totalAmount - order.paidAmount;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id.substring(0, 7).toUpperCase()}</h1>
          <p className="text-muted-foreground">Created on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="text-lg">{order.status}</Badge>
          <Link href={`/invoice/${order.id}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* FILLED IN: Customer Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{order.customer.name}</p>
            <p className="text-sm text-muted-foreground">
              {order.customer.phone || 'No phone number'}
            </p>
          </CardContent>
        </Card>

        {/* FILLED IN: Order Specifications Card */}
        <Card>
          <CardHeader>
            <CardTitle>Order Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p><strong>Media:</strong> {order.mediaType}</p>
            <p><strong>Size:</strong> {order.width} ft x {order.height} ft</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
          </CardContent>
        </Card>
        
        {/* Financial Summary Card */}
        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between"><span>Total Amount:</span> <strong>Rs. {order.totalAmount.toLocaleString()}</strong></div>
            <div className="flex justify-between text-green-600"><span>Amount Paid:</span> <strong>Rs. {(order.paidAmount || 0).toLocaleString()}</strong></div>
            <div className="flex justify-between text-red-600 border-t pt-2 mt-2"><span>Balance Due:</span> <strong className="text-xl">Rs. {(balanceDue || 0).toLocaleString()}</strong></div>
          </CardContent>
        </Card>
      </div>
      
      {/* Payments Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>A record of all payments made for this order.</CardDescription>
          </div>
          <AddPaymentForm orderId={order.id} onPaymentAdded={fetchOrderDetails} />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.payments && order.payments.length > 0 ? (
                order.payments.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell className="text-right">Rs. {payment.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No payments recorded.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}