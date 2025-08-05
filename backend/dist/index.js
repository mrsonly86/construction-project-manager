"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./utils/database");
// Import routes
const projects_1 = __importDefault(require("./routes/projects"));
const workItems_1 = __importDefault(require("./routes/workItems"));
const materials_1 = __importDefault(require("./routes/materials"));
const equipment_1 = __importDefault(require("./routes/equipment"));
const workers_1 = __importDefault(require("./routes/workers"));
const reports_1 = __importDefault(require("./routes/reports"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Initialize Database
let dbInitialized = false;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/projects', projects_1.default);
app.use('/api/work-items', workItems_1.default);
app.use('/api/materials', materials_1.default);
app.use('/api/equipment', equipment_1.default);
app.use('/api/workers', workers_1.default);
app.use('/api/reports', reports_1.default);
// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        if (!dbInitialized) {
            await (0, database_1.initializeDatabase)();
            dbInitialized = true;
        }
        res.json({ status: 'OK', timestamp: new Date().toISOString(), database: 'Connected' });
    }
    catch (error) {
        res.status(500).json({ status: 'ERROR', timestamp: new Date().toISOString(), error: 'Database connection failed' });
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Start server
const startServer = async () => {
    try {
        await (0, database_1.initializeDatabase)();
        dbInitialized = true;
        console.log('📚 Database initialized successfully');
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map