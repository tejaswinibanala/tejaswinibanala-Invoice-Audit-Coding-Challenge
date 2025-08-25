"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const uploadController_1 = require("./controllers/uploadController");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// File upload middleware
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// Routes
app.post('/api/upload', upload.single('invoice'), uploadController_1.uploadController);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Pharmacy Audit Backend Running' });
});
app.listen(PORT, () => {
    console.log(`Pharmacy Audit Backend running on port ${PORT}`);
});
