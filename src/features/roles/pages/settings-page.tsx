import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, Search, Lock, CheckCircle2, AlertTriangle, RefreshCw, Filter } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { getRolesQueryOptions } from "../queries/roleQueries";
import {
  permissionsQueryOptions,
  rolePermissionsQueryOptions,
  useCreateRolePermissionMutation,
  useDeleteRolePermissionMutation,
  rolePermissionKeys,
} from "../queries/rolePermissionQueries";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [pendingToggles, setPendingToggles] = useState<Record<string, boolean>>({});

  // Fetch roles, permissions, and active matrix mappings
  const { data: roles, isPending: loadingRoles, isError: errorRoles } = useQuery(getRolesQueryOptions);
  const { data: permissions, isPending: loadingPerms, isError: errorPerms } = useQuery(permissionsQueryOptions);
  const { data: mappings, isPending: loadingMappings, isError: errorMappings } = useQuery(rolePermissionsQueryOptions);

  const createMutation = useCreateRolePermissionMutation();
  const revokeMutation = useDeleteRolePermissionMutation();

  const isPending = loadingRoles || loadingPerms || loadingMappings;
  const isError = errorRoles || errorPerms || errorMappings;

  // 1. Organize permissions by category
  const categories = useMemo(() => {
    if (!permissions) return {};
    const map: Record<string, typeof permissions> = {};
    permissions.forEach((p) => {
      let cat = "Other";
      if (p.name.startsWith("users.")) cat = "Users";
      else if (p.name.startsWith("donors.")) cat = "Donors";
      else if (p.name.startsWith("hospitals.")) cat = "Hospitals";
      else if (p.name.startsWith("blood_requests.")) cat = "Blood Requests";
      else if (p.name.startsWith("donations.")) cat = "Donations";
      else if (p.name.startsWith("appointments.")) cat = "Appointments";
      else if (p.name.startsWith("medical_records.")) cat = "Medical Records";
      else if (p.name.startsWith("blood_inventories.")) cat = "Blood Inventories";
      else if (p.name.startsWith("announcements.")) cat = "Announcements";
      else if (p.name.startsWith("certificates.")) cat = "Certificates";
      else if (p.name.startsWith("roles.") || p.name.startsWith("permissions.")) cat = "Security Settings";

      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    });
    return map;
  }, [permissions]);

  // 2. Filter permissions based on search term & category selection
  const filteredPermissions = useMemo(() => {
    if (!permissions) return [];
    return permissions.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (activeCategory === "all") return matchesSearch;

      let cat = "Other";
      if (p.name.startsWith("users.")) cat = "Users";
      else if (p.name.startsWith("donors.")) cat = "Donors";
      else if (p.name.startsWith("hospitals.")) cat = "Hospitals";
      else if (p.name.startsWith("blood_requests.")) cat = "Blood Requests";
      else if (p.name.startsWith("donations.")) cat = "Donations";
      else if (p.name.startsWith("appointments.")) cat = "Appointments";
      else if (p.name.startsWith("medical_records.")) cat = "Medical Records";
      else if (p.name.startsWith("blood_inventories.")) cat = "Blood Inventories";
      else if (p.name.startsWith("announcements.")) cat = "Announcements";
      else if (p.name.startsWith("certificates.")) cat = "Certificates";
      else if (p.name.startsWith("roles.") || p.name.startsWith("permissions.")) cat = "Security Settings";

      return matchesSearch && cat === activeCategory;
    });
  }, [permissions, searchTerm, activeCategory]);

  // 3. Helper to check if a permission is mapped to a role
  const isMapped = (roleId: number, permissionId: number) => {
    if (!mappings) return false;
    return mappings.some((m) => m.roleId === roleId && m.permissionId === permissionId);
  };

  // 4. Toggle role-permission mapping in C# database
  const handleToggle = async (roleId: number, roleName: string, permissionId: number, permName: string) => {
    const key = `${roleId}-${permissionId}`;
    const currentlyActive = isMapped(roleId, permissionId);

    // Optimistically update or track loader state
    setPendingToggles((prev) => ({ ...prev, [key]: true }));

    try {
      if (currentlyActive) {
        // Admin cannot revoke critical user/roles permissions from themselves to prevent lockout
        if (roleName === "admin" && (permName === "permissions.manage" || permName === "roles.update")) {
          toast.error("Administrators cannot revoke their own management permissions.", {
            position: "bottom-right",
          });
          return;
        }

        await revokeMutation.mutateAsync({ roleId, permissionId });
        toast.success(`Revoked permission '${permName}' from '${roleName}'`, {
          position: "bottom-right",
        });
      } else {
        await createMutation.mutateAsync({ roleId, permissionId });
        toast.success(`Granted permission '${permName}' to '${roleName}'`, {
          position: "bottom-right",
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update role permission.", {
        position: "bottom-right",
      });
    } finally {
      setPendingToggles((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: rolePermissionKeys.all });
    toast.success("Permissions updated from C# server.", { position: "bottom-right" });
  };

  if (isPending) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground">
        <RefreshCw className="size-8 animate-spin text-primary mb-3" />
        <Typography>Loading roles & permission mappings...</Typography>
      </div>
    );
  }

  if (isError || !roles || !permissions) {
    return (
      <Card className="p-8 max-w-lg mx-auto mt-12 text-center space-y-4">
        <h3 className="text-xl font-bold text-destructive flex items-center justify-center gap-2">
          <AlertTriangle className="size-6" /> Configuration Sync Failure
        </h3>
        <Typography className="text-muted-foreground">
          An error occurred while connecting to the C# authorization controllers.
        </Typography>
        <Button onClick={handleRefresh} className="mx-auto gap-2">
          <RefreshCw className="size-4" /> Try Again
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-lg text-primary-foreground border border-primary/30">
              <Shield className="size-6 text-indigo-400" />
            </div>
            <h3 className="text-xl md:text-2xl text-white font-extrabold tracking-tight">
              Role & Permissions Matrix
            </h3>
          </div>
          <Typography className="text-slate-300 text-sm max-w-2xl">
            Configure system authorization profiles. Enable or disable granular capabilities for System Roles. 
            Changes are persisted in real-time to the database.
          </Typography>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white font-semibold">
          <RefreshCw className="size-4" />
          Fetch Live DB
        </Button>
      </header>

      {/* Control Panel Grid */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search permissions..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            onClick={() => setActiveCategory("all")}
            size="sm"
            className="h-8 gap-1 rounded-full text-xs font-semibold"
          >
            <Filter className="size-3" /> All
          </Button>
          {Object.keys(categories).map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              size="sm"
              className="h-8 rounded-full text-xs font-semibold"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Matrix Table */}
      <Card className="shadow-lg overflow-hidden border-0 bg-card/60 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/80">
                <th className="p-4 text-sm font-bold text-muted-foreground w-1/3">Granular Permission Code</th>
                {roles.map((role) => (
                  <th key={role.id} className="p-4 text-sm font-bold text-center text-muted-foreground uppercase tracking-wider">
                    <span className="inline-block px-3 py-1 bg-primary/5 rounded-full border border-primary/10 text-primary">
                      {role.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPermissions.length === 0 ? (
                <tr>
                  <td colSpan={roles.length + 1} className="p-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Lock className="size-8 text-muted-foreground/50" />
                      <Typography>No permissions match your search or filter.</Typography>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPermissions.map((perm) => {
                  return (
                    <tr
                      key={perm.id}
                      className="border-b border-border/50 hover:bg-muted/10 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="font-mono text-sm font-semibold text-foreground/90 bg-muted/60 px-2 py-0.5 rounded border border-border">
                            {perm.name}
                          </span>
                          <p className="text-xs text-muted-foreground pl-1">
                            System capability for '{perm.name.split(".")[0]}' feature zone.
                          </p>
                        </div>
                      </td>
                      {roles.map((role) => {
                        const toggleKey = `${role.id}-${perm.id}`;
                        const isChecked = isMapped(role.id, perm.id);
                        const loading = pendingToggles[toggleKey];

                        return (
                          <td key={role.id} className="p-4 text-center">
                            <div className="flex justify-center items-center">
                              <label className="relative flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-slate-100 transition-colors">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  disabled={loading}
                                  onChange={() => handleToggle(role.id, role.name, perm.id, perm.name)}
                                  className="peer sr-only"
                                />
                                {loading ? (
                                  <RefreshCw className="size-5 animate-spin text-primary" />
                                ) : isChecked ? (
                                  <CheckCircle2 className="size-5 text-emerald-500 hover:text-emerald-600 transition-colors scale-110" />
                                ) : (
                                  <div className="size-5 rounded border border-input bg-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring hover:border-slate-400 transition-colors" />
                                )}
                              </label>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
