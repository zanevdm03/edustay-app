export interface Property {
  id: string;
  name: string;
  units: Unit[];
  ownerId: string;
  ownerName: string;
  address: string;
  gender?: "Male" | "Female" | "Mixed";
}

export interface Unit {
  id: string;
  name: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  number: string;
  type: "single" | "sharing";
  status: "available" | "occupied" | "reserved";
  studentId?: string;
  studentName?: string;
  monthlyRent: number;
  depositAmount?: number;
  rentPaid: boolean;
  keyCode?: string;
  keysTotal?: number;
  keysAvailable?: number;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber?: string;
  residentialAddress?: string;
  mandateFile?: string;
  mandateExpiry?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female";
  institution: "CUT" | "UFS" | "Eduvos";
  fundingMethod: "NSFAS" | "cash";
  applicationStatus: "none" | "requested" | "approved" | "submitted" | "allocated" | "contracted";
  secretCode?: string;
  applicationData?: ApplicationData;
  allocation?: AllocationData;
}

export interface AllocationData {
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  ownerName: string;
  unitName: string;
  roomNumber: string;
  roomType: "single" | "sharing";
  occupants: number;
  monthlyRent: number;
  depositAmount: number;
  adminFee: number;
  keyDeposit: number;
  leaseStart: string;
  leaseEnd: string;
  signedDate?: string;
  signedLocation?: string;
}

export interface ApplicationData {
  placeOfStudy: "UFS" | "CUT" | "Eduvos" | "Motheo";
  gender: "Male" | "Female" | string;
  paymentMethod: "EFT" | "Cash" | "NSFAS" | string;
  fullName: string;
  idNumber: string;
  email: string;
  studentNumber: string;
  whatsappNumber: string;
  callNumber: string;
  yearOfStudy: string;
  fieldOfStudy: string;
  motherFullName: string;
  motherIdNumber: string;
  motherEmail: string;
  motherWhatsapp: string;
  motherCallNumber: string;
  motherOccupation: string;
  fatherFullName: string;
  fatherIdNumber: string;
  fatherEmail: string;
  fatherWhatsapp: string;
  fatherCallNumber: string;
  fatherOccupation: string;
  emergencyContactType: "Mother" | "Father" | "Other";
  emergencyOtherName?: string;
  emergencyOtherWhatsapp?: string;
  emergencyOtherCallNumber?: string;
  emergencyOtherRelationship?: string;
  preferredPaymentDate: "7th" | "15th" | "30th";
  studentIdDocument?: string;
  motherIdDocument?: string;
  fatherIdDocument?: string;
  nsfasRegistration?: string;
}

export interface ApplicationRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  secretCode?: string;
}

export const mockOwners: Owner[] = [
  { id: "o1", name: "James Mokoena", email: "james@owners.co.za", phone: "081 123 4567", idNumber: "7501015012081", residentialAddress: "34 Park Ave, Bloemfontein, 9301", mandateFile: "mandate_mokoena_2026.pdf", mandateExpiry: "2026-12-31" },
  { id: "o2", name: "Palesa Naidoo", email: "palesa@owners.co.za", phone: "082 234 5678", idNumber: "8003225012082", residentialAddress: "12 Church St, Bloemfontein, 9301", mandateFile: "mandate_naidoo_2026.pdf", mandateExpiry: "2026-11-30" },
];

export const mockProperties: Property[] = [
  {
    id: "p1",
    name: "Greenfield Residence",
    ownerId: "o1",
    ownerName: "James Mokoena",
    address: "12 Main Road, Braamfontein",
    gender: "Male",
    units: [
      {
        id: "u1", name: "Block A", rooms: [
          { id: "r1", number: "A101", type: "single", status: "available", monthlyRent: 4500, depositAmount: 4500, rentPaid: false, keyCode: "KA101", keysTotal: 3, keysAvailable: 3 },
          { id: "r2", number: "A102", type: "sharing", status: "occupied", studentId: "s1", studentName: "Thabo Nkosi", monthlyRent: 4500, depositAmount: 4500, rentPaid: true, keyCode: "KA102", keysTotal: 2, keysAvailable: 1 },
          { id: "r3", number: "A103", type: "single", status: "available", monthlyRent: 4800, depositAmount: 4800, rentPaid: false, keyCode: "KA103", keysTotal: 2, keysAvailable: 2 },
        ]
      },
      {
        id: "u2", name: "Block B", rooms: [
          { id: "r4", number: "B101", type: "sharing", status: "available", monthlyRent: 5000, depositAmount: 5000, rentPaid: false, keyCode: "KB101", keysTotal: 2, keysAvailable: 2 },
          { id: "r5", number: "B102", type: "single", status: "reserved", monthlyRent: 5000, depositAmount: 5000, rentPaid: false, keyCode: "KB102", keysTotal: 2, keysAvailable: 2 },
        ]
      },
    ],
  },
  {
    id: "p2",
    name: "Campus View Apartments",
    ownerId: "o1",
    ownerName: "James Mokoena",
    address: "45 University Ave, Auckland Park",
    gender: "Female",
    units: [
      {
        id: "u3", name: "Floor 1", rooms: [
          { id: "r6", number: "101", type: "single", status: "available", monthlyRent: 5500, depositAmount: 5500, rentPaid: false, keyCode: "K101", keysTotal: 2, keysAvailable: 2 },
          { id: "r7", number: "102", type: "sharing", status: "occupied", studentId: "s2", studentName: "Lerato Dlamini", monthlyRent: 5500, depositAmount: 5500, rentPaid: false, keyCode: "K102", keysTotal: 2, keysAvailable: 0 },
        ]
      },
    ],
  },
];

