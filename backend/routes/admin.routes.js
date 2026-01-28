const express = require('express');
const router = express.Router();

const admin = require('../controllers/admin.controller');
const auth = require('../middleware/authMiddleware');

// ✅ PUBLIC ROUTES (NO AUTH)
router.post('/users', admin.createAdmin);
router.post('/login', admin.loginAdmin);

// 🔒 APPLY AUTH HERE — EVERYTHING BELOW IS PROTECTED
router.use(auth);

// Dashboard
router.get('/dashboard/stats', admin.dashboardStats);

// Farmers
router.get('/farmers', admin.getFarmers);
router.post('/farmers', admin.createFarmer);
router.get('/farmers/:id', admin.getFarmerById);
router.get('/farmers/:id/history', admin.getFarmerHistory);
router.get('/sell-requests', admin.getSellRequests);
router.post('/sell-requests', admin.createSellRequest);
router.patch('/sell-requests/:id/status', admin.updateSellRequestStatus);

// Buyers
router.get('/buyers', admin.getBuyers);
router.post('/buyers', admin.createBuyer);
router.get('/buyers/:id/orders', admin.getBuyerOrders);
router.get('/orders', admin.getOrders);

// Inventory
router.get('/inventory', admin.getInventory);
router.post('/inventory', admin.createInventory);
router.patch('/inventory/:id', admin.updateInventory);

// Prices
router.get('/prices', admin.getPrices);
router.patch('/prices/:crop', admin.updatePrice);

// Predictions
router.get('/predictions', admin.getPredictions);

// Weather & Alerts
router.get('/weather-alerts', admin.getWeatherAlerts);
router.post('/weather-alerts', admin.createWeatherAlert);
router.post('/system-alerts', admin.createSystemAlert);

// Reports
router.get('/reports/prices', admin.priceReport);
router.get('/reports/orders', admin.orderReport);
router.get('/reports/location', admin.locationReport);

// Users status
router.patch('/farmers/:id/status', admin.updateFarmerStatus);
router.patch('/buyers/:id/status', admin.updateBuyerStatus);

// Logs
router.get('/audit-logs', admin.getAuditLogs);

module.exports = router;
