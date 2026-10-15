// Record shapes as the server uses them. The lexicons in @omp/schemas are the source of truth; these are
// the subset of fields the server reads, typed loosely on purpose so a new optional lexicon field never
// breaks the server.
export interface Money { amountCents: number; currency: string }
export interface Ref { uri: string; cid: string }
export interface Location { name: string; streetAddress?: string; locality?: string; region?: string; postalCode?: string; country?: string; capacity?: number; accessibilityNotes?: string }
export interface Organization { name: string; kind: string; description?: string; website?: string; location?: Location; timezone?: string; issuerKeys?: { kid: string; alg: string; publicKeyMultibase: string }[]; createdAt: string }
export interface Act { name: string; kind: string; description?: string; createdAt: string }
export interface Event {
  title: string; description?: string; startsAt: string; endsAt?: string; doorsAt?: string; timezone: string; location: Location;
  status: string; visibility?: string; ageRestriction?: string;
  refundPolicy: { onCancellation: string; onPostponement: string; buyerCancellation?: string; text?: string };
  feeDisclosure: { platformFeeCents: number; organizerFeeCents?: number; processorNote?: string };
  taxNote?: string; tags?: string[]; createdAt: string;
}
export interface Performance { event: Ref; act?: Ref; actName?: string; role?: string; order: number; setStartsAt?: string; setEndsAt?: string; createdAt: string }
export interface TicketClass { event: Ref; name: string; kind: "freeRsvp" | "paid" | "payWhatYouWant" | "comp"; price: Money; minimumPrice?: Money; capacity?: number; perOrderLimit?: number; salesStartAt?: string; salesEndAt?: string; description?: string; sortOrder?: number; createdAt: string }
export interface Order { event: Ref; items: { ticketClass: Ref; quantity: number; unitPrice: Money }[]; buyer: { name: string; email?: string; marketingConsent?: boolean }; status: string; paymentProvider: string; paymentRef?: string; total: Money; refundedTotal?: Money; createdAt: string; paidAt?: string }
export interface Ticket { event: Ref; ticketClass: Ref; order: Ref; serial: number; status: "valid" | "revoked" | "refunded" | "transferred"; holderBinding?: string; holderLabel?: string; issuerKid: string; token?: string; issuedAt: string }
export interface Program { event: Ref; title?: string; pieces: { order: number; title: string; composer?: string; arranger?: string; performedBy?: string; durationSeconds?: number; notes?: string; isIntermission?: boolean }[]; notes?: string; createdAt: string }
