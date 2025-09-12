import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { measureWebVitals, optimizeImages } from './utils/performance';

// Initialize performance monitoring
measureWebVitals();

// Optimize images after DOM is loaded
document.addEventListener('DOMContentLoaded', optimizeImages);

createRoot(document.getElementById("root")!).render(<App />);
