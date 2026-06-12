import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { createTicket, getMyTickets, replyTicket, updateTicketStatus } from '../../services/ticketService.js';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { StatusPill } from '../../components/dashboard/DashboardUI.jsx';
import { Paperclip, Send } from 'lucide-react';

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

const priorities = ['Low', 'Medium', 'High', 'Urgent'];
const statuses = ['open', 'pending', 'resolved', 'closed'];
const allowedMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

function formatDate(value) {
  return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function SupportTickets() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [form, setForm] = useState({
    subject: '',
    type: 'Product Issue',
    priority: 'Medium',
    orderId: '',
    productId: '',
    description: ''
  });
  const [files, setFiles] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyFiles, setReplyFiles] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
      const query = searchQuery.trim().toLowerCase();
      const textMatch = !query || [ticket.subject, ticket.type, ticket.ticketId, ticket.status].some((value) =>
        String(value).toLowerCase().includes(query)
      );
      return statusMatch && textMatch;
    });
  }, [filterStatus, searchQuery, tickets]);

  const loadTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      const { tickets: data } = await getMyTickets();
      setTickets(data || []);
      setSelectedTicket((current) => {
        const updated = data?.find((ticket) => ticket._id === current?._id);
        return updated || data?.[0] || null;
      });
    } catch (err) {
      showToast(err.message || 'Failed to load tickets', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  function handleFileChange(event) {
    const incoming = Array.from(event.target.files || []);
    const valid = [];
    const errors = [];

    incoming.forEach((file) => {
      if (!allowedMimeTypes.includes(file.type)) {
        errors.push(`${file.name} is not a supported file type.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name} exceeds the 10MB limit.`);
        return;
      }
      valid.push(file);
    });

    if (files.length + valid.length > 5) {
      errors.push('You can upload up to 5 files.');
    }

    if (errors.length) {
      showToast(errors.join(' '), 'error');
      return;
    }

    setFiles((current) => [...current, ...valid].slice(0, 5));
  }

  function handleReplyFileChange(event) {
    const incoming = Array.from(event.target.files || []);
    const valid = [];
    const errors = [];

    incoming.forEach((file) => {
      if (!allowedMimeTypes.includes(file.type)) {
        errors.push(`${file.name} is not a supported file type.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name} exceeds the 10MB limit.`);
        return;
      }
      valid.push(file);
    });

    if (replyFiles.length + valid.length > 5) {
      errors.push('You can upload up to 5 files in a reply.');
    }

    if (errors.length) {
      showToast(errors.join(' '), 'error');
      return;
    }

    setReplyFiles((current) => [...current, ...valid].slice(0, 5));
  }

  function removeFile(index) {
    setFiles((current) => current.filter((_, idx) => idx !== index));
  }

  function removeReplyFile(index) {
    setReplyFiles((current) => current.filter((_, idx) => idx !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) {
      showToast('Subject and description are required', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('subject', form.subject);
      formData.append('description', form.description);
      formData.append('type', form.type);
      formData.append('priority', form.priority);
      if (form.orderId.trim()) formData.append('orderId', form.orderId.trim());
      if (form.productId.trim()) formData.append('productId', form.productId.trim());
      files.forEach((file) => formData.append('attachments', file));

      const { ticket } = await createTicket(formData);
      setTickets((current) => [ticket, ...current]);
      setSelectedTicket(ticket);
      setForm({ subject: '', type: 'Product Issue', priority: 'Medium', orderId: '', productId: '', description: '' });
      setFiles([]);
      showToast('Ticket created successfully');
    } catch (err) {
      showToast(err.message || 'Failed to submit ticket', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSendReply(event) {
    event.preventDefault();
    if (!selectedTicket) return;
    if (!replyMessage.trim()) {
      showToast('Reply message is required', 'error');
      return;
    }

    try {
      setIsReplying(true);
      const formData = new FormData();
      formData.append('message', replyMessage.trim());
      replyFiles.forEach((file) => formData.append('attachments', file));
      const { ticket } = await replyTicket(selectedTicket._id, formData);
      setTickets((current) => current.map((item) => (item._id === ticket._id ? ticket : item)));
      setSelectedTicket(ticket);
      setReplyMessage('');
      setReplyFiles([]);
      showToast('Reply sent');
    } catch (err) {
      showToast(err.message || 'Failed to send reply', 'error');
    } finally {
      setIsReplying(false);
    }
  }

  async function handleStatusUpdate(newStatus) {
    if (!selectedTicket || selectedTicket.status === newStatus) return;
    try {
      setIsReplying(true);
      const { ticket } = await updateTicketStatus(selectedTicket._id, newStatus);
      setTickets((current) => current.map((item) => (item._id === ticket._id ? ticket : item)));
      setSelectedTicket(ticket);
      showToast('Ticket status updated');
    } catch (err) {
      showToast(err.message || 'Unable to update status', 'error');
    } finally {
      setIsReplying(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-leaf-100 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf-600">Seller support</p>
            <h1 className="mt-2 text-3xl font-black text-leaf-950">Create and manage your support tickets</h1>
            <p className="mt-2 text-sm text-stone-600">Submit a ticket, attach screenshots, and track the status of your requests in one place.</p>
          </div>
          <div className="rounded-3xl bg-leaf-50 px-4 py-3 text-sm font-black text-leaf-950 shadow-soft">
            {user?.name ? `Logged in as ${user.name}` : 'Seller support portal'}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.3fr]">
        <section className="rounded-[2rem] border border-leaf-100 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-leaf-950">Submit a support ticket</h2>
              <p className="mt-1 text-sm text-stone-600">Provide as much detail as possible to help our support team resolve your issue faster.</p>
            </div>
            <div className="rounded-full bg-leaf-100 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-leaf-700">Seller only</div>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-leaf-900">Seller Name</span>
                <input readOnly value={user?.name || ''} className="form-input mt-2 w-full bg-stone-50" />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-leaf-900">Email</span>
                <input readOnly value={user?.email || ''} className="form-input mt-2 w-full bg-stone-50" />
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <label className="block">
                <span className="text-sm font-bold text-leaf-900">Subject</span>
                <input
                  value={form.subject}
                  onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                  className="form-input mt-2 w-full"
                  placeholder="Brief summary of the issue"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-leaf-900">Ticket Type</span>
                <select
                  value={form.type}
                  onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                  className="form-input mt-2 w-full"
                >
                  {ticketTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <label className="block">
                <span className="text-sm font-bold text-leaf-900">Priority</span>
                <select
                  value={form.priority}
                  onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
                  className="form-input mt-2 w-full"
                >
                  {priorities.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-leaf-900">Order ID (optional)</span>
                  <input
                    value={form.orderId}
                    onChange={(event) => setForm((current) => ({ ...current, orderId: event.target.value }))}
                    className="form-input mt-2 w-full"
                    placeholder="GN-ORD-1234"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-leaf-900">Product ID (optional)</span>
                  <input
                    value={form.productId}
                    onChange={(event) => setForm((current) => ({ ...current, productId: event.target.value }))}
                    className="form-input mt-2 w-full"
                    placeholder="GN-PRD-4567"
                  />
                </label>
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-leaf-900">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                rows={6}
                className="form-input mt-2 min-h-[180px] resize-none"
                placeholder="Describe the issue with as much context as possible..."
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between gap-4 text-sm font-bold text-leaf-900">
                <span>Attachments</span>
                <span className="text-stone-500">Up to 5 files, 10MB each</span>
              </div>
              <div className="mt-2 flex items-center gap-3 rounded-3xl border border-dashed border-leaf-200 bg-leaf-50 p-4">
                <Paperclip className="text-leaf-600" size={18} />
                <input type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} className="w-full text-sm text-stone-600" />
              </div>
            </label>

            {files.length > 0 && (
              <div className="rounded-3xl bg-leaf-50 p-4">
                <div className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-leaf-600">Selected attachments</div>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <div>
                        <p className="text-sm font-bold text-leaf-950">{file.name}</p>
                        <p className="text-xs text-stone-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-sm font-bold text-red-600 hover:text-red-700">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner label="Submitting" /> : 'Submit Ticket'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setForm({ subject: '', type: 'Product Issue', priority: 'Medium', orderId: '', productId: '', description: '' })}>
                Cancel
              </Button>
            </div>
          </form>
        </section>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-leaf-100 bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-leaf-950">Your tickets</h2>
                <p className="mt-1 text-sm text-stone-600">Review ticket status, priority, and support replies.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={filterStatus}
                  onChange={(event) => setFilterStatus(event.target.value)}
                  className="form-input rounded-full"
                >
                  <option value="all">All statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search tickets"
                  className="form-input rounded-full"
                />
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-3xl border border-leaf-100 bg-leaf-50">
              {isLoading ? (
                <div className="p-6 text-center text-leaf-700">
                  <Spinner label="Loading tickets" />
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="p-8 text-center text-stone-600">No tickets found. Create a new support ticket above.</div>
              ) : (
                <div className="divide-y divide-leaf-100">
                  {filteredTickets.map((ticket) => (
                    <button
                      key={ticket._id}
                      type="button"
                      onClick={() => setSelectedTicket(ticket)}
                      className={`w-full px-5 py-4 text-left transition ${selectedTicket?._id === ticket._id ? 'bg-leaf-100' : 'hover:bg-white'}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-black text-leaf-950">{ticket.subject}</p>
                          <p className="mt-1 text-sm text-stone-500">{ticket.ticketId} · {ticket.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusPill status={ticket.status} />
                          <span className="text-sm text-stone-500">{formatDate(ticket.updatedAt)}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedTicket && (
            <div className="rounded-[2rem] border border-leaf-100 bg-white p-6 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf-600">Ticket details</p>
                  <h3 className="mt-2 text-2xl font-black text-leaf-950">{selectedTicket.subject}</h3>
                  <p className="mt-2 text-sm text-stone-600">{selectedTicket.ticketId} · {selectedTicket.type}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusPill status={selectedTicket.status} />
                  <select
                    value={selectedTicket.status}
                    onChange={(event) => handleStatusUpdate(event.target.value)}
                    className="form-input rounded-full"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-leaf-50 p-5">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf-600">Description</p>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{selectedTicket.description}</p>
                </div>

                {selectedTicket.attachments?.length > 0 && (
                  <div className="rounded-3xl bg-leaf-50 p-5">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf-600">Attachments</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {selectedTicket.attachments.map((attachment, index) => (
                        <a key={index} href={attachment.url} target="_blank" rel="noreferrer" className="rounded-3xl border border-leaf-100 bg-white p-4 text-sm font-bold text-leaf-950 transition hover:border-leaf-300">
                          {attachment.filename}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-3xl bg-leaf-50 p-5">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf-600">Conversation</p>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-3xl border border-leaf-100 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black text-leaf-950">Seller</p>
                        <span className="text-xs text-stone-500">{formatDate(selectedTicket.createdAt)}</span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-stone-600">{selectedTicket.description}</p>
                    </div>
                    {selectedTicket.replies?.map((reply, index) => (
                      <div key={index} className="rounded-3xl border border-leaf-100 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-black text-leaf-950">{reply.sender === 'admin' ? 'Support' : 'Seller'}</p>
                          <span className="text-xs text-stone-500">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-stone-600">{reply.message}</p>
                        {reply.attachments?.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {reply.attachments.map((attachment, idx) => (
                              <a key={idx} href={attachment.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-leaf-100 bg-leaf-50 px-3 py-2 text-sm font-bold text-leaf-900">
                                {attachment.filename}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <form className="space-y-5" onSubmit={handleSendReply}>
                  <label className="block">
                    <span className="text-sm font-bold text-leaf-900">Reply</span>
                    <textarea
                      value={replyMessage}
                      onChange={(event) => setReplyMessage(event.target.value)}
                      rows={4}
                      className="form-input mt-2 min-h-[140px] resize-none"
                      placeholder="Write your reply to support..."
                    />
                  </label>

                  <label className="block">
                    <div className="flex items-center justify-between gap-4 text-sm font-bold text-leaf-900">
                      <span>Reply attachments</span>
                      <span className="text-stone-500">Optional, up to 5 files</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 rounded-3xl border border-dashed border-leaf-200 bg-leaf-50 p-4">
                      <Paperclip className="text-leaf-600" size={18} />
                      <input type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleReplyFileChange} className="w-full text-sm text-stone-600" />
                    </div>
                  </label>

                  {replyFiles.length > 0 && (
                    <div className="rounded-3xl bg-leaf-50 p-4">
                      <div className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-leaf-600">Reply attachments</div>
                      <div className="space-y-2">
                        {replyFiles.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                            <div>
                              <p className="text-sm font-bold text-leaf-950">{file.name}</p>
                              <p className="text-xs text-stone-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button type="button" onClick={() => removeReplyFile(index)} className="text-sm font-bold text-red-600 hover:text-red-700">
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={isReplying}>
                      {isReplying ? <Spinner label="Sending" /> : <><Send className="mr-2" size={16} /> Send Reply</>}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setReplyMessage(''); setReplyFiles([]); }}>
                      Clear
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
