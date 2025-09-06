"use client";
import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CustomerCombobox({ value, onValueChange }) {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchAllCustomers = async () => {
      try {
        const response = await fetch('/api/customers/list');
        const data = await response.json();
        if (Array.isArray(data)) {
          setCustomers(data);
        }
      } catch (error) {
        console.error("Failed to fetch customers for combobox:", error);
      }
    };
    fetchAllCustomers();
  }, []);

  const selectedCustomer = customers.find(
    (customer) => customer.name.toLowerCase() === value?.toLowerCase()
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10"
        >
          {selectedCustomer ? (
            <div className="flex flex-col items-start">
              <span className="font-semibold">{selectedCustomer.name}</span>
              <span className="text-xs text-muted-foreground -mt-1">
                {selectedCustomer.phone || 'No phone'}
              </span>
            </div>
          ) : (
            "Select customer..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search by name or phone..." />
          <CommandList>
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup>
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  // UPDATED: The searchable value now contains both name and phone
                  value={`${customer.name} ${customer.phone}`}
                  // UPDATED: onSelect now correctly passes only the name back to the form
                  onSelect={() => {
                    onValueChange(customer.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", value === customer.name ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex flex-col">
                    <span>{customer.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {customer.phone || 'No phone'}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}