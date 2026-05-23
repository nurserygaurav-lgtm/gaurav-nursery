import api from './api.js';

export async function createTicket(formData) {
  const { data } = await api.post('/tickets/create', formData);
  return data;
}

export async function getMyTickets() {
  const { data } = await api.get('/tickets/my');
  return data;
}

export async function getTicketById(id) {
  const { data } = await api.get(`/tickets/${id}`);
  return data;
}

export async function replyTicket(ticketId, formData) {
  const { data } = await api.put(`/tickets/reply/${ticketId}`, formData);
  return data;
}

export async function updateTicketStatus(ticketId, status) {
  const { data } = await api.put(`/tickets/status/${ticketId}`, { status });
  return data;
}

export async function deleteTicket(ticketId) {
  const { data } = await api.delete(`/tickets/${ticketId}`);
  return data;
}

export async function getAdminTickets(params = {}) {
  const { data } = await api.get('/admin/tickets', { params });
  return data;
}
