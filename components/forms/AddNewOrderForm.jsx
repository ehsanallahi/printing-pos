"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddNewOrderForm({ isOpen, setIsOpen, onOrderAdded, onOrderUpdated, initialData }) {
  const isEditMode = Boolean(initialData);
  const [customerName, setCustomerName] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [rate, setRate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (isEditMode && initialData) {
      // Pre-fill form for editing
      setCustomerName(initialData.customer || "");
      setMediaType(initialData.mediaType || "");
      setWidth(String(initialData.width || ""));
      setHeight(String(initialData.height || ""));
      setQuantity(String(initialData.quantity || "1"));
      setRate(String(initialData.rate || ""));
    } else {
      // FIX: Clear form when opening in "create" mode
      clearForm();
    }
  }, [initialData, isEditMode, isOpen]); // Added isOpen to reset form on open

  useEffect(() => {
    // Auto-calculates the total amount
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const q = parseInt(quantity) || 0;
    const r = parseFloat(rate) || 0;
    const total = w * h * q * r;
    setTotalAmount(total);
  }, [width, height, quantity, rate]);

  const clearForm = () => {
    setCustomerName("");
    setMediaType("");
    setWidth("");
    setHeight("");
    setQuantity("1");
    setRate("");
  };

  const handleSubmit = async () => {
    // FIX: Populate the orderData object with the current form state.
    const orderData = {
      customer: customerName,
      mediaType: mediaType,
      width: parseFloat(width),
      height: parseFloat(height),
      quantity: parseInt(quantity),
      rate: parseFloat(rate),
      totalAmount: totalAmount,
    };

    if (isEditMode) {
      const response = await fetch(`/api/orders/${initialData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const updatedOrder = await response.json();
      onOrderUpdated(updatedOrder);
    } else {
      // FIX: Completed the fetch call for creating a new order.
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      onOrderAdded();
    }

    setIsOpen(false);
  };

  return (
    // The Dialog is now controlled entirely by props from the parent
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* FIX: Removed the <DialogTrigger> and its Button. The parent page now opens this dialog. */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Order" : "Create New Order"}</DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        {/* The Form Fields */}
        <div className="grid gap-4 py-4">
          {/* Customer Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Customer</Label>
            <Input id="name" placeholder="e.g. Ali Ahmed" className="col-span-3" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>
          {/* Media Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="media-type" className="text-right">Media Type</Label>
            <Select onValueChange={setMediaType} value={mediaType}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Flex Banner">Flex Banner</SelectItem>
                <SelectItem value="Vinyl Sticker">Vinyl Sticker</SelectItem>
                <SelectItem value="Poster Print">Poster Print</SelectItem>
                <SelectItem value="Panaflex">Panaflex</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Size */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="width" className="text-right">Size (ft)</Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <Input id="width" type="number" placeholder="Width" value={width} onChange={(e) => setWidth(e.target.value)} />
              <Input type="number" placeholder="Height" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
          </div>
          {/* Quantity */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">Quantity</Label>
            <Input id="quantity" type="number" className="col-span-3" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          {/* Rate */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rate" className="text-right">Rate (sq/ft)</Label>
            <Input id="rate" type="number" className="col-span-3" value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>
          {/* Total */}
          <div className="text-right font-bold text-lg pr-4">
            Total: Rs. {totalAmount.toFixed(2)}
          </div>
        </div>
        
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? "Save Changes" : "Create Order"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}