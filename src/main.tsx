import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { HashRouter, Routes, Route } from 'react-router';
import Quiz from './components/quiz.tsx';

// Initialize theme from localStorage before React renders
const THEME_STORAGE_KEY = 'app-theme';
const DEFAULT_THEME = 'default';
const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
document.documentElement.setAttribute('data-theme', storedTheme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        {/* <Route path="/quiz" element={<Quiz />}></Route> */}
        {/* <Route path="/uploaded" element={<UploadedFile />}></Route> */}
      </Routes>
    </HashRouter>
  </StrictMode>
);
