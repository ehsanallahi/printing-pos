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

export function CustomerForm({ isOpen, setIsOpen, onCustomerAdded, onCustomerUpdated, initialData })  {
  const isEditMode = Boolean(initialData);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.name || "");
      setPhone(initialData.phone || "");
    } else {
      setName("");
      setPhone("");
    }
  }, [initialData, isEditMode, isOpen]);

  const handleSubmit = async () => {
    const customerData = { name, phone };

    if (isEditMode) {
  // Update logic
  const response = await fetch(`/api/customers/${initialData.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerData),
  });
  const updatedCustomer = await response.json();
  onCustomerUpdated(updatedCustomer); // Tell the parent page
} else {
//...
      // Logic to create a new customer
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });
      onCustomerAdded(); // Tell the parent page to refresh its list
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Customer" : "Create New Customer"}</DialogTitle>
          <DialogDescription>
            Enter the customer's details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" placeholder="e.g. Sana Iqbal" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input id="phone" placeholder="0300-1234567" className="col-span-3" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? "Save Changes" : "Create Customer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}