import { NavLink, Outlet } from "react-router-dom";
import { Shield, Users, KeyRound, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const subNavItems = [
  { label: "Users", path: "/admin/security/users", icon: Users },
  { label: "Roles", path: "/admin/security/roles", icon: KeyRound },
  { label: "Permissions", path: "/admin/security/permissions", icon: Lock },
];

export default function SecurityLayout() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-dark-primary via-slate-950 to-dark-primary p-6 rounded-2xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
              <Shield className="size-6 text-primary" />
            </div>
            <h1 className="text-xl md:text-2xl text-white font-extrabold tracking-tight">
              Security Management
            </h1>
          </div>
          <p className="text-slate-300 text-sm max-w-2xl pl-1">
            Manage system users, define roles, and configure granular permission assignments.
          </p>
        </div>
      </header>

      {/* Sub Navigation */}
      <nav className="flex gap-1 border-b border-border pb-0">
        {subNavItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors duration-200",
                isActive
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Page Content */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
