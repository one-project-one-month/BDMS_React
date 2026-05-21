import { User, Droplets, Heart, CreditCard, Activity, MapPin, Phone, Lock } from "lucide-react";
import useAuth from "@/context/auth/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user } = useAuth();

  // Safely fallback user properties since user object schema varies slightly
  const userId = user?.userId ?? 0;
  const userName = user?.userName || (user as any)?.username || "BDMS Member";
  const email = user?.email || "No email provided";
  const roleName = user?.roleName || "user";
  const permissions = user?.permissions || [];
  const donor = user?.donor || null;

  // Extract avatar initials
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Premium Ambient Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-dark-primary via-slate-950 to-dark-primary rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl border border-white/5 transition-all duration-500 hover:border-white/10">
        <div className="absolute right-0 top-0 size-72 bg-gradient-to-br from-primary/30 to-rose-500/0 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 size-60 bg-gradient-to-tr from-rose-500/15 to-primary/0 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
          {/* Avatar Icon */}
          <div className="size-20 md:size-24 rounded-2xl bg-gradient-to-br from-primary to-dark-primary flex items-center justify-center text-3xl font-extrabold shadow-lg text-white ring-4 ring-white/10 shrink-0">
            {initials || "US"}
          </div>

          <div className="space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-white font-extrabold tracking-tight leading-none">
                {userName}
              </h2>
              <Badge className="bg-primary/20 text-rose-200 border border-primary/30 uppercase text-xs px-2.5 py-0.5 rounded-full font-bold">
                {roleName}
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                Active Account
              </Badge>
            </div>
            <Typography className="text-slate-300 text-sm md:text-base font-medium flex items-center justify-center md:justify-start gap-1.5">
              <User className="size-4 text-slate-400" />
              User ID: #{userId} • {email}
            </Typography>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Digital Donor Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          {donor ? (
            <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 text-white shadow-xl border-0 transition-transform duration-300 hover:scale-[1.02] rounded-2xl">
              <div className="absolute right-0 top-0 size-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -left-12 -bottom-12 size-36 bg-black/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex justify-between items-start pb-6 border-b border-white/20">
                <div className="space-y-0.5">
                  <span className="text-red-100 text-[10px] font-bold uppercase tracking-widest">BDMS Myanmar</span>
                  <h4 className="text-base md:text-lg font-extrabold text-white">Donor ID Card</h4>
                </div>
                <div className="bg-white/15 p-2 rounded-xl border border-white/10 backdrop-blur-md">
                  <CreditCard className="size-5 text-white" />
                </div>
              </div>

              {/* Blood droplet overlay */}
              <div className="pt-6 pb-4 flex justify-between items-center relative z-10">
                <div className="space-y-1">
                  <span className="text-red-200 text-xs font-semibold block">DONOR NAME</span>
                  <span className="text-lg font-bold tracking-wide uppercase">{userName}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white text-rose-600 px-3.5 py-1.5 rounded-2xl shadow-lg font-black text-xl border border-white/20">
                  <Droplets className="size-5 fill-rose-600 animate-pulse" />
                  {donor.bloodGroup}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5 text-xs pt-4 border-t border-white/10 relative z-10">
                <div>
                  <span className="text-red-200 block font-semibold">NIC NUMBER</span>
                  <span className="font-mono font-bold text-white text-sm">{donor.nicNo}</span>
                </div>
                <div>
                  <span className="text-red-200 block font-semibold">GENDER</span>
                  <span className="font-bold text-white uppercase text-sm">{donor.gender}</span>
                </div>
                <div>
                  <span className="text-red-200 block font-semibold">DATE OF BIRTH</span>
                  <span className="font-bold text-white text-sm">{donor.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-red-200 block font-semibold">LAST DONATED</span>
                  <span className="font-bold text-white text-sm">{donor.lastDonationDate || "Never"}</span>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center space-y-4 border border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors duration-300 rounded-2xl">
              <Heart className="size-12 mx-auto text-primary/60 stroke-[1.5] animate-pulse" />
              <div className="space-y-1.5">
                <Typography className="font-bold text-foreground">Not Registered as a Donor</Typography>
                <Typography className="text-xs text-muted-foreground max-w-xs mx-auto">
                  You are registered as a system user. Registering as a blood donor allows you to book donation appointments and save lives.
                </Typography>
              </div>
            </Card>
          )}

          {/* Account Details Panel */}
          <Card className="p-5 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl space-y-4 border border-muted/50">
            <CardHeader className="p-0 pb-3 border-b flex flex-row items-center gap-2">
              <Activity className="size-4.5 text-primary" />
              <Typography className="font-bold text-sm text-foreground">Account Diagnostics</Typography>
            </CardHeader>
            <CardContent className="p-0 space-y-3 pt-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Account Status:</span>
                <span className="text-emerald-500 font-bold">Verified</span>
              </div>
              <div className="flex justify-between">
                <span>Login Role:</span>
                <span className="font-semibold text-foreground capitalize">{roleName}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Level:</span>
                <span className="font-semibold text-foreground">TLS 1.3 Mapped</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Columns: Primary details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Profiles */}
          <Card className="p-6 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border border-muted/50">
            <CardHeader className="flex flex-row items-center gap-2 pb-4 border-b">
              <User className="size-5 text-primary" />
              <Typography variant="body" className="font-bold text-foreground">
                Personal Profile Specifications
              </Typography>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block mb-1">Full Legal Name</span>
                  <Typography className="font-semibold text-foreground">{userName}</Typography>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block mb-1">Primary Email Address</span>
                  <Typography className="font-semibold text-foreground">{email}</Typography>
                </div>
              </div>

              {donor && (
                <div className="space-y-6 pt-4 border-t border-muted/60">
                  <Typography variant="body" className="font-bold text-primary">
                    Donor Specifications
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground block mb-1">Physical Address</span>
                      <Typography className="font-semibold text-foreground flex items-start gap-1">
                        <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                        {donor.address || "No address declared."}
                      </Typography>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground block mb-1">Emergency Contact Person</span>
                        <Typography className="font-semibold text-foreground">
                          {donor.emergencyContact || "No contact registered."}
                        </Typography>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground block mb-1">Emergency Phone Number</span>
                        <Typography className="font-semibold text-foreground flex items-center gap-1">
                          <Phone className="size-4 text-muted-foreground" />
                          {donor.emergencyPhone || "No phone registered."}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Security Permissions Badge Section */}
          <Card className="p-6 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border border-muted/50">
            <CardHeader className="flex flex-row items-center gap-2 pb-4 border-b">
              <Lock className="size-5 text-primary" />
              <Typography variant="body" className="font-bold text-foreground">
                Active System Capabilities & Authorization
              </Typography>
            </CardHeader>
            <CardContent className="pt-6">
              <Typography className="text-xs text-muted-foreground mb-4">
                The following security keys are verified and authorized for your account based on your active role.
              </Typography>
              {permissions.length === 0 ? (
                <Typography className="text-sm text-muted-foreground italic">No specialized roles assigned.</Typography>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {permissions.map((perm) => (
                    <Badge key={perm} variant="secondary" className="font-mono text-[11px] px-2.5 py-1 border rounded-md hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200 cursor-default">
                      {perm}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
