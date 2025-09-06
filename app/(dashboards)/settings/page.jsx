"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [mediaTypes, setMediaTypes] = useState([]);
  const [newTypeName, setNewTypeName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchMediaTypes = async () => {
    setIsLoading(true);
    const response = await fetch('/api/media-types');
    const data = await response.json();
    setMediaTypes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMediaTypes();
  }, []);

  const handleAddMediaType = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    await fetch('/api/media-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTypeName }),
    });
    setNewTypeName("");
    fetchMediaTypes(); // Refetch the list
  };

  const handleDeleteMediaType = async (id) => {
    await fetch(`/api/media-types/${id}`, {
      method: 'DELETE',
    });
    fetchMediaTypes(); // Refetch the list
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Media Types</CardTitle>
          <CardDescription>Add or remove the types of media you offer.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMediaType} className="flex items-center gap-2 mb-4">
            <Input
              placeholder="e.g., Canvas Print"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
            />
            <Button type="submit">Add New</Button>
          </form>

          <div className="space-y-2">
            {isLoading ? <p>Loading...</p> : Array.isArray(mediaTypes) && mediaTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between p-2 border rounded-lg">
                <span>{type.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteMediaType(type.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}