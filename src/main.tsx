import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Routes, Route } from 'react-router';
import SpeedReaderComponent from './reader/index.tsx';
import UploadedFile from './pages/UploadedFile.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="/reader" element={<SpeedReaderComponent />}></Route>
        <Route path="/uploaded" element={<UploadedFile />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
