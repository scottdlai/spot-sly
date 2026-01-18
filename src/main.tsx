import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Routes, Route } from 'react-router';
import Quiz from './components/quiz.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="/quiz" element={<Quiz />}></Route>
        {/* <Route path="/uploaded" element={<UploadedFile />}></Route> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
