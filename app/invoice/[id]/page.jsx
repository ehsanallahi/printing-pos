"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

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
    return <div className="text-center p-10">Loading Invoice...</div>;
  }

  const balanceDue = order.totalAmount - order.paidAmount;

  return (
    <div className="bg-white text-black max-w-4xl mx-auto p-8 my-10 rounded-lg shadow-lg">
      <header className="flex justify-between items-start mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Your Print Shop</h1>
          <p className="text-gray-500">123 Print Street, Lahore, Pakistan</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-semibold uppercase text-gray-700">Invoice</h2>
          <p className="text-gray-500">#{order.id.substring(0, 7).toUpperCase()}</p>
          <p className="text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </header>

      <section className="mb-8">
        <h3 className="font-semibold text-lg mb-2 border-b pb-1">Bill To:</h3>
        <p className="font-bold text-gray-800">{order.customer.name}</p>
        <p className="text-gray-600">{order.customer.phone || 'No phone number'}</p>
      </section>

      <section>
        <table className="w-full text-left mb-8">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Description</th>
              <th className="p-3 text-center">Size (ft)</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Rate</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3">{order.mediaType}</td>
              <td className="p-3 text-center">{order.width} x {order.height}</td>
              <td className="p-3 text-center">{order.quantity}</td>
              <td className="p-3 text-right">Rs. {order.rate.toFixed(2)}</td>
              <td className="p-3 text-right">Rs. {order.totalAmount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="flex justify-end mb-8">
        <div className="w-full md:w-1/3">
          <div className="flex justify-between py-2 border-b">
            <span className="font-semibold text-gray-700">Subtotal</span>
            <span>Rs. {order.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b text-green-600">
            <span className="font-semibold">Amount Paid</span>
            <span>Rs. {order.paidAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 bg-gray-100 rounded-b-lg px-2">
            <span className="font-bold text-lg">Balance Due</span>
            <span className="font-bold text-lg">Rs. {balanceDue.toLocaleString()}</span>
          </div>
        </div>
      </section>

      <footer className="text-center text-gray-500 text-sm">
        <p>Thank you for your business!</p>
        {/* The print button will be hidden when printing */}
        <Button onClick={() => window.print()} className="mt-6 print:hidden">
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
      </footer>
    </div>
  );
}