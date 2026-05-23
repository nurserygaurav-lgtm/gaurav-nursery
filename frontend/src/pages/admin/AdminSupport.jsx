import { useEffect, useMemo, useState } from 'react';
import { useToast } from '../../hooks/useToast.js';
import { getAdminTickets, replyTicket, updateTicketStatus } from '../../services/ticketService.js';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { StatusPill } from '../../components/dashboard/DashboardUI.jsx';
import { MessageSquare, Send, Search, Tag, Trash2 } from 'lucide-react';

const statuses = ['all', 'open', 'pending', 'resolved', 'closed'];
const priorities = ['all', 'Low', 'Medium', 'High', 'Urgent'];
const ticketTypes = [
  'Product Issue',
  'Order Problem',
  'Payment Settlement',
  'Delivery Issue',
  'Technical Bug',
  'Bulk Upload Error',
  'Account Verification',
  'Inventory Problem'
];

function formatDate(value) {
  return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AdminSupport() {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [analytics, setAnalytics] = useState({ totalTickets: 0, openTickets: 0, highPriorityCount: 0, resolvedToday: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [type, setType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const query = useMemo(
    () => ({
      search: search.trim() || undefined,
      status: status !== 'all' ? status : undefined,
      priority: priority !== 'all' ? priority : undefined,
      type: type !== 'all' ? type : undefined
    }),
    [priority, search, status, type]
  );

  useEffect(() => {
    loadTickets();
  }, [query]);

  async function loadTickets() {
    try {
      setIsLoading(true);
      const { tickets: data, analytics: meta } = await getAdminTickets(query);
      setTickets(data || []);
      setAnalytics(meta || analytics);
      setSelectedTicket((current) => {
        const updated = data?.find((ticket) => ticket._id === current?._id);
        return updated || data?.[0] || null;
      });
    } catch (err) {
      showToast(err.message || 'Unable to load support tickets', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelectTicket(ticket) {
    setSelectedTicket(ticket);
  }

  async function handleStatusChange(ticketId, newStatus) {
    if (!ticketId || !newStatus) return;
    try {
      setIsSaving(true);
      const { ticket } = await updateTicketStatus(ticketId, newStatus);
      setTickets((current) => current.map((item) => (item._id === ticket._id ? ticket : item)));
      setSelectedTicket(ticket);
      showToast('Status updated');
    } catch (err) {
      showToast(err.message || 'Unable to update status', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSendReply(event) {
    event.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) {
      showToast('Reply text is required', 'error');
      return;
    }
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append('message', replyMessage.trim());
      const { ticket } = await replyTicket(selectedTicket._id, formData);
      setTickets((current) => current.map((item) => (item._id === ticket._id ? ticket : item)));
      setSelectedTicket(ticket);
      setReplyMessage('');
      showToast('Reply sent');
    } catch (err) {
      showToast(err.message || 'Could not send reply', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <article className="rounded-[2rem] border border-leaf-100 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3 text-leaf-700">
            <MessageSquare size={24} />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf-600">Support overview</p>
              <h2 className="mt-2 text-2xl font-black text-leaf-950">Admin ticket analytics</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-leaf-100 bg-leaf-50 p-5">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf-600">Total tickets</p>
              <p className="mt-4 text-3xl font-black text-leaf-950">{analytics.totalTickets}</p>
            </div>
            <div className="rounded-3xl border border-leaf-100 bg-leaf-50 p-5">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf-600">Open tickets</p>
              <p className="mt-4 text-3xl font-black text-leaf-950">{analytics.openTickets}</p>
            </div>
            <div className="rounded-3xl border border-leaf-100 bg-leaf-50 p-5">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf-600">Resolved today</p>
              <p className="mt-4 text-3xl font-black text-leaf-950">{analytics.resolvedToday}</p>
            </div>
            <div className="rounded-3xl border border-leaf-100 bg-leaf-50 p-5">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf-600">High priority</p>
              <p className="mt-4 text-3xl font-black text-leaf-950">{analytics.highPriorityCount}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border border-leaf-100 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf-600">Support queue</p>
              <h2 className="mt-2 text-2xl font-black text-leaf-950">Filter tickets</h2>
            </div>
            <div className="rounded-full bg-leaf-100 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-leaf-700">Admin only</div>
          </div>
          <div className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <label className="block">
                <span className="text-sm font-black text-leaf-900">Status</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)} className="form-input mt-2 w-full rounded-full">
                  {statuses.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-black text-leaf-900">Priority</span>
                <select value={priority} onChange={(event) => setPriority(event.target.value)} className="form-input mt-2 w-full rounded-full">
                  {priorities.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-black text-leaf-900">Ticket type</span>
                <select value={type} onChange={(event) => setType(event.target.value)} className="form-input mt-2 w-full rounded-full">
                  <option value="all">all</option>
                  {ticketTypes.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-black text-leaf-900">Search</span>
              <div className="relative mt-2">
                <Search className="absolute left-4 top-3 text-stone-400" size={18} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="form-input w-full pl-12 rounded-full"
                  placeholder="Search by ticket id, subject, or order"
                />
              </div>
            </label>
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-leaf-100 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-leaf-950">Tickets</h2>
              <p className="mt-1 text-sm text-stone-600">Select a ticket to view details and reply.</p>
            </div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-leaf-600">{tickets.length} tickets</span>
          </div>

          <div className="mt-5 overflow-x-auto rounded-3xl border border-leaf-100">
            {isLoading ? (
              <div className="p-10 text-center text-leaf-700">
                <Spinner label="Loading tickets" />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-leaf-100 text-left text-sm">
                <thead className="bg-leaf-50 text-leaf-700">
                  <tr>
                    <th className="px-4 py-4 font-black uppercase tracking-[0.18em]">Ticket</th>
                    <th className="px-4 py-4 font-black uppercase tracking-[0.18em]">Seller</th>
                    <th className="px-4 py-4 font-black uppercase tracking-[0.18em]">Priority</th>
                    <th className="px-4 py-4 font-black uppercase tracking-[0.18em]">Status</th>
                    <th className="px-4 py-4 font-black uppercase tracking-[0.18em]">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-leaf-100 bg-white">
                  {tickets.map((ticket) => (
                    <tr key={ticket._id} className="cursor-pointer transition hover:bg-leaf-50" onClick={() => handleSelectTicket(ticket)}>
                      <td className="px-4 py-4">
                        <p className="font-black text-leaf-950">{ticket.ticketId}</p>
                        <p className="mt-1 text-sm text-stone-500">{ticket.subject}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-leaf-950">{ticket.seller?.sellerProfile?.shopName || ticket.seller?.name || 'Seller'}</p>
                        <p className="mt-1 text-sm text-stone-500">{ticket.seller?.email}</p>
                      </td>
                      <td className="px-4 py-4 text-leaf-950">{ticket.priority}</td>
                      <td className="px-4 py-4"><StatusPill status={ticket.status} /></td>
                      <td className="px-4 py-4 text-stone-500">{formatDate(ticket.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-leaf-100 bg-white p-6 shadow-soft">
          {selectedTicket ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf-600">Ticket details</p>
                  <h3 className="mt-2 text-2xl font-black text-leaf-950">{selectedTicket.subject}</h3>
                  <p className="mt-1 text-sm text-stone-500">{selectedTicket.ticketId}</p>
                </div>
                <StatusPill status={selectedTicket.status} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-leaf-100 bg-leaf-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-600">Seller</p>
                  <p className="mt-2 text-sm font-bold text-leaf-950">{selectedTicket.seller?.sellerProfile?.shopName || selectedTicket.seller?.name}</p>
                  <p className="mt-1 text-sm text-stone-500">{selectedTicket.seller?.email}</p>
                </div>
                <div className="rounded-3xl border border-leaf-100 bg-leaf-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-600">Ticket type</p>
                  <p className="mt-2 text-sm font-bold text-leaf-950">{selectedTicket.type}</p>
                  <p className="mt-2 text-sm text-stone-500">Priority: {selectedTicket.priority}</p>
                </div>
              </div>
              <div className="rounded-3xl bg-leaf-50 p-5">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf-600">Description</p>
                <p className="mt-3 text-sm leading-7 text-stone-600">{selectedTicket.description}</p>
              </div>
              {selectedTicket.attachments?.length > 0 && (
                <div className="rounded-3xl bg-leaf-50 p-5">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf-600">Attachments</p>
                  <div className="mt-4 space-y-3">
                    {selectedTicket.attachments.map((attachment, index) => (
                      <a key={index} href={attachment.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-leaf-100 bg-white px-4 py-3 text-sm text-leaf-900">
                        <Trash2 size={16} />
                        {attachment.filename}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="rounded-3xl bg-leaf-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf-600">Conversation</p>
                  <select
                    value={selectedTicket.status}
                    onChange={(event) => handleStatusChange(selectedTicket._id, event.target.value)}
                    className="form-input rounded-full"
                  >
                    {statuses.slice(1).map((statusItem) => (
                      <option key={statusItem} value={statusItem}>{statusItem}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 space-y-4">
                  {selectedTicket.replies?.map((reply, index) => (
                    <div key={index} className="rounded-3xl border border-leaf-100 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black text-leaf-950">{reply.sender === 'admin' ? 'Support' : 'Seller'}</p>
                        <span className="text-xs text-stone-500">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-stone-600">{reply.message}</p>
                    </div>
                  ))}
                </div>
              </div>
              <form className="space-y-4" onSubmit={handleSendReply}>
                <label className="block">
                  <span className="text-sm font-bold text-leaf-900">Admin reply</span>
                  <textarea
                    value={replyMessage}
                    onChange={(event) => setReplyMessage(event.target.value)}
                    rows={4}
                    className="form-input mt-2 min-h-[140px] resize-none"
                  />
                </label>
                <div className="flex justify-end gap-3">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Spinner label="Sending" /> : <><Send className="mr-2" size={16} /> Send Reply</>}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-leaf-100 bg-leaf-50 p-8 text-center text-stone-600">
              Select a ticket to view details and reply.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
