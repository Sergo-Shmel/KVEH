import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Получаем контейнер
const container = document.getElementById('root');

// Создаем root
const root = createRoot(container);

// Рендерим приложение
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);