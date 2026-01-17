import { requireAuth, sanitizeData } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import TicketResponseClient from "./ticket-response-client";

/**
 * 🛰️ TICKET RESOLUTION TERMINAL (Server)
 * Strategy: Multi-tenant Data Isolation with BigInt Sanitization.
 */
export default async function TicketResponsePage(props: {
  params: Promise<{ ticketId: string }>;
}) {
  // 🔐 1. Identity Handshake
  const session = await requireAuth();
  const { ticketId } = await props.params;
  
  // 🛡️ ROLE PROTOCOL
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  // 🏁 2. Fetch Ticket & Context
  const rawTicket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      user: {
        select: { fullName: true, username: true, id: true }
      }
    }
  });

  if (!rawTicket) return notFound();

  // 🛡️ SECURITY AUDIT: Data Isolation
  // Logic: Non-staff can ONLY see tickets where the merchantId matches their session.
  if (!isPlatformStaff && rawTicket.merchantId !== realMerchantId) {
    console.warn(`🚨 [Security_Breach]: Node ${realMerchantId} attempted unauthorized access to Ticket ${ticketId}`);
    return notFound();
  }

  // 🧼 3. Serialization Cleanup
  const ticket = sanitizeData(rawTicket);

  return (
    <TicketResponseClient 
      ticket={ticket}
      isPlatformStaff={isPlatformStaff}
      role={role}
    />
  );
}