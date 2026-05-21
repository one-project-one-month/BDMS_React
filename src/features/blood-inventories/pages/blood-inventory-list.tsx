import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Droplet, RefreshCw, Plus, MinusCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  getBloodInventoriesQueryOptions,
  getAvailableStockQueryOptions,
  bloodInventoryKeys,
} from "../queries";
import {
  consumeBloodBag,
  addDonationToInventory,
  runStockTake,
} from "../api/blood-inventory.api";
import type { BloodInventory } from "../blood-inventory.types";
import { getHospitalsQueryOptions } from "@/features/hospitals/queries/hospitalQueries";

export default function BloodInventoryListPage() {
  const queryClient = useQueryClient();

  // Filters State
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [hospitalFilter, setHospitalFilter] = useState<string>("all");

  // Fetch queries
  const { data: ledger = [], isPending: isLedgerPending } = useQuery(getBloodInventoriesQueryOptions);
  const { data: availableStock = [] } = useQuery(getAvailableStockQueryOptions());
  const { data: hospitals = [] } = useQuery(getHospitalsQueryOptions);

  // Dialog States
  const [addOpen, setAddOpen] = useState(false);
  const [donationIdInput, setDonationIdInput] = useState("");

  const [consumeOpen, setConsumeOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<BloodInventory | null>(null);
  const [requestIdInput, setRequestIdInput] = useState("");

  // Mutations
  const addMutation = useMutation({
    mutationFn: addDonationToInventory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.all });
      toast.success(`Donation #${data.donationId} successfully added to inventory!`, { position: "bottom-right" });
      setAddOpen(false);
      setDonationIdInput("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add donation to inventory. Ensure the donation is marked as completed.", { position: "bottom-right" });
    },
  });

  const consumeMutation = useMutation({
    mutationFn: consumeBloodBag,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.all });
      toast.success(`Blood bag #${data.id} marked as Used for Request #${data.requestId}!`, { position: "bottom-right" });
      setConsumeOpen(false);
      setSelectedInventory(null);
      setRequestIdInput("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to consume blood bag.", { position: "bottom-right" });
    },
  });

  const stockTakeMutation = useMutation({
    mutationFn: runStockTake,
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.all });
      toast.success(`Stock-take complete! ${count} expired blood bags updated.`, { position: "bottom-right" });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to run stock-take check.", { position: "bottom-right" });
    },
  });

  // Client-Side filtering of full ledger
  const filteredLedger = useMemo(() => {
    return ledger.filter((item) => {
      const matchBloodGroup = bloodGroupFilter === "all" || item.bloodGroup === bloodGroupFilter;
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchHospital = hospitalFilter === "all" || item.hospitalId.toString() === hospitalFilter;
      return matchBloodGroup && matchStatus && matchHospital;
    });
  }, [ledger, bloodGroupFilter, statusFilter, hospitalFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedId = parseInt(donationIdInput, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      toast.error("Please enter a valid Donation ID.");
      return;
    }
    addMutation.mutate(parsedId);
  };

  const handleConsumeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventory) return;
    const parsedRequestId = parseInt(requestIdInput, 10);
    if (isNaN(parsedRequestId) || parsedRequestId <= 0) {
      toast.error("Please enter a valid Request ID.");
      return;
    }
    consumeMutation.mutate({
      inventoryId: selectedInventory.id,
      requestId: parsedRequestId,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-2 py-0.5">Available</Badge>;
      case "Expired":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-2 py-0.5">Expired</Badge>;
      case "Used":
        return <Badge className="bg-slate-400 hover:bg-slate-500 text-white font-medium px-2 py-0.5">Used</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Typography as="h1" variant="subtitle">
            Blood Inventory Management
          </Typography>
          <Typography className="text-muted-foreground text-sm mt-1">
            Track real-time blood stocks, manage shelf-life expirations, and allocate units to patient requests.
          </Typography>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
            onClick={() => stockTakeMutation.mutate(undefined)}
            disabled={stockTakeMutation.isPending}
          >
            <RefreshCw className={`size-4 ${stockTakeMutation.isPending ? "animate-spin" : ""}`} />
            Run Stock-Take
          </Button>
          <Button onClick={() => setAddOpen(true)} className="gap-2 bg-primary hover:bg-primary/95 text-white">
            <Plus className="size-4" />
            Add Donation
          </Button>
        </div>
      </header>

      {/* Aggregate Stock Summary Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => {
          const matchingItem = availableStock.find((s) => s.bloodGroup === group);
          const count = matchingItem ? matchingItem.availableCount : 0;
          return (
            <Card key={group} className="relative overflow-hidden p-4 border-l-4 border-l-red-500 flex flex-col justify-between h-24 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-sm font-bold text-muted-foreground uppercase">{group}</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-extrabold tracking-tight text-foreground">{count}</span>
                <Droplet className={`size-5 ${count > 0 ? "text-red-500 fill-red-500 animate-pulse" : "text-muted-foreground/30"}`} />
              </div>
            </Card>
          );
        })}
      </section>

      {/* Filters and Ledger Table */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Blood Group Filter */}
          <div className="flex-1">
            <Label htmlFor="bloodGroup" className="text-xs font-semibold text-muted-foreground mb-1 block">Blood Group</Label>
            <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
              <SelectTrigger id="bloodGroup">
                <SelectValue placeholder="All Blood Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blood Groups</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex-1">
            <Label htmlFor="status" className="text-xs font-semibold text-muted-foreground mb-1 block">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hospital Filter */}
          <div className="flex-1">
            <Label htmlFor="hospital" className="text-xs font-semibold text-muted-foreground mb-1 block">Hospital</Label>
            <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
              <SelectTrigger id="hospital">
                <SelectValue placeholder="All Hospitals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hospitals</SelectItem>
                {hospitals.map((h) => (
                  <SelectItem key={h.id} value={h.id.toString()}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Button */}
          <div className="flex items-end">
            <Button
              variant="ghost"
              onClick={() => {
                setBloodGroupFilter("all");
                setStatusFilter("all");
                setHospitalFilter("all");
              }}
              className="text-muted-foreground hover:text-foreground text-sm font-semibold"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inventory ID</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Collected Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Allocation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLedgerPending ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    <RefreshCw className="size-5 animate-spin mx-auto mb-2" />
                    Loading blood ledger...
                  </TableCell>
                </TableRow>
              ) : filteredLedger.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No matching inventory records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLedger.map((item) => {
                  const matchingHospital = hospitals.find((h) => h.id === item.hospitalId);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold text-primary"># {item.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold text-red-500 border-red-200 bg-red-50/50">
                          {item.bloodGroup}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.units} Unit(s)</TableCell>
                      <TableCell>{item.collectedAt || "N/A"}</TableCell>
                      <TableCell>
                        <span className={item.status === "Available" && item.expiredAt && new Date(item.expiredAt) < new Date() ? "text-destructive font-bold" : ""}>
                          {item.expiredAt || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>{matchingHospital?.name || `Hospital #${item.hospitalId}`}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {item.requestId ? (
                          <Badge variant="secondary" className="font-medium">Request #{item.requestId}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">Unallocated</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.status === "Available" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary-hover font-semibold text-xs gap-1"
                            onClick={() => {
                              setSelectedInventory(item);
                              setConsumeOpen(true);
                            }}
                          >
                            <MinusCircle className="size-3.5" />
                            Consume
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog: Add Donation */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle>Add Completed Donation to Stock</DialogTitle>
              <DialogDescription>
                Transfer units from a successful donation screening into the available blood stock ledger.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <Label htmlFor="donationId">Donation ID</Label>
              <Input
                id="donationId"
                type="number"
                required
                min="1"
                placeholder="Enter completed Donation ID (e.g. 1)"
                value={donationIdInput}
                onChange={(e) => setDonationIdInput(e.target.value)}
              />
              <span className="text-xs text-muted-foreground italic block">
                Note: Only donations with status "Completed" can be stored.
              </span>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addMutation.isPending} className="bg-primary text-white">
                {addMutation.isPending ? "Adding..." : "Add to Stock"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Consume Blood */}
      <Dialog open={consumeOpen} onOpenChange={setConsumeOpen}>
        <DialogContent>
          <form onSubmit={handleConsumeSubmit}>
            <DialogHeader>
              <DialogTitle>Allocate & Consume Blood Bag</DialogTitle>
              <DialogDescription>
                Fulfill a patient request by marking bag #{selectedInventory?.id} ({selectedInventory?.bloodGroup}) as Used.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <Label htmlFor="requestId">Blood Request ID</Label>
              <Input
                id="requestId"
                type="number"
                required
                min="1"
                placeholder="Enter patient Request ID (e.g. 1)"
                value={requestIdInput}
                onChange={(e) => setRequestIdInput(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setConsumeOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={consumeMutation.isPending} className="bg-red-500 hover:bg-red-600 text-white">
                {consumeMutation.isPending ? "Consuming..." : "Confirm Consumption"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
