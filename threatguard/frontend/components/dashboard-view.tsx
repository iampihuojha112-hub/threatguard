"use client";

import Link from "next/link";
import { Gauge, Mail, ShieldAlert, ShieldCheck } from "lucide-react";
import { DailyActivityChart } from "@/components/charts/daily-activity-chart";
import { PhishingPieChart } from "@/components/charts/phishing-pie-chart";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";
import { WeeklyTrendChart } from "@/components/charts/weekly-trend-chart";
import { ErrorState } from "@/components/error-state";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-dashboard";

function ChartCard({ title, description, className, children }: { title: string; description: string; className?: string; children: React.ReactNode }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function DashboardView() {
  const { data, error, loading, reload } = useDashboard();

  if (error) return <ErrorState message={error} onRetry={reload} />;

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  const { metrics } = data;

  return (
    <div className="space-y-6">
      {metrics.total_scans === 0 && (
        <Card className="flex flex-col items-start justify-between gap-4 border-primary/30 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-medium">You have not scanned any emails yet.</p>
            <p className="text-sm text-muted-foreground">Analyze one to start filling these charts.</p>
          </div>
          <Button asChild>
            <Link href="/analyze">Analyze an email</Link>
          </Button>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Emails scanned" value={metrics.total_scans.toLocaleString()} icon={Mail} />
        <StatCard label="Phishing detected" value={metrics.phishing_detected.toLocaleString()} icon={ShieldAlert} tone="danger" />
        <StatCard label="Safe emails" value={metrics.safe_emails.toLocaleString()} icon={ShieldCheck} tone="safe" />
        <StatCard label="Average risk score" value={`${metrics.average_risk_score.toFixed(1)}%`} icon={Gauge} tone="warn" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Weekly trend" description="Phishing and safe emails per week, last 8 weeks">
          <WeeklyTrendChart data={data.weekly_trend} />
        </ChartCard>
        <ChartCard title="Daily activity" description="Emails scanned per day, last 14 days">
          <DailyActivityChart data={data.daily_activity} />
        </ChartCard>
        <ChartCard title="Risk distribution" description="How many scans fall in each risk score range">
          <RiskDistributionChart data={data.risk_distribution} />
        </ChartCard>
        <ChartCard title="Phishing vs safe" description="Share of all scanned emails by verdict">
          <PhishingPieChart data={data.phishing_vs_safe} />
        </ChartCard>
      </div>
    </div>
  );
}
