import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare, Plus, ArrowLeft, Paperclip } from "lucide-react";
import { getContactsForRole, getConversation, getAvailableRecipients, type Contact, type Message } from "@/lib/mockMessages";
import { cn } from "@/lib/utils";

interface MessagesPageProps {
  role: "admin" | "student" | "owner" | "finance" | "maintenance_role";
  userId: string;
}

const roleColors: Record<string, string> = {
  admin: "bg-primary text-primary-foreground",
  student: "bg-accent text-accent-foreground",
  owner: "bg-secondary text-secondary-foreground",
  group: "bg-muted text-muted-foreground",
  finance: "bg-primary text-primary-foreground",
  maintenance_role: "bg-primary text-primary-foreground",
};

const avatarColors: Record<string, string> = {
  admin: "bg-primary text-primary-foreground",
  student: "bg-chart-1 text-white",
  owner: "bg-chart-2 text-white",
  group: "bg-muted text-muted-foreground",
  finance: "bg-chart-3 text-white",
  maintenance_role: "bg-chart-4 text-white",
};

function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

const MessagesPage = ({ role, userId }: MessagesPageProps) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const effectiveRole = (role === "finance" || role === "maintenance_role") ? role : role;
  const contactRole = (role === "finance" || role === "maintenance_role") ? "admin" : role;
  const contacts = getContactsForRole(contactRole as any, userId);
  const availableRecipients = getAvailableRecipients(contactRole as any);

  // For maintenance role, filter contacts to only Finance and Admin
  const filteredContacts = role === "maintenance_role"
    ? contacts.filter(c => c.role === "admin" || c.id === "finance1")
    : contacts;

  const filteredRecipients = role === "maintenance_role"
    ? availableRecipients.filter(r => r.role === "admin" || r.id === "finance1")
    : availableRecipients;

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setMessages(getConversation(userId, contact.id));
    setShowNewChat(false);
  };

  const handleSend = () => {
    if ((!newMessage.trim() && attachedFiles.length === 0) || !selectedContact) return;
    const isGroup = selectedContact.isGroup;
    const attachmentNames = attachedFiles.map(f => f.name);
    const msg: Message = {
      id: `m-${Date.now()}`,
      senderId: userId,
      senderName: role === "admin" ? "Admin Office" : role === "finance" ? "Finance Team" : role === "maintenance_role" ? "Maintenance Team" : "You",
      senderRole: contactRole as any,
      recipientId: selectedContact.id,
      recipientName: selectedContact.name,
      recipientRole: isGroup ? "group" : selectedContact.role,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      isGroup,
      attachments: attachmentNames.length > 0 ? attachmentNames : undefined,
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    setAttachedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  const formatDate = (ts: string) => {
    const d = new Date(ts);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
  };

  const dashboardRole = (role === "finance" || role === "maintenance_role") ? role : role;

  return (
    <DashboardLayout role={dashboardRole as any}>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">
            {role === "admin" ? "Communicate with students and property owners"
              : role === "finance" ? "Finance team communications"
              : role === "maintenance_role" ? "Maintenance team communications"
              : "Send messages to the Admin Office"}
          </p>
        </div>

        <div className="grid md:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-220px)]">
          {/* Contacts list */}
          <Card className="shadow-card flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-serif">Conversations</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setShowNewChat(!showNewChat)}><Plus className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                {showNewChat && (
                  <div className="px-4 pb-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase">New conversation</p>
                    {filteredRecipients
                      .filter((r) => !filteredContacts.find((c) => c.id === r.id))
                      .map((recipient) => (
                        <button key={recipient.id} onClick={() => handleSelectContact(recipient)} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-accent transition-colors mb-1">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className={cn("text-[10px]", avatarColors[recipient.role] || "bg-muted text-muted-foreground")}>{getInitials(recipient.name)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{recipient.name}</span>
                            <Badge variant="outline" className="text-[10px] capitalize">{recipient.isGroup ? "group" : recipient.role}</Badge>
                          </div>
                        </button>
                      ))}
                    <div className="border-b my-2" />
                  </div>
                )}
                <div className="px-2">
                  {filteredContacts.length === 0 && !showNewChat ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      No conversations yet
                    </div>
                  ) : (
                    filteredContacts.map((contact) => (
                      <button key={contact.id} onClick={() => handleSelectContact(contact)} className={cn("w-full text-left px-3 py-3 rounded-lg transition-colors mb-1", selectedContact?.id === contact.id ? "bg-accent" : "hover:bg-accent/50")}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className={cn("text-xs", avatarColors[contact.role] || "bg-muted text-muted-foreground")}>{getInitials(contact.name)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-sm truncate">{contact.name}</span>
                                <Badge variant="outline" className="text-[10px] capitalize flex-shrink-0">{contact.isGroup ? "group" : contact.role}</Badge>
                              </div>
                              {contact.lastMessage && <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {contact.lastMessageTime && <p className="text-[10px] text-muted-foreground/60">{formatDate(contact.lastMessageTime)}</p>}
                            {contact.unread > 0 && (
                              <Badge className="bg-primary text-primary-foreground text-[10px] h-5 w-5 flex items-center justify-center rounded-full p-0">{contact.unread}</Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="shadow-card flex flex-col">
            {selectedContact ? (
              <>
                <CardHeader className="pb-3 border-b flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setSelectedContact(null)}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={cn("text-sm font-medium", avatarColors[selectedContact.role] || "bg-muted text-muted-foreground")}>{getInitials(selectedContact.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-serif">{selectedContact.name}</CardTitle>
                      <p className="text-xs text-muted-foreground capitalize">{selectedContact.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-3">
                      {messages.map((msg) => {
                        const isMe = msg.senderId === userId;
                        const isGroup = selectedContact?.isGroup;
                        return (
                          <div key={msg.id} className={cn("flex items-end gap-2", isMe ? "justify-end" : "justify-start")}>
                            {!isMe && (
                              <Avatar className="h-7 w-7 flex-shrink-0 mb-1">
                                <AvatarFallback className={cn("text-[10px]", avatarColors[msg.senderRole] || "bg-muted text-muted-foreground")}>{getInitials(msg.senderName)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5", isMe ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md")}>
                              {isGroup && !isMe && <p className="text-xs font-semibold mb-0.5 text-accent-foreground/80">{msg.senderName}</p>}
                              {msg.content && <p className="text-sm">{msg.content}</p>}
                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className="mt-1 space-y-1">
                                  {msg.attachments.map((a, i) => (
                                    <div key={i} className={cn("text-xs flex items-center gap-1 rounded px-2 py-1", isMe ? "bg-primary-foreground/10" : "bg-background/50")}>
                                      <Paperclip className="h-3 w-3" /> {a}
                                    </div>
                                  ))}
                                </div>
                              )}
                              <p className={cn("text-[10px] mt-1", isMe ? "text-primary-foreground/60" : "text-muted-foreground")}>{formatTime(msg.timestamp)}</p>
                            </div>
                            {isMe && (
                              <Avatar className="h-7 w-7 flex-shrink-0 mb-1">
                                <AvatarFallback className={cn("text-[10px]", avatarColors[role] || "bg-primary text-primary-foreground")}>{role === "admin" ? "AO" : role === "finance" ? "FT" : role === "maintenance_role" ? "MT" : "ME"}</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
                <div className="p-4 border-t flex-shrink-0">
                  {attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {attachedFiles.map((f, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{f.name}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="cursor-pointer flex items-center">
                      <Button variant="ghost" size="icon" asChild><span><Paperclip className="h-4 w-4" /></span></Button>
                      <input type="file" className="hidden" multiple onChange={(e) => {
                        if (e.target.files) setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }} />
                    </label>
                    <Input placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} className="flex-1" />
                    <Button onClick={handleSend} disabled={!newMessage.trim() && attachedFiles.length === 0}><Send className="h-4 w-4" /></Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Select a conversation</p>
                  <p className="text-sm mt-1">Choose from the list or start a new chat</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;