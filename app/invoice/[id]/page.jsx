"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InvoicePage() {
  const [order, setOrder] = useState(null);
  const params = useParams();
  const { id: orderId } = params;

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) setOrder(await response.json());
      };
      fetchOrderDetails();
    }
  }, [orderId]);

  if (!order) {
    return <div className="p-10 text-center">Loading Invoice...</div>;
  }

  const balanceDue = order.totalAmount - order.paidAmount;

  return (
    <div className="max-w-4xl p-8 mx-auto my-10 bg-white border rounded-lg shadow-sm text-black">
      {/* --- Header with Your Business Info --- */}
      <header className="flex items-start justify-between pb-6 mb-8 border-b">
        <div>
          <h1 className="text-2xl font-bold">SRA Digital Printers</h1>
          <p className="text-sm text-gray-500">Shop # 2 Rehan Center, Shami Park Mobile Market, Main Chungi Amer Sidhu, Lahore</p>
          <p className="text-sm text-gray-500">Phone: 0309 4161568</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold uppercase text-gray-800">Invoice</h2>
          <p className="text-sm text-gray-500">#{order.id.substring(0, 7).toUpperCase()}</p>
        </div>
      </header>

      {/* --- Customer Info and Dates --- */}
      <section className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="mb-1 font-semibold text-gray-700">Bill To</h3>
          <p className="font-bold">{order.customer.name}</p>
          <p className="text-sm text-gray-600">{order.customer.phone || 'No phone'}</p>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Invoice Date: </span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </section>

      {/* --- Items Table --- */}
      <section className="mb-8">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Item Description</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <p className="font-medium">{order.mediaType}</p>
                <p className="text-sm text-gray-500">{order.width} ft x {order.height} ft</p>
              </TableCell>
              <TableCell className="text-center">{order.quantity}</TableCell>
              <TableCell className="text-right">Rs. {order.rate.toFixed(2)}</TableCell>
              <TableCell className="text-right">Rs. {order.totalAmount.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
      
      {/* --- NEW: Payment History Table --- */}
      {order.payments && order.payments.length > 0 && (
        <section className="mb-8">
          <h3 className="mb-2 text-lg font-semibold text-gray-700">Payment History</h3>
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Payment Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.payments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>{new Date(payment.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="text-right">Rs. {payment.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      {/* --- Financial Summary --- */}
      <section className="flex justify-end mb-8">
        <div className="w-full md:w-2/5 space-y-2">
          <div className="flex justify-between font-bold border-t pt-2"><span>Total:</span><span>Rs. {order.totalAmount.toLocaleString()}</span></div>
          <div className="flex justify-between text-green-600"><span>Amount Paid:</span><span>Rs. {order.paidAmount.toLocaleString()}</span></div>
          <div className="flex justify-between p-2 font-bold text-lg rounded-md bg-gray-100"><span>Balance Due:</span><span>Rs. {balanceDue.toLocaleString()}</span></div>
        </div>
      </section>
      
      {/* --- Footer --- */}
      <footer className="pt-6 mt-8 border-t">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-6">Thank you for your business!</p>
          <Button onClick={() => window.print()} className="print:hidden">
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
        </div>
      </footer>
    </div>
  );
}