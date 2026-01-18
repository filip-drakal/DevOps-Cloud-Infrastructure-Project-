// backend/routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET /api/transactions
router.get('/', async (req, res, next) => {
    try {
        const txs = await Transaction.findAll({ order: [['date', 'DESC']] });
        res.json(txs);
    } catch (err) {
        next(err);
    }
});

// POST /api/transactions
router.post('/', async (req, res, next) => {
    try {
        const { type, amount, category, description, date } = req.body;
        const tx = await Transaction.create({ type, amount, category, description, date });
        res.status(201).json(tx);
    } catch (err) {
        next(err);
    }
});

module.exports = router;