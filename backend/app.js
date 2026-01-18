// backend/app.js
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const sequelize = require('./sequelize');
const transactionsRouter = require('./routes/transactions');

const app = express();

 // 1) CORS — must come *before* any routes!
    app.use(cors({
          origin: process.env.NODE_ENV === 'development'
              ? 'http://localhost:3000'
         : `https://${process.env.BUDGET_DOMAIN}`,
       credentials: true
 }));
// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// API routes
app.use('/api/transactions', transactionsRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({error: 'Not Found'});
});

// Error handler (note the 4 params!)
 app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
});



// Sync DB and start a server
    const PORT = process.env.PORT || 4000;
    sequelize.sync()
        .then(() => {
            console.log('Database synced');
            app.listen(PORT, () => {
                console.log(`Server listening on port ${PORT}`);
            });
        })
        .catch(err => {
            console.error('Unable to sync database:', err);
            process.exit(1);
        });
    app.use(cors({
        origin: [
            `https://${process.env.BUDGET_DOMAIN}`,
            `https://api.${process.env.BUDGET_DOMAIN}`
        ],
        credentials: true
    }))