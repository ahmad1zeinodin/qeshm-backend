import express from 'express';
import Ticket from '../models/Ticket.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// POST /api/tickets — ایجاد تیکت جدید توسط مشتری
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'متن پیام الزامی است.' });

    const ticket = await Ticket.create({
      userId: req.user.id,
      userName: req.user.name,
      userPhone: req.user.phone,
      userEmail: req.user.email,
      messages: [{
        senderId: req.user.id,
        senderName: req.user.name,
        senderRole: 'client',
        text,
      }],
    });
    res.status(201).json({ success: true, data: ticket, message: 'تیکت ثبت شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tickets — دریافت تیکت‌ها (برای مشتری: فقط خودش، برای ادمین: همه)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') filter.userId = req.user.id;
    const tickets = await Ticket.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/tickets/:id/reply — پاسخ به تیکت
router.post('/:id/reply', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'تیکت یافت نشد.' });

    ticket.messages.push({
      senderId: req.user.id,
      senderName: req.user.name,
      senderRole: req.user.role === 'admin' ? 'admin' : 'client',
      text,
    });
    ticket.updatedAt = new Date();
    await ticket.save();

    res.json({ success: true, data: ticket, message: 'پاسخ ثبت شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
