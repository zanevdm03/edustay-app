import { mockProperties, mockStudents } from "@/lib/mockData";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "admin" | "student" | "owner";
  recipientId: string;
  recipientName: string;
  recipientRole: "admin" | "student" | "owner" | "group";
  content: string;
  timestamp: string;
  read: boolean;
  isGroup?: boolean;
  attachments?: string[];
}

export interface Contact {
  id: string;
  name: string;
  role: "admin" | "student" | "owner" | "group";
  lastMessage?: string;
  lastMessageTime?: string;
  unread: number;
  isGroup?: boolean;
  members?: { id: string; name: string }[];
}

export const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "admin1",
    senderName: "Admin Office",
    senderRole: "admin",
    recipientId: "s1",
    recipientName: "Thabo Nkosi",
    recipientRole: "student",
    content: "Hi Thabo, your contract has been processed. Please review and sign.",
    timestamp: "2026-03-04T10:30:00",
    read: true,
  },
  {
    id: "m2",
    senderId: "s1",
    senderName: "Thabo Nkosi",
    senderRole: "student",
    recipientId: "admin1",
    recipientName: "Admin Office",
    recipientRole: "admin",
    content: "Thank you! I've signed the contract.",
    timestamp: "2026-03-04T11:15:00",
    read: true,
  },
  {
    id: "m3",
    senderId: "admin1",
    senderName: "Admin Office",
    senderRole: "admin",
    recipientId: "s1",
    recipientName: "Thabo Nkosi",
    recipientRole: "student",
    content: "You can move in from March 1st. Please collect your keys.",
    timestamp: "2026-03-04T11:45:00",
    read: false,
  },
  {
    id: "m4",
    senderId: "admin1",
    senderName: "Admin Office",
    senderRole: "admin",
    recipientId: "o1",
    recipientName: "James Mokoena",
    recipientRole: "owner",
    content: "Hi James, a new tenant has been allocated to Greenfield Residence Block A.",
    timestamp: "2026-03-03T14:00:00",
    read: true,
  },
  {
    id: "m5",
    senderId: "o1",
    senderName: "James Mokoena",
    senderRole: "owner",
    recipientId: "admin1",
    recipientName: "Admin Office",
    recipientRole: "admin",
    content: "Noted, thank you. Is the deposit payment confirmed?",
    timestamp: "2026-03-03T15:20:00",
    read: true,
  },
  {
    id: "m6",
    senderId: "s2",
    senderName: "Lerato Dlamini",
    senderRole: "student",
    recipientId: "admin1",
    recipientName: "Admin Office",
    recipientRole: "admin",
    content: "Good day, I submitted my application last week. Any updates?",
    timestamp: "2026-03-04T09:00:00",
    read: false,
  },
  // Finances channel
  {
    id: "fm1",
    senderId: "s1",
    senderName: "Thabo Nkosi",
    senderRole: "student",
    recipientId: "finance1",
    recipientName: "Finances",
    recipientRole: "admin",
    content: "Hi, here is my proof of payment for March.",
    timestamp: "2026-03-05T10:00:00",
    read: false,
    attachments: ["POP_March_Thabo.pdf"],
  },
  // Group messages
  {
    id: "gm1",
    senderId: "s1",
    senderName: "Thabo Nkosi",
    senderRole: "student",
    recipientId: "group-u1",
    recipientName: "Block A Residents",
    recipientRole: "group",
    content: "Hey everyone! When are you all moving in?",
    timestamp: "2026-03-04T12:00:00",
    read: true,
    isGroup: true,
  },
];

export function getUnitGroups(): Contact[] {
  const groups: Contact[] = [];
  for (const property of mockProperties) {
    for (const unit of property.units) {
      const members = unit.rooms
        .filter((r) => r.studentId && r.studentName)
        .map((r) => ({ id: r.studentId!, name: r.studentName! }));
      if (members.length > 0) {
        const groupId = `group-${unit.id}`;
        const groupMessages = mockMessages.filter((m) => m.recipientId === groupId);
        const lastMsg = groupMessages[groupMessages.length - 1];
        groups.push({
          id: groupId,
          name: `${unit.name} — ${property.name}`,
          role: "group",
          isGroup: true,
          members,
          lastMessage: lastMsg?.content,
          lastMessageTime: lastMsg?.timestamp,
          unread: 0,
        });
      }
    }
  }
  return groups;
}

