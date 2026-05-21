import { useQuery } from "@tanstack/react-query";
import { Users, Droplets, HeartHandshake, ClipboardList, RefreshCw, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import useAuth from "@/context/auth/useAuth";
import { getAdminDashboardQueryOptions } from "../queries/adminDashboardQueries";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const userId = user?.userId ?? 0;

  const { data: metrics, isPending, isError, refetch } = useQuery(
    getAdminDashboardQueryOptions(userId)
  );

  if (isPending) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground">
        <RefreshCw className="size-8 animate-spin text-primary mb-3" />
        <Typography>Loading system analytics...</Typography>
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <Card className="p-8 max-w-lg mx-auto mt-12 text-center space-y-4">
        <Typography variant="h3" className="text-destructive">Failed to Load Dashboard</Typography>
        <Typography className="text-muted-foreground">
          An error occurred while connecting to the C# Web API. Ensure your backend is running.
        </Typography>
        <Button onClick={() => refetch()} className="mx-auto gap-2">
          <RefreshCw className="size-4" />
          Try Again
        </Button>
      </Card>
    );
  }

  // Pre-populate standard groups in case they aren't returned
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const stockMap = new Map(metrics.bloodStock.map(s => [s.bloodGroup, s.units]));

  // Calculate max stock unit to scale indicators
  const maxStock = Math.max(...metrics.bloodStock.map(s => s.units), 10);

  // Calculate max monthly count to scale trend bars
  const maxTrendVal = Math.max(
    ...metrics.monthlyTrends.flatMap(t => [t.donations, t.requests]),
    5
  );

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Typography as="h1" variant="subtitle" className="capitalize">
            Welcome back, {user?.username || "Officer"}
          </Typography>
          <Typography className="text-muted-foreground text-sm mt-1">
            System overview and quick controls for the Blood Donation Management platform.
          </Typography>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2 border-primary/20 text-primary">
          <RefreshCw className="size-4" />
          Refresh Stats
        </Button>
      </header>

      {/* Metric Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Donors */}
        <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg border-0 transition-transform duration-300 hover:scale-[1.02]">
          <div className="absolute right-3 top-3 size-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-red-100 text-xs font-bold uppercase tracking-wider">Registered Donors</span>
              <Typography className="text-4xl font-extrabold text-white">{metrics.totalDonors}</Typography>
            </div>
            <Users className="size-6 text-red-100" />
          </div>
          <div className="mt-6 flex justify-between items-center text-xs text-red-100">
            <span>Active donor database records</span>
            <Link to="/admin/donors" className="flex items-center gap-1 hover:underline text-white font-semibold">
              View Donors <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </Card>

        {/* Card 2: Completed Donations */}
        <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg border-0 transition-transform duration-300 hover:scale-[1.02]">
          <div className="absolute right-3 top-3 size-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Successful Donations</span>
              <Typography className="text-4xl font-extrabold text-white">{metrics.totalDonations}</Typography>
            </div>
            <HeartHandshake className="size-6 text-emerald-100" />
          </div>
          <div className="mt-6 flex justify-between items-center text-xs text-emerald-100">
            <span>Completed units stored</span>
            <Link to="/admin/donations" className="flex items-center gap-1 hover:underline text-white font-semibold">
              View Donations <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </Card>

        {/* Card 3: Active Requests */}
        <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg border-0 transition-transform duration-300 hover:scale-[1.02]">
          <div className="absolute right-3 top-3 size-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-blue-100 text-xs font-bold uppercase tracking-wider">Patient Blood Requests</span>
              <Typography className="text-4xl font-extrabold text-white">{metrics.totalBloodRequests}</Typography>
            </div>
            <ClipboardList className="size-6 text-blue-100" />
          </div>
          <div className="mt-6 flex justify-between items-center text-xs text-blue-100">
            <span>Registered patient requests</span>
            <Link to="/admin/blood-requests" className="flex items-center gap-1 hover:underline text-white font-semibold">
              View Requests <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </Card>
      </section>

      {/* Main Analysis Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Real-Time Blood Availability stock progress */}
        <Card className="lg:col-span-2 p-6 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-2">
              <Droplets className="size-5 text-red-500" />
              <Typography variant="body" className="font-bold text-foreground">
                Real-Time Available Blood Stocks (Units)
              </Typography>
            </div>
            <Link to="/admin/blood-inventories" className="text-xs font-semibold text-primary hover:underline">
              Manage Inventory
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {bloodGroups.map((group) => {
                const units = stockMap.get(group) ?? 0;
                const percentage = (units / maxStock) * 100;
                return (
                  <div key={group} className="flex flex-col items-center gap-2 p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors">
                    <span className="text-base font-bold text-primary">{group}</span>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{units} Unit(s)</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right Side: Visual 6-Month Trend Chart */}
        <Card className="p-6 shadow-sm">
          <CardHeader className="pb-4 border-b">
            <Typography variant="body" className="font-bold text-foreground">
              6-Month Monthly Trends
            </Typography>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="size-3 bg-emerald-500 rounded-sm" />
                <span>Donations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3 bg-blue-500 rounded-sm" />
                <span>Requests</span>
              </div>
            </div>

            {/* Custom Bar Graph */}
            <div className="space-y-4">
              {metrics.monthlyTrends.map((t) => {
                const donationHeight = (t.donations / maxTrendVal) * 100;
                const requestHeight = (t.requests / maxTrendVal) * 100;

                return (
                  <div key={t.month} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground w-8">{t.month}</span>
                    <div className="flex-1 space-y-1">
                      {/* Donations bar */}
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 rounded-sm bg-emerald-500" style={{ width: `${Math.max(donationHeight, 2)}%` }} />
                        <span className="text-[10px] text-muted-foreground font-bold">{t.donations}</span>
                      </div>
                      {/* Requests bar */}
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 rounded-sm bg-blue-500" style={{ width: `${Math.max(requestHeight, 2)}%` }} />
                        <span className="text-[10px] text-muted-foreground font-bold">{t.requests}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
