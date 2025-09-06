"use client"; // This component uses client-side hooks, so this is needed
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
// NEW: Import the usePathname hook to detect the current page
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Package,
  Settings,
  UserRoundSearch,
  LogOut
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({ children }) {
  // NEW: Get the current URL path
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar Navigation */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span>PrintShop POS</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {/* UPDATED: Links now have conditional classNames for highlighting */}
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === "/dashboard" ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/orders"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname.startsWith("/orders") ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
              >
                <Package className="h-4 w-4" />
                Orders
              </Link>
              <Link
                href="/customers"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === "/customers" ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
              >
                <Users className="h-4 w-4" />
                Customers
              </Link>
              <Link
                href="/settings"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === "/settings" ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
               <Link
    href="/track-customer"
    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
      pathname === "/track-customer" ? "bg-muted text-primary" : "text-muted-foreground"
    }`}
  >
    <UserRoundSearch className="h-4 w-4" />
    Find Customer 
  </Link>
            </nav>
          </div>
          <Button 
                variant="ghost" 
                size="icon" 
                className="ml-auto"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className="h-4 w-4" />
              </Button>
        </div>
        
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            {/* Header content can go here */}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
      
      {/* ADDED: The Toaster component for notifications */}
      <Toaster richColors />
    </div>
  );
}