/**
 * History Page — Port of HistoryView.swift
 */

import { HistoryService } from '../services/history-service.js';
import { formatMass, formatVolume } from '../domain/formatters.js';
import { showConfirm, showResultModal } from './shared.js';
import { CalculationType } from '../domain/models.js';

export function renderHistoryPage() {
    const page = document.createElement('div');
    page.className = 'page';

    const history = HistoryService.loadHistory();

    if (history.length === 0) {
        page.innerHTML = `
      <h1 class="page-title">History</h1>
      <div class="empty-state">
        <div class="empty-icon">🕐</div>
        <div class="empty-text">History is empty</div>
      </div>
    `;
        return page;
    }

    page.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">History</h1>
      <button class="toolbar-btn danger" id="clearAllBtn">Clear All</button>
    </div>
    <div id="historyList"></div>
  `;

    const list = page.querySelector('#historyList');
    renderItems(list, history);

    // Clear all
    page.querySelector('#clearAllBtn').addEventListener('click', async () => {
        const ok = await showConfirm({
            title: 'Clear all history?',
            message: 'All records will be deleted permanently.',
            confirmText: 'Clear',
            danger: true,
        });
        if (ok) {
            HistoryService.clearHistory();
            refreshHistoryPage();
        }
    });

    return page;
}

function renderItems(container, history) {
    container.innerHTML = '';
    history.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';

        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

        const typeName = entry.type === CalculationType.MAIN_CALC ? 'Calculator' : 'Loss Analysis';

        let details = '';
        if (entry.dualResult) {
            details = `At 15°C: ${formatVolume(entry.dualResult.at15)} l  |  At T: ${formatVolume(entry.dualResult.atT)} l`;
        }
        if (entry.tripResult) {
            details = `Δ Mass: ${formatMass(entry.tripResult.totalDelta?.massKg ?? entry.tripResult.deltaMassKg ?? 0)} kg`;
            if (entry.tripResult.totalDelta?.v15 != null) {
                details += `  |  Δ Vol (15°C): ${formatVolume(entry.tripResult.totalDelta.v15)} l`;
            }
        }

        item.innerHTML = `
      <div class="history-header">
        <span class="history-type">${typeName}</span>
        <span class="history-date">${dateStr}</span>
      </div>
      <div class="history-detail">${details}</div>
      <button class="history-delete btn-danger" data-id="${entry.id}" title="Delete">✕</button>
    `;

        // Click to view detail
        item.addEventListener('click', (e) => {
            if (e.target.closest('.history-delete')) return;
            showEntryDetail(entry);
        });

        // Delete
        item.querySelector('.history-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            HistoryService.removeEntry(entry.id);
            refreshHistoryPage();
        });

        container.appendChild(item);
    });
}

function showEntryDetail(entry) {
    if (entry.tripResult) {
        // Reuse trip result display
        import('./trip-page.js').then(() => {
            // Show a simplified version
            showTripHistoryResult(entry.tripResult);
        });
    } else if (entry.dualResult) {
        const r = entry.dualResult;
        let rows = '';

        if (entry.parameters?.mode === 'massToLiters') {
            rows += `<div class="result-row"><span class="label">Mode</span><span class="value">Mass → Liters</span></div>`;
        } else {
            rows += `<div class="result-row"><span class="label">Mode</span><span class="value">Liters → Mass</span></div>`;
        }

        if (entry.parameters?.density) {
            rows += `<div class="result-row"><span class="label">Density</span><span class="value">${entry.parameters.density}</span></div>`;
        }
        if (entry.parameters?.temperature) {
            rows += `<div class="result-row"><span class="label">Temperature</span><span class="value">${entry.parameters.temperature}°C</span></div>`;
        }
        rows += '<hr class="result-divider">';
        rows += `<div class="result-row"><span class="label">At 15°C</span><span class="value accent">${formatVolume(r.at15)} l</span></div>`;
        rows += `<div class="result-row"><span class="label">At T</span><span class="value accent">${formatVolume(r.atT)} l</span></div>`;

        showResultModal('Calculator Result', `<div class="result-card">${rows}</div>`);
    }
}

function showTripHistoryResult(tripResult) {
    const { formatMass, formatVolume, formatDensity, formatTemperature, formatPercent } =
        { formatMass, formatVolume, formatDensity: (v) => v?.toFixed(3) ?? '-', formatTemperature: (v) => v?.toFixed(1) ?? '-', formatPercent };

    let html = '<div class="result-card">';
    const d = tripResult.totalDelta || {};
    const mc = (d.massKg ?? 0) >= 0 ? 'positive' : 'negative';
    const v15c = (d.v15 ?? 0) >= 0 ? 'positive' : 'negative';

    html += `
    <div class="section-title" style="margin-top:0;">Total Analysis</div>
    <hr class="result-divider">
    <div class="delta-row">
      <span class="delta-label">Δ Mass</span>
      <div class="delta-values">
        <span class="delta-main ${mc}">${formatMass(d.massKg ?? 0)} kg</span>
        <span class="delta-percent ${mc}">(${formatPercent(d.massPercent ?? 0)}%)</span>
      </div>
    </div>
    <hr class="result-divider">
    <div class="delta-row">
      <span class="delta-label">Δ Volume (15°C)</span>
      <div class="delta-values">
        <span class="delta-main ${v15c}">${formatVolume(d.v15 ?? 0)} l</span>
        <span class="delta-percent ${v15c}">(${formatPercent(d.v15Percent ?? 0)}%)</span>
      </div>
    </div>
  `;
    html += '</div>';

    showResultModal('Trip Loss (History)', html);
}

function refreshHistoryPage() {
    const container = document.querySelector('.page-container');
    if (container) {
        container.innerHTML = '';
        container.appendChild(renderHistoryPage());
    }
}
