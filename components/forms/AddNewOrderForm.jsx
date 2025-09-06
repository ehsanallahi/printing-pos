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
// NEW: Import the CustomerCombobox
import { CustomerCombobox } from "./CustomerCombobox";

export function AddNewOrderForm({ isOpen, setIsOpen, onOrderAdded, onOrderUpdated, initialData }) {
  const isEditMode = Boolean(initialData);
  const [customerName, setCustomerName] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [rate, setRate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  // NEW: State for the dynamic media types list
  const [mediaTypesList, setMediaTypesList] = useState([]);

  // NEW: useEffect to fetch media types from the API
  useEffect(() => {
    const fetchMediaTypes = async () => {
      try {
        const response = await fetch('/api/media-types');
        const data = await response.json();
        if (Array.isArray(data)) {
          setMediaTypesList(data);
        }
      } catch (error) {
        console.error("Failed to fetch media types:", error);
      }
    };
    fetchMediaTypes();
  }, []);

  const clearForm = () => {
    setCustomerName("");
    setMediaType("");
    setWidth("");
    setHeight("");
    setQuantity("1");
    setRate("");
  };

  useEffect(() => {
    if (isEditMode && initialData) {
      setCustomerName(initialData.customer?.name || "");
      setMediaType(initialData.mediaType || "");
      setWidth(String(initialData.width || ""));
      setHeight(String(initialData.height || ""));
      setQuantity(String(initialData.quantity || "1"));
      setRate(String(initialData.rate || ""));
    } else {
      clearForm();
    }
  }, [initialData, isEditMode, isOpen]);

  useEffect(() => {
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const q = parseInt(quantity) || 0;
    const r = parseFloat(rate) || 0;
    const total = w * h * q * r;
    setTotalAmount(total);
  }, [width, height, quantity, rate]);

  const handleSubmit = async () => {
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Order" : "Create New Order"}</DialogTitle>
          <DialogDescription>
            Select a customer and fill in the order details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* CHANGED: Replaced the simple Input with the CustomerCombobox component */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Customer</Label>
            <div className="col-span-3">
              <CustomerCombobox
                value={customerName}
                onValueChange={setCustomerName}
              />
            </div>
          </div>
          
          {/* CHANGED: The media type dropdown is now built dynamically */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="media-type" className="text-right">Media Type</Label>
            <Select onValueChange={setMediaType} value={mediaType}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a type" /></SelectTrigger>
              <SelectContent>
                {mediaTypesList.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="width" className="text-right">Size (ft)</Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <Input id="width" type="number" placeholder="Width" value={width} onChange={(e) => setWidth(e.target.value)} />
              <Input type="number" placeholder="Height" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">Quantity</Label>
            <Input id="quantity" type="number" className="col-span-3" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rate" className="text-right">Rate (sq/ft)</Label>
            <Input id="rate" type="number" className="col-span-3" value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>
          
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