import { mockProperties, mockStudents } from "@/lib/mockData";

export interface Notification {
  id: string;
  type: "announcement" | "rent_reminder" | "maintenance" | "appointment" | "transfer" | "missing_key" | "general";
  title: string;
  message: string;
  targetUserIds: string[];
  timestamp: string;
  read: boolean;
}

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  propertyId?: string;
  propertyName?: string;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
}

export interface MaintenanceRequest {
  id: string;
  studentId: string;
  studentName: string;
  propertyId: string;
  propertyName: string;
  unitId: string;
  unitName: string;
  area: string;
  item: string;
  description?: string;
  photos?: string[];
  status: "pending" | "in_progress" | "resolved";
  createdAt: string;
  cost?: number;
  invoiceFile?: string;
  // Owner approval workflow
  ownerResponse?: "approved" | "investigate" | null;
  ownerResponseAt?: string;
  // Maintenance team workflow
  maintenanceStartedAt?: string;
  maintenanceCompletedAt?: string;
  maintenanceDescription?: string;
  // Completion flow
  completionPhotos?: string[];
  studentCompleted?: boolean;
  maintenanceCompleted?: boolean;
}

export interface TransferRequest {
  id: string;
  studentId: string;
  studentName: string;
  type: "property" | "room";
  reason?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  filters: {
    properties?: string[];
    institutions?: string[];
    funding?: string[];
    gender?: string[];
  };
  createdAt: string;
}

export interface ExpenseRecord {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receiptFile?: string;
  propertyId?: string;
  propertyName?: string;
}

export const expenseCategories = [
  "Cleaning Ladies", "Gardening Services", "Maintenance", "Furniture",
  "Appliances", "Fuel", "Car Services", "Software Maintenance",
  "Key Replacements", "Office Supplies", "Office Rent", "Student Deposits", "Other"
];

export const mockExpenses: ExpenseRecord[] = [
  { id: "exp1", category: "Cleaning Ladies", description: "Monthly cleaning - Greenfield", amount: 2500, date: "2026-03-01", propertyId: "p1", propertyName: "Greenfield Residence" },
  { id: "exp2", category: "Gardening Services", description: "Garden maintenance - Campus View", amount: 1200, date: "2026-03-02", propertyId: "p2", propertyName: "Campus View Apartments" },
  { id: "exp3", category: "Maintenance", description: "Plumbing repair Block A", amount: 850, date: "2026-02-28", propertyId: "p1", propertyName: "Greenfield Residence", receiptFile: "receipt_plumbing.pdf" },
  { id: "exp4", category: "Office Supplies", description: "Printer cartridges", amount: 450, date: "2026-03-05" },
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "rent_reminder",
    title: "Rent Payment Reminder",
    message: "Your rent payment is due. Please make payment before the end of the month.",
    targetUserIds: ["s2"],
    timestamp: "2026-03-05T08:00:00",
    read: false,
  },
  {
    id: "n2",
    type: "announcement",
    title: "Water Outage Notice",
    message: "There will be a scheduled water outage on March 10th from 8am to 12pm for maintenance.",
    targetUserIds: [],
    timestamp: "2026-03-04T14:00:00",
    read: false,
  },
  {
    id: "n3",
    type: "appointment",
    title: "Room Viewing Appointment",
    message: "Bongani Zulu has booked a room viewing for March 8th at 10:00 AM.",
    targetUserIds: ["admin1"],
    timestamp: "2026-03-04T16:00:00",
    read: false,
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "apt1",
    studentId: "s3",
    studentName: "Zanele Mbeki",
    date: "2026-03-08",
    time: "10:00",
    propertyId: "p1",
    propertyName: "Greenfield Residence",
    status: "confirmed",
    notes: "Interested in single room",
  },
  {
    id: "apt2",
    studentId: "s4",
    studentName: "Bongani Zulu",
    date: "2026-03-10",
    time: "14:00",
    propertyId: "p2",
    propertyName: "Campus View Apartments",
    status: "pending",
  },
];

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: "mnt1",
    studentId: "s1",
    studentName: "Thabo Nkosi",
    propertyId: "p1",
    propertyName: "Greenfield Residence",
    unitId: "u1",
    unitName: "Block A",
    area: "My Bedroom",
    item: "Broken Lights",
    status: "pending",
    createdAt: "2026-03-06T20:19:25",
    photos: ["photo_lights_1.jpg", "photo_lights_2.jpg"],
    ownerResponse: null,
  },
  {
    id: "mnt2",
    studentId: "s2",
    studentName: "Lerato Dlamini",
    propertyId: "p2",
    propertyName: "Campus View Apartments",
    unitId: "u3",
    unitName: "Floor 1",
    area: "Kitchen",
    item: "Water Leakage",
    description: "The sink is leaking underneath",
    status: "in_progress",
    createdAt: "2026-02-28T14:30:00",
    photos: ["photo_sink_leak.jpg"],
    cost: 850,
    invoiceFile: "invoice_plumbing.pdf",
    ownerResponse: "approved",
    ownerResponseAt: "2026-02-28T15:00:00",
    maintenanceStartedAt: "2026-02-28T16:00:00",
  },
];

export const mockTransferRequests: TransferRequest[] = [];

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann1",
    title: "Water Outage Notice",
    message: "There will be a scheduled water outage on March 10th from 8am to 12pm for maintenance.",
    filters: {},
    createdAt: "2026-03-04T14:00:00",
  },
  {
    id: "ann2",
    title: "Sanitary Products Cleanup",
    message: "Reminder: Please ensure sanitary products are disposed of properly in designated bins.",
    filters: { gender: ["Female"] },
    createdAt: "2026-03-05T09:00:00",
  },
];

export const maintenanceAreas: Record<string, string[]> = {
  "My Bedroom": ["Door", "Bed", "Closet", "Desk", "Chair", "Lights", "Walls", "Roof", "Windows", "Water Leakage", "Broken Lights", "Power Plugs", "Other"],
  "Kitchen": ["Door", "Stove", "Sink", "Fridge", "Walls", "Roof", "Windows", "Water Leakage", "Broken Lights", "Power Plugs", "Other"],
  "Bathroom": ["Door", "Shower", "Sink", "Toilet", "Walls", "Roof", "Broken Lights", "Other"],
  "Living Room": ["Door", "Entry Door", "Furniture", "Walls", "Roof", "Windows", "Water Leakage", "Broken Lights", "Power Plugs", "Wi-Fi", "Other"],
  "Laundry Room": ["Door", "Washing Machine", "Drying Line", "Walls", "Roof", "Windows", "Water Leakage", "Broken Lights", "Power Plugs", "Other"],
};

export function getNotificationsForUser(userId: string): Notification[] {
  return mockNotifications.filter(
    (n) => n.targetUserIds.length === 0 || n.targetUserIds.includes(userId)
  ).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function getStudentRentStatus(studentId: string): boolean {
  for (const property of mockProperties) {
    for (const unit of property.units) {
      for (const room of unit.rooms) {
        if (room.studentId === studentId) {
          return room.rentPaid;
        }
      }
    }
  }
  return false;
}