// Finance channel contact
const financeContact: Contact = {
  id: "finance1",
  name: "Finances",
  role: "admin",
  lastMessage: "Proof of payment for March",
  lastMessageTime: "2026-03-05T10:00:00",
  unread: 1,
};

export function getContactsForRole(role: "admin" | "student" | "owner", userId: string): Contact[] {
  const relevantMessages = mockMessages.filter(
    (m) =>
      m.senderId === userId ||
      m.recipientId === userId ||
      (m.isGroup && isUserInGroup(m.recipientId, userId))
  );

  const contactMap = new Map<string, Contact>();

  relevantMessages.forEach((m) => {
    const isMe = m.senderId === userId;
    let contactId: string;
    let contactName: string;
    let contactRole: "admin" | "student" | "owner" | "group";
    let isGroup = false;

    if (m.isGroup) {
      contactId = m.recipientId;
      contactName = m.recipientName;
      contactRole = "group";
      isGroup = true;
    } else {
      contactId = isMe ? m.recipientId : m.senderId;
      contactName = isMe ? m.recipientName : m.senderName;
      contactRole = isMe ? m.recipientRole as any : m.senderRole;
    }

    const existing = contactMap.get(contactId);
    if (!existing || m.timestamp > (existing.lastMessageTime || "")) {
      contactMap.set(contactId, {
        id: contactId,
        name: contactName,
        role: contactRole,
        isGroup,
        lastMessage: m.content,
        lastMessageTime: m.timestamp,
        unread: (existing?.unread || 0) + (!isMe && !m.read ? 1 : 0),
      });
    } else if (!isMe && !m.read) {
      existing.unread += 1;
    }
  });

  // Add unit group chats
  if (role === "student") {
    const unitGroups = getUnitGroups();
    for (const group of unitGroups) {
      if (group.members?.some((m) => m.id === userId) && !contactMap.has(group.id)) {
        contactMap.set(group.id, group);
      }
    }
    // Add Finances channel for students
    if (!contactMap.has("finance1")) {
      contactMap.set("finance1", { ...financeContact, unread: 0 });
    }
  }

  if (role === "admin") {
    const unitGroups = getUnitGroups();
    for (const group of unitGroups) {
      if (!contactMap.has(group.id)) contactMap.set(group.id, group);
    }
    // Admin sees Finances channel
    if (!contactMap.has("finance1")) {
      contactMap.set("finance1", financeContact);
    }
  }

  return Array.from(contactMap.values()).sort(
    (a, b) => (b.lastMessageTime || "").localeCompare(a.lastMessageTime || "")
  );
}

function isUserInGroup(groupId: string, userId: string): boolean {
  const unitId = groupId.replace("group-", "");
  for (const property of mockProperties) {
    for (const unit of property.units) {
      if (unit.id === unitId) return unit.rooms.some((r) => r.studentId === userId);
    }
  }
  return userId.startsWith("admin");
}

export function getConversation(userId: string, contactId: string): Message[] {
  const isGroup = contactId.startsWith("group-");

  if (isGroup) {
    return mockMessages.filter((m) => m.isGroup && m.recipientId === contactId).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }

  return mockMessages
    .filter((m) => !m.isGroup && ((m.senderId === userId && m.recipientId === contactId) || (m.senderId === contactId && m.recipientId === userId)))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function getAvailableRecipients(role: "admin" | "student" | "owner"): Contact[] {
  if (role === "admin") {
    const students = mockStudents.map((s) => ({ id: s.id, name: s.name, role: "student" as const, unread: 0 }));
    const owners = [
      { id: "o1", name: "James Mokoena", role: "owner" as const, unread: 0 },
      { id: "o2", name: "Palesa Naidoo", role: "owner" as const, unread: 0 },
    ];
    const groups = getUnitGroups();
    return [...students, ...owners, ...groups];
  }
  if (role === "student") {
    return [
      { id: "admin1", name: "Admin Office", role: "admin" as const, unread: 0 },
      { ...financeContact, unread: 0 },
    ];
  }
  return [{ id: "admin1", name: "Admin Office", role: "admin" as const, unread: 0 }];
}
