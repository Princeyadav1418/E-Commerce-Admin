"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders`);
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    String(order.customerName ?? "").toLowerCase().includes(search.toLowerCase()) ||
    String(order.customerEmail ?? "").toLowerCase().includes(search.toLowerCase()) ||
    String(order._id ?? "").toLowerCase().includes(search.toLowerCase())
  );
  const handleExport = () => {
    const headers = ["Order ID", "Customer Name", "Email", "Date", "Status", "Items", "Total"];
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map((o) =>
        `"${o._id}","${o.customerName}","${o.customerEmail}","${new Date(o.createdAt).toLocaleDateString()}","${String(o.status).replace("_", " ")}","${(o.items ?? []).length}","${o.totalAmount}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "processing": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "shipped": return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      case "delivered": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search orders..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card text-card-foreground">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px] ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded-md bg-transparent" /></TableCell>
                </TableRow>
              ))
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {filteredOrders.map((order) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setSheetOpen(true);
                    }}
                  >
                    <TableCell className="font-medium">#{order._id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.customerName}</span>
                        <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)} variant="outline">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                        setSheetOpen(true);
                      }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Order Details</SheetTitle>
            <SheetDescription>
              {selectedOrder && `Order #${selectedOrder._id.slice(-6).toUpperCase()}`}
            </SheetDescription>
          </SheetHeader>
          
          {selectedOrder && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm">Customer</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Status</h4>
                  <Badge className={getStatusColor(selectedOrder.status)} variant="outline">
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold text-sm mb-4">Items</h4>
                <div className="space-y-4">
                  {(selectedOrder.items || []).map((item: any) => (
                    <div key={item._id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">Product ID: {typeof item.productId === 'object' ? item.productId.title : item.productId}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                      </div>
                      <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                  {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                    <p className="text-sm text-muted-foreground">No items in this order.</p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>${selectedOrder.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
