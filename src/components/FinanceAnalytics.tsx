import { useMemo } from "react";
import { mockStudents, mockProperties } from "@/lib/mockData";
import { mockExpenses, mockMaintenanceRequests, type ExpenseRecord } from "@/lib/mockNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertTriangle, TrendingUp, TrendingDown, Building2, Users,
  ShieldAlert, ArrowUpCircle, ArrowDownCircle, PlusCircle
} from "lucide-react";

function getStudentRentPaid(studentId: string): boolean {
  for (const property of mockProperties) {
    for (const unit of property.units) {
      for (const room of unit.rooms) {
        if (room.studentId === studentId) return room.rentPaid;
      }
    }
  }
  return false;
}

interface Props {
  expenses: ExpenseRecord[];
}

const FinanceAnalytics = ({ expenses }: Props) => {
  const analytics = useMemo(() => {
    const allocatedStudents = mockStudents.filter((s) => s.allocation);
    const totalRooms = mockProperties.reduce(
      (sum, p) => sum + p.units.reduce((us, u) => us + u.rooms.length, 0), 0
    );
    const occupiedRooms = mockProperties.reduce(
      (sum, p) => sum + p.units.reduce((us, u) => us + u.rooms.filter((r) => r.status === "occupied").length, 0), 0
    );
    const availableRooms = totalRooms - occupiedRooms;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    // Tenant liability analysis
    const tenantRisk = allocatedStudents.map((s) => {
      const paid = getStudentRentPaid(s.id);
      const isNsfas = s.fundingMethod === "NSFAS";
      // NSFAS students who haven't paid are higher risk due to delayed payments
      const riskLevel = !paid ? (isNsfas ? "medium" : "high") : "low";
      const maintenanceCount = mockMaintenanceRequests.filter((m) => m.studentId === s.id).length;
      return {
        ...s,
        paid,
        riskLevel,
        maintenanceCount,
        monthlyRent: s.allocation?.monthlyRent || 0,
      };
    });

    const liabilityTenants = tenantRisk.filter((t) => t.riskLevel !== "low");

    // Property profitability
    const propertyAnalysis = mockProperties.map((prop) => {
      const propExpenses = expenses.filter((e) => e.propertyId === prop.id);
      const propMaintenance = mockMaintenanceRequests.filter((m) => m.propertyId === prop.id);
      const totalExpense = propExpenses.reduce((s, e) => s + e.amount, 0) +
        propMaintenance.filter((m) => m.cost).reduce((s, m) => s + (m.cost || 0), 0);
      const rooms = prop.units.flatMap((u) => u.rooms);
      const occupiedCount = rooms.filter((r) => r.status === "occupied").length;
      const monthlyIncome = rooms.filter((r) => r.status === "occupied").reduce((s, r) => s + r.monthlyRent, 0);
      const avgRent = rooms.length > 0 ? rooms.reduce((s, r) => s + r.monthlyRent, 0) / rooms.length : 0;
      const marketAvg = 5000; // Simulated market average
      const rentBelowMarket = avgRent < marketAvg;

      return {
        id: prop.id,
        name: prop.name,
        totalRooms: rooms.length,
        occupied: occupiedCount,
        occupancyRate: rooms.length > 0 ? (occupiedCount / rooms.length) * 100 : 0,
        monthlyIncome,
        totalExpense,
        netIncome: monthlyIncome - totalExpense,
        avgRent,
        rentBelowMarket,
        maintenanceCount: propMaintenance.length,
      };
    });

    // Cost category breakdown
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const totalExpenseAmount = expenses.reduce((s, e) => s + e.amount, 0);

    // Capacity assessment
    const totalMonthlyIncome = propertyAnalysis.reduce((s, p) => s + p.monthlyIncome, 0);
    const totalMonthlyExpense = expenses.reduce((s, e) => s + e.amount, 0);
    const maintenanceCosts = mockMaintenanceRequests.filter((r) => r.cost).reduce((s, r) => s + (r.cost || 0), 0);
    const profitMargin = totalMonthlyIncome > 0 ? ((totalMonthlyIncome - totalMonthlyExpense - maintenanceCosts) / totalMonthlyIncome) * 100 : 0;
    const canTakeNewProperties = profitMargin > 20 && occupancyRate > 70;

    return {
      totalRooms, occupiedRooms, availableRooms, occupancyRate,
      tenantRisk, liabilityTenants,
      propertyAnalysis, sortedCategories, totalExpenseAmount,
      totalMonthlyIncome, totalMonthlyExpense, maintenanceCosts, profitMargin,
      canTakeNewProperties,
    };
  }, [expenses]);

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Occupancy Rate</p>
                <p className="text-2xl font-serif">{analytics.occupancyRate.toFixed(0)}%</p>
              </div>
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <Progress value={analytics.occupancyRate} className="mt-2 h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.occupiedRooms}/{analytics.totalRooms} rooms occupied
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Profit Margin</p>
                <p className="text-2xl font-serif">{analytics.profitMargin.toFixed(1)}%</p>
              </div>
              {analytics.profitMargin > 20 ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Income R{analytics.totalMonthlyIncome.toLocaleString()} − Costs R{(analytics.totalMonthlyExpense + analytics.maintenanceCosts).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">At-Risk Tenants</p>
                <p className="text-2xl font-serif">{analytics.liabilityTenants.length}</p>
              </div>
              <ShieldAlert className="h-5 w-5 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unpaid tenants needing early reminders
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">New Property Capacity</p>
                <p className="text-2xl font-serif">{analytics.canTakeNewProperties ? "Yes" : "No"}</p>
              </div>
              <PlusCircle className={`h-5 w-5 ${analytics.canTakeNewProperties ? "text-success" : "text-destructive"}`} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.canTakeNewProperties
                ? "Healthy margins & occupancy — ready to expand"
                : "Improve margins or occupancy first"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Liability */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Tenant Liability Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.liabilityTenants.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">All tenants are in good standing.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Funding</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Maintenance Issues</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.tenantRisk.filter((t) => t.riskLevel !== "low").map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="uppercase text-xs text-muted-foreground">{t.fundingMethod}</TableCell>
                    <TableCell className="text-muted-foreground">{t.allocation?.propertyName}</TableCell>
                    <TableCell>R{t.monthlyRent.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{t.maintenanceCount}</TableCell>
                    <TableCell>
                      <Badge className={t.riskLevel === "high"
                        ? "bg-destructive/10 text-destructive border-destructive/20 border"
                        : "bg-warning/10 text-warning border-warning/20 border"
                      }>
                        {t.riskLevel === "high" ? "High Risk" : "Medium Risk"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px]">
                      {t.riskLevel === "high"
                        ? "Send immediate payment reminder. Consider early follow-up."
                        : "NSFAS delays likely. Monitor and follow up mid-month."}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Property Profitability & Rent Analysis */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Property Profitability & Rent Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Avg Rent</TableHead>
                <TableHead>Monthly Income</TableHead>
                <TableHead>Total Costs</TableHead>
                <TableHead>Net Income</TableHead>
                <TableHead>Rent Insight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.propertyAnalysis.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={p.occupancyRate} className="h-1.5 w-16" />
                      <span className="text-xs text-muted-foreground">{p.occupied}/{p.totalRooms}</span>
                    </div>
                  </TableCell>
                  <TableCell>R{p.avgRent.toLocaleString()}</TableCell>
                  <TableCell className="text-success">R{p.monthlyIncome.toLocaleString()}</TableCell>
                  <TableCell className="text-destructive">R{p.totalExpense.toLocaleString()}</TableCell>
                  <TableCell className={p.netIncome >= 0 ? "text-success font-medium" : "text-destructive font-medium"}>
                    R{p.netIncome.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {p.rentBelowMarket ? (
                      <div className="flex items-center gap-1 text-xs">
                        <ArrowUpCircle className="h-3 w-3 text-primary" />
                        <span className="text-primary">Consider rent increase</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-success">At market rate</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cost Breakdown & Reduction Insights */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <ArrowDownCircle className="h-5 w-5 text-primary" />
            Cost Breakdown & Reduction Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.sortedCategories.map(([category, amount]) => {
              const pct = analytics.totalExpenseAmount > 0 ? (amount / analytics.totalExpenseAmount) * 100 : 0;
              const isHighCost = pct > 25;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">R{amount.toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs">{pct.toFixed(0)}%</Badge>
                      {isHighCost && (
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20 border text-xs">
                          High spend
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                  {isHighCost && (
                    <p className="text-xs text-muted-foreground italic">
                      ⚠ This category accounts for &gt;25% of total expenses. Review for cost reduction opportunities.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceAnalytics;
