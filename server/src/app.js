import express from 'express';
import multer from 'multer';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { EpubParser } from '@ridi/epub-parser';
import { JSDOM } from 'jsdom';

const app = express();
const upload = multer();

// Remove punctuation except apostrophes
function extractTextOnly(text) {
  return text
    .replace(/[^\w\s'\.]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Split HTML into sections based on H1/H2/H3
function splitHtmlIntoSections(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const sections = [];
  let current = { title: 'Intro', text: '' };

  doc.body.childNodes.forEach((node) => {
    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.nodeName)) {
      if (current.text.trim()) sections.push(current);
      current = {
        title: node.textContent.trim(),
        text: '',
        level: node.nodeName,
      };
    } else {
      current.text += node.textContent + '\n';
    }
  });

  if (current.text.trim()) sections.push(current);
  return sections;
}

// Parse EPUB buffer
async function parseEpubFromBuffer(buffer) {
  // Save to temp file
  const tmpPath = path.join(os.tmpdir(), `upload-${Date.now()}.epub`);
  fs.writeFileSync(tmpPath, buffer);

  // Parse
  const parser = new EpubParser(tmpPath);
  const book = await parser.parse();

  const allSections = [];

  // Loop over spine items (reading order)
  for (const spineItem of book.spines) {
    const htmlText = await parser.readItem(spineItem, { extractBody: true });
    const sections = splitHtmlIntoSections(htmlText).map((sec) => ({
      ...sec,
      text: extractTextOnly(sec.text),
    }));
    allSections.push(...sections);
  }

  return {
    metadata: book.metadata,
    toc: book.toc,
    sections: allSections,
  };
}

// Express endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const epubData = await parseEpubFromBuffer(req.file.buffer);
    res.json(epubData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
