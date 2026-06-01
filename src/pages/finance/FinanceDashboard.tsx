import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { mockStudents, mockProperties } from "@/lib/mockData";
import { mockMaintenanceRequests, mockExpenses, expenseCategories, type ExpenseRecord } from "@/lib/mockNotifications";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Bell, Plus, CheckCircle, AlertTriangle, Receipt, BarChart3 } from "lucide-react";
import NotificationBar from "@/components/NotificationBar";
import FinanceAnalytics from "@/components/FinanceAnalytics";

function getStudentRentPaid(studentId: string): boolean | null {
  for (const property of mockProperties) {
    for (const unit of property.units) {
      for (const room of unit.rooms) {
        if (room.studentId === studentId) return room.rentPaid;
      }
    }
  }
  return null;
}

const FinanceDashboard = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(mockExpenses);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: "", description: "", amount: "", date: "", propertyId: "" });

  const allocatedStudents = mockStudents.filter(s => s.allocation);
  const paidStudents = allocatedStudents.filter(s => getStudentRentPaid(s.id) === true);
  const unpaidStudents = allocatedStudents.filter(s => getStudentRentPaid(s.id) === false);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const maintenanceCosts = mockMaintenanceRequests.filter(r => r.cost).reduce((s, r) => s + (r.cost || 0), 0);

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount) return;
    const prop = mockProperties.find(p => p.id === newExpense.propertyId);
    const expense: ExpenseRecord = {
      id: `exp${Date.now()}`,
      category: newExpense.category,
      description: newExpense.description,
      amount: Number(newExpense.amount),
      date: newExpense.date || new Date().toISOString().split("T")[0],
      propertyId: newExpense.propertyId || undefined,
      propertyName: prop?.name,
    };
    setExpenses(prev => [...prev, expense]);
    setAddExpenseOpen(false);
    setNewExpense({ category: "", description: "", amount: "", date: "", propertyId: "" });
    toast({ title: "Expense Added", description: `R${expense.amount.toLocaleString()} for ${expense.category}` });
  };

  const handleSendReminder = (studentId: string, name: string) => {
    toast({ title: "Reminder Sent", description: `Payment reminder sent to ${name}.` });
  };

  return (
    <DashboardLayout role="finance">
      <div className="space-y-8">
        <NotificationBar userId="finance1" />
        <div>
          <h1 className="text-3xl font-serif text-foreground">Finance Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track payments, expenses, and student balances</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Paid Students" value={paidStudents.length} icon={<CheckCircle className="h-5 w-5" />} />
          <StatCard title="Unpaid Students" value={unpaidStudents.length} icon={<AlertTriangle className="h-5 w-5" />} />
          <StatCard title="Total Expenses" value={`R${totalExpenses.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
          <StatCard title="Maintenance Costs" value={`R${maintenanceCosts.toLocaleString()}`} icon={<Receipt className="h-5 w-5" />} />
        </div>

        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="students">Student Payments</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-1" /> Insights & Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Funding</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocatedStudents.map(s => {
                      const paid = getStudentRentPaid(s.id);
                      return (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell className="uppercase text-xs text-muted-foreground">{s.fundingMethod}</TableCell>
                          <TableCell className="text-muted-foreground">{s.allocation?.propertyName}</TableCell>
                          <TableCell className="text-muted-foreground">R{s.allocation?.monthlyRent.toLocaleString()}</TableCell>
                          <TableCell>
                            {paid ? (
                              <Badge className="bg-success/10 text-success border-success/20 border">Paid</Badge>
                            ) : (
                              <Badge className="bg-destructive/10 text-destructive border-destructive/20 border">Unpaid</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {!paid && (
                              <Button size="sm" variant="outline" onClick={() => handleSendReminder(s.id, s.name)}>
                                <Bell className="h-3 w-3 mr-1" /> Remind
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setAddExpenseOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add Expense</Button>
            </div>
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map(e => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">{e.category}</TableCell>
                        <TableCell className="text-muted-foreground">{e.description}</TableCell>
                        <TableCell className="text-muted-foreground">{e.propertyName || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">R{e.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{e.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <FinanceAnalytics expenses={expenses} />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Add Expense</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Category</Label>
              <Select value={newExpense.category} onValueChange={v => setNewExpense(p => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {expenseCategories.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Input value={newExpense.description} onChange={e => setNewExpense(p => ({ ...p, description: e.target.value }))} placeholder="Brief description" />
            </div>
            <div>
              <Label>Amount (R)</Label>
              <Input type="number" value={newExpense.amount} onChange={e => setNewExpense(p => ({ ...p, amount: e.target.value }))} />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={newExpense.date} onChange={e => setNewExpense(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <Label>Property (optional)</Label>
              <Select value={newExpense.propertyId} onValueChange={v => setNewExpense(p => ({ ...p, propertyId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {mockProperties.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddExpenseOpen(false)}>Cancel</Button>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FinanceDashboard;