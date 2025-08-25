import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { uploadController } from './controllers/uploadController';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// File upload middleware
const upload = multer({ dest: 'uploads/' });

// Routes
app.post('/api/upload', upload.single('invoice'), uploadController);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pharmacy Audit Backend Running' });
});

app.listen(PORT, () => {
  console.log(`Pharmacy Audit Backend running on port ${PORT}`);
});
