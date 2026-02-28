/**
 * OilCalcApp Web — Main Entry Point
 * SPA with bottom tab navigation
 */

import './styles/index.css';

// Apply saved theme immediately
const savedTheme = localStorage.getItem('oilcalc-theme');
if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
}

import { renderCalculatorPage } from './pages/calculator-page.js';
import { renderTripPage } from './pages/trip-page.js';
import { renderHistoryPage } from './pages/history-page.js';
import { renderAboutPage } from './pages/about-page.js';

const tabs = [
    { id: 'calculator', icon: 'ƒ', label: 'Calculator', render: renderCalculatorPage },
    { id: 'trip', icon: '⇄', label: 'Trip Loss', render: renderTripPage },
    { id: 'history', icon: '🕐', label: 'History', render: renderHistoryPage },
    { id: 'about', icon: '⚙️', label: 'About', render: renderAboutPage },
];

let currentTab = 'calculator';

function init() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <div class="page-container" id="pageContainer"></div>
    <nav class="tab-bar" id="tabBar"></nav>
  `;

    renderTabBar();
    switchTab(currentTab);

    // Dismiss splash screen after minimum 2 seconds
    const splashMinTime = 2000;
    const startTime = performance.timing.navigationStart || Date.now();
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, splashMinTime - elapsed);

    setTimeout(() => {
        const splash = document.getElementById('splash');
        if (splash) {
            splash.classList.add('fade-out');
            setTimeout(() => splash.remove(), 700);
        }
    }, remaining);
}

function renderTabBar() {
    const tabBar = document.getElementById('tabBar');
    tabBar.innerHTML = tabs.map(tab => `
    <button class="tab-btn ${tab.id === currentTab ? 'active' : ''}" data-tab="${tab.id}">
      <span class="tab-icon">${tab.icon}</span>
      <span class="tab-label">${tab.label}</span>
    </button>
  `).join('');

    tabBar.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

function switchTab(tabId) {
    currentTab = tabId;
    const container = document.getElementById('pageContainer');
    container.innerHTML = '';
    container.scrollTop = 0;

    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
        container.appendChild(tab.render());
    }

    // Update tab bar active states
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
