import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { generateSlides } from './generateSlide.js';

const upload = multer({ dest: 'uploads/' });
const app = express();

app.post('/api/generate', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('file is required');
  }
  try {
    const markdown = await generateSlides(req.file.path);
    fs.unlink(req.file.path, () => {});
    res.json({ markdown });
  } catch (err: any) {
    console.error(err);
    res.status(500).send('error generating slide');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
