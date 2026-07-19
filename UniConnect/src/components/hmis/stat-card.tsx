import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: { value: number; isUp: boolean };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <p className={cn("text-xs font-medium", trend.isUp ? "text-success" : "text-danger")}>
                {trend.isUp ? "↑" : "↓"} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          <div className="rounded-lg bg-secondary/10 p-2">
            <Icon className="h-5 w-5 text-secondary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