export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Thabo Nkosi",
    email: "thabo@student.ac.za",
    phone: "071 234 5678",
    gender: "Male",
    institution: "CUT",
    fundingMethod: "NSFAS",
    applicationStatus: "contracted",
    applicationData: {
      placeOfStudy: "CUT",
      gender: "Male",
      paymentMethod: "NSFAS",
      fullName: "Thabo Nkosi",
      idNumber: "0103155678901",
      email: "thabo@student.ac.za",
      studentNumber: "221001234",
      whatsappNumber: "071 234 5678",
      callNumber: "071 234 5678",
      yearOfStudy: "3",
      fieldOfStudy: "BSc Computer Science",
      motherFullName: "Nomsa Nkosi",
      motherIdNumber: "7803155678901",
      motherEmail: "nomsa@email.co.za",
      motherWhatsapp: "082 345 6789",
      motherCallNumber: "082 345 6789",
      motherOccupation: "Teacher",
      fatherFullName: "Sipho Nkosi",
      fatherIdNumber: "7603155678901",
      fatherEmail: "sipho@email.co.za",
      fatherWhatsapp: "083 456 7890",
      fatherCallNumber: "083 456 7890",
      fatherOccupation: "Engineer",
      emergencyContactType: "Mother",
      preferredPaymentDate: "7th",
    },
    allocation: {
      propertyId: "p1",
      propertyName: "Greenfield Residence",
      propertyAddress: "12 Main Road, Braamfontein",
      ownerName: "James Mokoena",
      unitName: "Block A",
      roomNumber: "A102",
      roomType: "sharing",
      occupants: 2,
      monthlyRent: 4500,
      depositAmount: 4500,
      adminFee: 500,
      keyDeposit: 200,
      leaseStart: "2026-03-01",
      leaseEnd: "2026-11-30",
      signedDate: "2026-02-20",
      signedLocation: "Bloemfontein",
    },
  },
  {
    id: "s2",
    name: "Lerato Dlamini",
    email: "lerato@student.ac.za",
    phone: "073 456 7890",
    gender: "Female",
    institution: "UFS",
    fundingMethod: "cash",
    applicationStatus: "submitted",
    applicationData: {
      placeOfStudy: "UFS",
      gender: "Female",
      paymentMethod: "Cash",
      fullName: "Lerato Dlamini",
      idNumber: "0207225678901",
      email: "lerato@student.ac.za",
      studentNumber: "221005678",
      whatsappNumber: "073 456 7890",
      callNumber: "073 456 7890",
      yearOfStudy: "2",
      fieldOfStudy: "BA Law",
      motherFullName: "Grace Dlamini",
      motherIdNumber: "8007225678901",
      motherEmail: "grace@email.co.za",
      motherWhatsapp: "084 567 8901",
      motherCallNumber: "084 567 8901",
      motherOccupation: "Nurse",
      fatherFullName: "Sipho Dlamini",
      fatherIdNumber: "7807225678901",
      fatherEmail: "sipho.d@email.co.za",
      fatherWhatsapp: "085 678 9012",
      fatherCallNumber: "085 678 9012",
      fatherOccupation: "Accountant",
      emergencyContactType: "Father",
      preferredPaymentDate: "15th",
    },
  },
  {
    id: "s3",
    name: "Zanele Mbeki",
    email: "zanele@student.ac.za",
    phone: "076 789 0123",
    gender: "Female",
    institution: "Eduvos",
    fundingMethod: "NSFAS",
    applicationStatus: "approved",
    secretCode: "ACC-7829",
  },
];

export const mockRequests: ApplicationRequest[] = [
  {
    id: "req1",
    studentId: "s3",
    studentName: "Zanele Mbeki",
    studentEmail: "zanele@student.ac.za",
    status: "approved",
    requestDate: "2026-02-10",
    secretCode: "ACC-7829",
  },
  {
    id: "req2",
    studentId: "s4",
    studentName: "Bongani Zulu",
    studentEmail: "bongani@student.ac.za",
    status: "pending",
    requestDate: "2026-02-14",
  },
];
