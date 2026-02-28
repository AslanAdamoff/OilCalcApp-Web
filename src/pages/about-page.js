/**
 * About Page — Port of AboutView.swift + SettingsView.swift
 * Bilingual EN/RU content about the app and standards
 */

export function renderAboutPage() {
    const page = document.createElement('div');
    page.className = 'page';

    let lang = 'en';

    function render() {
        page.innerHTML = `
      <h1 class="page-title">${lang === 'en' ? 'About' : 'О приложении'}</h1>

      <!-- Language Switcher -->
      <div class="card" style="padding: 10px;">
        <div class="segmented">
          <input type="radio" name="aboutLang" id="langEn" value="en" ${lang === 'en' ? 'checked' : ''}>
          <label for="langEn">English</label>
          <input type="radio" name="aboutLang" id="langRu" value="ru" ${lang === 'ru' ? 'checked' : ''}>
          <label for="langRu">Русский</label>
        </div>
      </div>

      ${lang === 'en' ? renderEnglish() : renderRussian()}

      <div style="text-align: center; margin-top: var(--spacing-xl); padding: var(--spacing-lg); color: var(--text-muted); font-size: var(--font-xs);">
        OilCalcApp Web v1.0<br>
        Created by <strong style="color: var(--accent);">Aslan Adamov</strong><br>
        All rights reserved.
      </div>
    `;

        page.querySelectorAll('input[name="aboutLang"]').forEach(r => {
            r.addEventListener('change', (e) => {
                lang = e.target.value;
                render();
            });
        });
    }

    render();
    return page;
}

function renderEnglish() {
    return `
    <div class="card">
      <div class="about-section">
        <h3>Description</h3>
        <p>OilCalcApp is a professional tool for surveyors and logistics specialists designed for accurate conversion of mass and volume of petroleum products, as well as analysis of discrepancies (losses) during transportation.</p>
      </div>
    </div>

    <div class="card">
      <div class="about-section">
        <h3>Key Features</h3>
        
        <p class="about-feature-title">1. Conversion Calculator:</p>
        <ul>
          <li>Calculation of volume at 15°C and actual temperature based on mass and density.</li>
          <li>Reverse calculation (mass from volume).</li>
        </ul>

        <p class="about-feature-title">2. Loss Analysis (Trip Calculator):</p>
        <ul>
          <li>Comparison of cargo quantity between multiple route points (loading, discharge, transit).</li>
          <li>Detailed analysis of discrepancies (Delta) by mass and volume for each segment.</li>
          <li>Support for unlimited number of points.</li>
        </ul>

        <p class="about-feature-title">3. Data Management:</p>
        <ul>
          <li>Template system for saving regular routes.</li>
          <li>Full calculation history with detailed view.</li>
        </ul>
      </div>
    </div>

    <div class="card">
      <div class="about-section">
        <h3>Standards and Methodology</h3>
        <p style="margin-bottom: var(--spacing-sm);">The application uses algorithms compliant with international standards for oil and petroleum product calculations:</p>
        <ul>
          <li><span class="about-standard">ASTM D1250-04 / API MPMS Chapter 11.1</span> — Standard Volume Correction Tables.</li>
          <li><span class="about-standard">Table 54A / 54B</span> — For volume correction to 15°C (Generalized Crude Oils & Products).</li>
          <li><span class="about-standard">Table 60A / 60B</span> — For density conversion.</li>
          <li><span class="about-standard">VCF</span> — Uses thermal expansion coefficients for crude oil, fuels, and lubricating oils.</li>
          <li>Units: Mass (kg), Density (kg/l), Temperature (°C).</li>
        </ul>
      </div>
    </div>
  `;
}

function renderRussian() {
    return `
    <div class="card">
      <div class="about-section">
        <h3>Описание</h3>
        <p>OilCalcApp — это профессиональный инструмент для сюрвейеров и специалистов по логистике, предназначенный для точного пересчета массы и объема нефтепродуктов, а также анализа расхождений (потерь) при транспортировке.</p>
      </div>
    </div>

    <div class="card">
      <div class="about-section">
        <h3>Основные возможности</h3>
        
        <p class="about-feature-title">1. Калькулятор пересчета:</p>
        <ul>
          <li>Расчет объема при 15°C и фактической температуре на основе массы и плотности.</li>
          <li>Обратный расчет (массы по объему).</li>
        </ul>

        <p class="about-feature-title">2. Анализ потерь (Trip Calculator):</p>
        <ul>
          <li>Сравнение количества груза между несколькими точками маршрута (погрузка, выгрузка, транзит).</li>
          <li>Детальный анализ расхождений (Delta) по массе и объему для каждого сегмента пути.</li>
          <li>Поддержка неограниченного количества точек.</li>
        </ul>

        <p class="about-feature-title">3. Управление данными:</p>
        <ul>
          <li>Система шаблонов для сохранения регулярных маршрутов.</li>
          <li>Полная история расчетов с детализацией.</li>
        </ul>
      </div>
    </div>

    <div class="card">
      <div class="about-section">
        <h3>Используемые стандарты</h3>
        <p style="margin-bottom: var(--spacing-sm);">Приложение использует алгоритмы, соответствующие международным стандартам для расчетов нефти и нефтепродуктов:</p>
        <ul>
          <li><span class="about-standard">ASTM D1250-04 / API MPMS Chapter 11.1</span> — Стандартные таблицы коррекции объемов.</li>
          <li><span class="about-standard">Table 54A / 54B</span> — Для коррекции объема к 15°C (Generalized Crude Oils & Products).</li>
          <li><span class="about-standard">Table 60A / 60B</span> — Для пересчета плотности.</li>
          <li><span class="about-standard">VCF</span> — Коэффициенты теплового расширения для сырой нефти, топлив и смазочных масел.</li>
          <li>Единицы измерения: Масса (kg), Плотность (kg/l), Температура (°C).</li>
        </ul>
      </div>
    </div>
  `;
}
