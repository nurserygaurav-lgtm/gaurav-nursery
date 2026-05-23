import asyncHandler from '../middleware/asyncHandler.js';
import Ticket from '../models/Ticket.js';
import { uploadTicketAttachments } from '../utils/uploadAttachments.js';

export const createTicket = asyncHandler(async (req, res) => {
  const { subject, description, type, priority, orderId, productId } = req.body;

  if (!subject?.trim() || !description?.trim() || !type || !priority) {
    res.status(400);
    throw new Error('Subject, description, type, and priority are required');
  }

  const attachments = await uploadTicketAttachments(req.files || []);

  const ticket = await Ticket.create({
    seller: req.user._id,
    subject: subject.trim(),
    description: description.trim(),
    type,
    priority,
    orderId: orderId?.trim() || undefined,
    productId: productId?.trim() || undefined,
    attachments
  });

  res.status(201).json({ ticket });
});

export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ seller: req.user._id })
    .sort({ updatedAt: -1 })
    .lean();

  res.json({ tickets });
});

export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).populate('seller', 'name email sellerProfile.shopName');

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  if (req.user.role === 'seller' && ticket.seller._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Forbidden');
  }

  res.json({ ticket });
});

export const getAdminTickets = asyncHandler(async (req, res) => {
  const { status, priority, type, search, page = 1, limit = 50 } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (type) filter.type = type;
  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    filter.$or = [
      { subject: searchRegex },
      { description: searchRegex },
      { ticketId: searchRegex },
      { orderId: searchRegex },
      { productId: searchRegex }
    ];
  }

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (currentPage - 1) * pageSize;

  const [tickets, totalTickets, openTickets, highPriorityCount, resolvedToday] = await Promise.all([
    Ticket.find(filter)
      .populate('seller', 'name email sellerProfile.shopName')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Ticket.countDocuments(filter),
    Ticket.countDocuments({ ...filter, status: 'open' }),
    Ticket.countDocuments({ ...filter, priority: { $in: ['High', 'Urgent'] } }),
    Ticket.countDocuments({
      ...filter,
      status: 'resolved',
      updatedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    })
  ]);

  res.json({
    tickets,
    analytics: {
      totalTickets,
      openTickets,
      highPriorityCount,
      resolvedToday
    }
  });
});

export const replyTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  if (req.user.role === 'seller' && ticket.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Forbidden');
  }

  if (!req.body.message?.trim()) {
    res.status(400);
    throw new Error('Reply message is required');
  }

  const attachments = await uploadTicketAttachments(req.files || []);

  ticket.replies.push({
    sender: req.user.role === 'admin' ? 'admin' : 'seller',
    message: req.body.message.trim(),
    attachments
  });

  if (req.body.status && ['open', 'pending', 'resolved', 'closed'].includes(req.body.status)) {
    ticket.status = req.body.status;
  }

  await ticket.save();
  res.json({ ticket });
});

export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['open', 'pending', 'resolved', 'closed'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid ticket status');
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  if (req.user.role === 'seller' && ticket.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Forbidden');
  }

  ticket.status = status;
  await ticket.save();
  res.json({ ticket });
});

export const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  await ticket.deleteOne();
  res.json({ success: true });
});
