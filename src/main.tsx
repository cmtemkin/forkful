
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add Google Font
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap';
document.head.appendChild(link);

createRoot(document.getElementById("root")!).render(<App />);
