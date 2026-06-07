import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';
import React from 'react';
import AppRoot from './AppRoot.jsx';

window.route = route;

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <AppRoot />
    </React.StrictMode>
);