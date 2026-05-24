const API_BASE_URL = window.SERENEPATH_API_BASE_URL || 'http://localhost:3000/api';

// Progress tracking system
function calculateProgress() {
  const form = document.getElementById('assessmentForm');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  
  // Count filled fields
  let filledCount = 0;
  
  // 1. Age input
  const ageInput = document.getElementById('ageInput');
  if (ageInput && ageInput.value && ageInput.value.trim() !== '') {
    filledCount++;
  }
  
  // 2. Gender Identity select
  const genderSelect = document.getElementById('genderSelect');
  if (genderSelect && genderSelect.value !== '') {
    filledCount++;
  }
  
  // 3. Occupation input
  const occupationInput = document.getElementById('occupationInput');
  if (occupationInput && occupationInput.value && occupationInput.value.trim() !== '') {
    filledCount++;
  }
  
  // 4. Sleep Duration (active button)
  const activeSleep = document.querySelector('[data-sleep-duration].active');
  if (activeSleep) {
    filledCount++;
  }
  
  // 5. Diet Quality input
  const dietQuality = document.getElementById('dietQualityInput');
  if (dietQuality && dietQuality.value && parseInt(dietQuality.value) > 1) {
    filledCount++;
  }
  
  // 6. Caffeine Intake select
  const caffeinInput = document.getElementById('caffeinInput');
  if (caffeinInput && caffeinInput.value !== '') {
    filledCount++;
  }
  
  // 7. Smoking (Yes/No button)
  const activeSmokingBtn = document.querySelector('[data-smoking-btn].active');
  if (activeSmokingBtn) {
    filledCount++;
  }
  
  // 8. Alcohol (number of times per week)
  const alcoholInput = document.getElementById('alcoholInput');
  if (alcoholInput && alcoholInput.value && alcoholInput.value.trim() !== '') {
    filledCount++;
  }
  
  // 9. Heart Rate input
  const heartRateInput = document.getElementById('heartRateInput');
  if (heartRateInput && heartRateInput.value && heartRateInput.value.trim() !== '') {
    filledCount++;
  }
  
  // 10. Physical Activity input
  const physicalActivityInput = document.getElementById('physicalActivityInput');
  if (physicalActivityInput && physicalActivityInput.value && physicalActivityInput.value.trim() !== '') {
    filledCount++;
  }
  
  // 11. Breathing Rate input
  const breathingRateInput = document.getElementById('breathingRateInput');
  if (breathingRateInput && breathingRateInput.value && breathingRateInput.value.trim() !== '') {
    filledCount++;
  }
  
  // 12. Sweating Intensity range
  const sweatingIntensityInput = document.getElementById('sweatingIntensityInput');
  if (sweatingIntensityInput && sweatingIntensityInput.value) {
    filledCount++;
  }
  
  // 13. Stress Level (active button)
  const activeStress = document.querySelector('[data-stress-level].active');
  if (activeStress) {
    filledCount++;
  }
  
  // 14. Family History toggle
  const familyToggle = document.querySelector('[data-family-history-toggle].active');
  if (familyToggle) {
    filledCount++;
  }
  
  // 15. Active Medication button
  const activeMedicationBtn = document.querySelector('[data-medication-btn].active');
  if (activeMedicationBtn) {
    filledCount++;
  }
  
  // 16. Therapy Sessions input
  const therapySessionsInput = document.getElementById('therapySessionsInput');
  if (therapySessionsInput && therapySessionsInput.value && therapySessionsInput.value.trim() !== '') {
    filledCount++;
  }
  
  // 17. Major Recent Life Event textarea
  const lifeEventInput = document.getElementById('lifeEventInput');
  if (lifeEventInput && lifeEventInput.value && lifeEventInput.value.trim() !== '') {
    filledCount++;
  }
  
  // 18. Dizziness button
  const activeDizzinessBtn = document.querySelector('[data-dizziness-btn].active');
  if (activeDizzinessBtn) {
    filledCount++;
  }
  
  // Calculate percentage (18 main fields)
  const totalFields = 18;
  const progress = Math.round((filledCount / totalFields) * 100);
  
  // Update progress bar
  progressBar.style.width = progress + '%';
  progressText.textContent = progress + '% Complete';
}

function getActiveValue(selector) {
  const activeElement = document.querySelector(`${selector}.active`);
  return activeElement ? activeElement.dataset.value : null;
}

function sleepDurationToHours(value) {
  const sleepMap = {
    '4-6h': 5,
    '6-8h': 7,
    '8h+': 9
  };

  return sleepMap[value] ?? null;
}

function normalizeGender(value) {
  if (value === 'Male' || value === 'Female') {
    return value;
  }

  return value ? 'Other' : '';
}

function getNumberInput(id) {
  const value = document.getElementById(id)?.value;
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return Number(value);
}

function buildPredictionPayload() {
  const lifeEventText = document.getElementById('lifeEventInput')?.value.trim() || '';
  const modelName = document.getElementById('modelSelect')?.value || 'final';

  return {
    model_name: modelName,

    age: getNumberInput('ageInput'),
    gender: normalizeGender(document.getElementById('genderSelect')?.value),
    occupation: document.getElementById('occupationInput')?.value.trim(),

    sleepHours: sleepDurationToHours(getActiveValue('[data-sleep-duration]')),
    physicalActivity: getNumberInput('physicalActivityInput'),
    caffeineIntake: getNumberInput('caffeinInput'),
    alcoholConsumption: getNumberInput('alcoholInput'),
    smoking: getActiveValue('[data-smoking-btn]') === 'yes',
    dietQuality: getNumberInput('dietQualityInput'),
    recentMajorLifeEvent: lifeEventText.length > 0,

    stressLevel: Number(getActiveValue('[data-stress-level]')),
    heartRate: getNumberInput('heartRateInput'),
    breathingRate: getNumberInput('breathingRateInput'),
    sweatingLevel: getNumberInput('sweatingIntensityInput'),
    dizziness: getActiveValue('[data-dizziness-btn]') === 'yes',

    familyHistoryOfAnxiety: Boolean(document.querySelector('[data-family-history-toggle].active')),
    medication: getActiveValue('[data-medication-btn]') === 'yes',
    therapySessions: getNumberInput('therapySessionsInput')
  };
}

function getMissingFields(payload) {
  const requiredFields = [
    ['age', 'Age'],
    ['gender', 'Gender'],
    ['occupation', 'Occupation'],
    ['sleepHours', 'Sleep duration'],
    ['physicalActivity', 'Physical activity'],
    ['caffeineIntake', 'Caffeine intake (mg/day)'],
    ['alcoholConsumption', 'Alcohol (drinks/week)'],
    ['dietQuality', 'Diet quality'],
    ['stressLevel', 'Stress level'],
    ['heartRate', 'Heart rate'],
    ['breathingRate', 'Breathing rate (breaths/min)'],
    ['sweatingLevel', 'Sweating intensity'],
    ['therapySessions', 'Therapy sessions']
  ];

  // dizziness is optional but we still show warning if not selected
  const dizzyVal = getActiveValue('[data-dizziness-btn]');
  if (!dizzyVal) {
    // Prepend a soft warning but don't block
  }

  return requiredFields
    .filter(([key]) => payload[key] === null || payload[key] === undefined || payload[key] === '' || Number.isNaN(payload[key]))
    .map(([, label]) => label);
}

function getSelectedModelNames() {
  const modelSelect = document.getElementById('modelSelect');
  const selectedModel = modelSelect?.value || 'final';
  const comparisonEnabled = document.getElementById('comparisonToggle')?.classList.contains('active');

  if (!comparisonEnabled) {
    return [selectedModel];
  }

  const modelOptions = Array.from(modelSelect?.options || [])
    .map((option) => option.value)
    .filter(Boolean);

  return Array.from(new Set(modelOptions));
}

async function requestPrediction(payload, modelName) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...payload,
      model_name: modelName
    })
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || result.error?.message || 'Prediction failed');
  }

  return result.data;
}

async function loadAvailableModels() {
  const modelSelect = document.getElementById('modelSelect');
  const modelLoadStatus = document.getElementById('modelLoadStatus');

  if (!modelSelect) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/models`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to load saved models');
    }

    const modelOptions = [
      {
        name: 'final',
        display_name: 'Final / Best Model'
      },
      ...(result.models || [])
    ];

    modelSelect.innerHTML = modelOptions
      .map((model) => {
        const metrics = model.metrics?.mae !== undefined ? ` - MAE ${Number(model.metrics.mae).toFixed(3)}` : '';
        const bestMark = model.is_best ? ' (best base)' : '';
        return `<option value="${model.name}">${model.display_name || model.name}${bestMark}${metrics}</option>`;
      })
      .join('');

    if (modelLoadStatus) {
      modelLoadStatus.textContent = `${modelOptions.length} prediction options loaded.`;
    }
  } catch (error) {
    modelSelect.innerHTML = '<option value="final">Final / Best Model</option>';
    if (modelLoadStatus) {
      modelLoadStatus.textContent = 'Model list unavailable until Backend/saved_models is generated.';
    }
  }
}

async function submitPrediction(event) {
  event.preventDefault();

  const submitButton = event.submitter || document.querySelector('#assessmentForm button[type="submit"]');
  const payload = buildPredictionPayload();
  const missingFields = getMissingFields(payload);

  if (missingFields.length > 0) {
    alert(`Please complete these fields first: ${missingFields.join(', ')}`);
    return;
  }

  const originalButtonHtml = submitButton?.innerHTML;
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = 'Generating Prediction... <span class="material-symbols-outlined">hourglass_top</span>';
  }

  try {
    const modelNames = getSelectedModelNames();
    const predictions = await Promise.all(
      modelNames.map((modelName) => requestPrediction(payload, modelName))
    );

    const selectedPrediction = predictions.find((prediction) => prediction.input?.model_name === payload.model_name) || predictions[0];
    const finalPrediction = {
      ...selectedPrediction,
      comparisons: predictions
    };
    
    // Display result inline instead of redirecting
    displayResult(finalPrediction);
    
    // Hide submit button and show result section
    if (submitButton) submitButton.parentElement.style.display = 'none';
    const resultSection = document.getElementById('resultSection');
    if (resultSection) {
      resultSection.classList.remove('hidden');
      resultSection.scrollIntoView({ behavior: 'smooth' });
    }
  } catch (error) {
    alert(`Cannot generate prediction yet: ${error.message}`);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonHtml;
    }
  }
}

// Add event listeners to track input changes
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('assessmentForm');
  
  if (!form) return;
  
  // Track text, number, and range inputs
  const inputs = form.querySelectorAll('input[type="text"], input[type="number"], input[type="range"], select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', calculateProgress);
    input.addEventListener('change', calculateProgress);
  });
  
  // Update Diet Quality display value
  const dietQualityInput = document.getElementById('dietQualityInput');
  const dietQualityDisplay = document.getElementById('dietQualityDisplay');
  if (dietQualityInput && dietQualityDisplay) {
    const updateDietDisplay = () => {
      const value = parseInt(dietQualityInput.value);
      dietQualityDisplay.textContent = String(value).padStart(2, '0');
    };
    dietQualityInput.addEventListener('input', updateDietDisplay);
    updateDietDisplay(); // Initialize
  }

  const sweatingIntensityInput = document.getElementById('sweatingIntensityInput');
  const sweatingIntensityDisplay = document.getElementById('sweatingIntensityDisplay');
  if (sweatingIntensityInput && sweatingIntensityDisplay) {
    const updateSweatingDisplay = () => {
      const value = parseInt(sweatingIntensityInput.value);
      sweatingIntensityDisplay.textContent = String(value).padStart(2, '0');
    };
    sweatingIntensityInput.addEventListener('input', updateSweatingDisplay);
    updateSweatingDisplay();
  }
  
  // Track button clicks for Sleep Duration
  const sleepButtons = form.querySelectorAll('[data-sleep-duration]');
  sleepButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      sleepButtons.forEach(b => b.classList.remove('active', 'border-primary', 'bg-surface-container-lowest', 'text-primary'));
      sleepButtons.forEach(b => b.classList.add('bg-surface-container-highest', 'text-on-surface-variant'));
      this.classList.remove('bg-surface-container-highest', 'text-on-surface-variant');
      this.classList.add('active', 'border-primary', 'bg-surface-container-lowest', 'text-primary');
      calculateProgress();
      e.preventDefault();
    });
  });
  
  // Track button clicks for Stress Level
  const stressButtons = form.querySelectorAll('[data-stress-level]');
  stressButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      stressButtons.forEach(b => {
        b.classList.remove('active', 'bg-primary', 'text-on-primary');
        b.classList.add('bg-surface-container-highest');
      });
      this.classList.remove('bg-surface-container-highest');
      this.classList.add('active', 'bg-primary', 'text-on-primary');
      calculateProgress();
      e.preventDefault();
    });
  });
  
  // Track Family History toggle
  const familyToggle = document.querySelector('[data-family-history-toggle]');
  if (familyToggle) {
    familyToggle.addEventListener('click', function(e) {
      this.classList.toggle('active');
      calculateProgress();
      e.preventDefault();
    });
  }
  
  // Track Medication Yes/No buttons
  const medicationButtons = form.querySelectorAll('[data-medication-btn]');
  medicationButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      medicationButtons.forEach(b => b.classList.remove('active', 'border-primary', 'bg-surface-container-lowest', 'text-primary'));
      medicationButtons.forEach(b => b.classList.add('bg-surface-container-highest', 'text-on-surface-variant'));
      this.classList.remove('bg-surface-container-highest', 'text-on-surface-variant');
      this.classList.add('active', 'border-primary', 'bg-surface-container-lowest', 'text-primary');
      calculateProgress();
      e.preventDefault();
    });
  });


  // Track Dizziness Yes/No buttons
  const dizzinessButtons = form.querySelectorAll('[data-dizziness-btn]');
  dizzinessButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      dizzinessButtons.forEach(b => b.classList.remove('active', 'border-primary', 'bg-surface-container-lowest', 'text-primary'));
      dizzinessButtons.forEach(b => b.classList.add('bg-surface-container-highest', 'text-on-surface-variant'));
      this.classList.remove('bg-surface-container-highest', 'text-on-surface-variant');
      this.classList.add('active', 'border-primary', 'bg-surface-container-lowest', 'text-primary');
      calculateProgress();
      e.preventDefault();
    });
  });

  const comparisonToggle = document.getElementById('comparisonToggle');
  if (comparisonToggle) {
    comparisonToggle.addEventListener('click', function(e) {
      const knob = this.querySelector('div');
      const isActive = this.classList.toggle('active');
      this.setAttribute('aria-pressed', String(isActive));
      this.classList.toggle('bg-primary', isActive);
      this.classList.toggle('bg-surface-container-highest', !isActive);
      if (knob) {
        knob.classList.toggle('translate-x-6', isActive);
      }
      e.preventDefault();
    });
  }
  
  // Track Smoking Yes/No buttons
  const smokingButtons = form.querySelectorAll('[data-smoking-btn]');
  smokingButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      smokingButtons.forEach(b => b.classList.remove('active', 'border-primary', 'bg-surface-container-lowest', 'text-primary'));
      smokingButtons.forEach(b => b.classList.add('bg-surface-container-highest', 'text-on-surface-variant'));
      this.classList.remove('bg-surface-container-highest', 'text-on-surface-variant');
      this.classList.add('active', 'border-primary', 'bg-surface-container-lowest', 'text-primary');
      calculateProgress();
      e.preventDefault();
    });
  });
  
  // Track Alcohol input
  const alcoholInput = document.getElementById('alcoholInput');
  if (alcoholInput) {
    alcoholInput.addEventListener('input', calculateProgress);
    alcoholInput.addEventListener('change', calculateProgress);
  }
  
  // Initial calculation
  calculateProgress();
  loadAvailableModels();

  form.addEventListener('submit', submitPrediction);
});

function getResultCopy(level) {
  const normalizedLevel = String(level || '').toLowerCase();

  if (normalizedLevel === 'low') {
    return {
      badge: 'Low Anxiety Indicators',
      title: 'Your Anxiety Spectrum is Low',
      description: 'Your current markers suggest relatively low anxiety intensity. Keep monitoring sleep, caffeine, stress, and lifestyle balance to maintain this baseline.'
    };
  }

  if (normalizedLevel === 'high') {
    return {
      badge: 'High Anxiety Indicators',
      title: 'Your Anxiety Spectrum is High',
      description: 'Your current markers suggest elevated anxiety intensity. Consider using grounding strategies and seeking support from a qualified mental-health professional if symptoms feel difficult to manage.'
    };
  }

  return {
    badge: 'Moderate Anxiety Indicators',
    title: 'Your Anxiety Spectrum is Moderate',
    description: 'Your current markers suggest a moderate anxiety range. Lifestyle factors, stress level, and physiological responses may be contributing to intermittent spikes.'
  };
}

function updateGauge(score) {
  const scoreGauge = document.getElementById('scoreGauge');
  const scorePercent = document.getElementById('scorePercent');
  const normalizedScore = Math.max(1, Math.min(10, Number(score) || 1));
  const percentage = Math.round((normalizedScore / 10) * 100);
  const circumference = 276;
  const dashOffset = circumference - (circumference * percentage) / 100;

  if (scoreGauge) {
    scoreGauge.style.strokeDashoffset = String(dashOffset);
  }

  if (scorePercent) {
    scorePercent.textContent = `${percentage}%`;
  }
}

function renderComparison(comparisons, primaryModelFile) {
  const comparisonSection = document.getElementById('comparisonSection');
  const comparisonGrid = document.getElementById('comparisonGrid');

  if (!comparisonSection || !comparisonGrid || !Array.isArray(comparisons) || comparisons.length <= 1) {
    return;
  }

  comparisonSection.classList.remove('hidden');
  comparisonGrid.innerHTML = comparisons
    .map((item) => {
      const isPrimary = item.model_file === primaryModelFile;
      const score = Number(item.predicted_score || 0).toFixed(2);
      const level = item.rounded_level || '--';
      const label = item.anxiety_level || 'Unknown';
      const modelName = item.model_used || item.model_file || 'Model';

      return `
        <div class="bg-surface-container-low rounded-xl p-6 border ${isPrimary ? 'border-primary' : 'border-outline-variant/10'}">
          <div class="flex items-start justify-between gap-4 mb-4">
            <h4 class="font-headline text-lg font-bold text-on-surface">${modelName}</h4>
            ${isPrimary ? '<span class="text-xs font-bold text-primary">SELECTED</span>' : ''}
          </div>
          <div class="text-3xl font-headline font-extrabold text-primary mb-1">${score}</div>
          <p class="text-sm text-on-surface-variant">Level ${level}/10 - ${label}</p>
          <p class="text-xs text-on-surface-variant mt-3">${item.feature_engineering || 'Original'} features</p>
        </div>
      `;
    })
    .join('');
}


// ─────────────────────────────────────────────
// PDF Export – exact pattern from user source
// ─────────────────────────────────────────────

/**
 * Xuất dữ liệu và kết quả dự đoán ra file PDF A4 chuẩn
 * @param {Object} inputData - { "Tên Trường": "Giá trị" }
 * @param {String} predictionResult - Chuỗi kết quả dự đoán
 */
function exportSocialAnxietyPDF(inputData, predictionResult) {
  const BASE_COLUMNS = [
    "Age", "Gender", "Occupation", "Sleep Hours", "Physical Activity (hrs/week)",
    "Caffeine Intake (mg/day)", "Alcohol Consumption (drinks/week)", "Smoking",
    "Family History of Anxiety", "Stress Level (1-10)", "Heart Rate (bpm)",
    "Breathing Rate (breaths/min)", "Sweating Level (1-5)", "Dizziness",
    "Medication", "Therapy Sessions (per month)", "Recent Major Life Event",
    "Diet Quality (1-10)"
  ];

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const pageW = 210;
  const pageH = 297;
  const marginL = 15;
  const marginR = 15;
  const contentW = pageW - marginL - marginR;
  let y = 20;

  function checkNewPage(neededH) {
    if (y + neededH > pageH - 15) {
      doc.addPage();
      y = 20;
    }
  }

  // HEADER
  doc.setFillColor(35, 103, 119);
  doc.rect(0, 0, pageW, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Social Anxiety Predict', pageW / 2, 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Bao cao phan tich va ket qua du doan', pageW / 2, 25, { align: 'center' });

  doc.setFontSize(8);
  doc.text('Ngay: ' + new Date().toLocaleString('vi-VN'), pageW / 2, 33, { align: 'center' });

  y = 48;

  // KET QUA DU DOAN
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.5);
  doc.roundedRect(marginL, y, contentW, 22, 3, 3, 'FD');

  doc.setFillColor(22, 163, 74);
  doc.rect(marginL, y, 3, 22, 'F');

  doc.setTextColor(22, 163, 74);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('KET QUA TU MO HINH DU DOAN:', marginL + 6, y + 7);

  doc.setTextColor(20, 83, 45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(String(predictionResult), marginL + 6, y + 17);

  y += 30;

  // TIEU DE BANG
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('CHI TIET CAC THONG SO DAU VAO', marginL, y);

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(marginL, y + 2, marginL + contentW, y + 2);

  y += 8;

  const colW = [62, 33, 62, 23];
  const rowH = 9;

  doc.setFillColor(226, 232, 240);
  doc.rect(marginL, y, contentW, rowH, 'F');

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  let xPos = marginL + 2;
  ['Truong du lieu', 'Gia tri', 'Truong du lieu', 'Gia tri'].forEach(function(h, i) {
    doc.text(h, xPos + 1, y + 6);
    xPos += colW[i];
  });

  y += rowH;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  for (let i = 0; i < BASE_COLUMNS.length; i += 2) {
    checkNewPage(rowH + 2);

    const field1 = BASE_COLUMNS[i];
    const val1   = String(inputData[field1] != null ? inputData[field1] : 'N/A');
    const field2 = BASE_COLUMNS[i + 1] || '';
    const val2   = field2 ? String(inputData[field2] != null ? inputData[field2] : 'N/A') : '';

    const isEven = (i / 2) % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(marginL, y, contentW, rowH, 'F');

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginL, y + rowH, marginL + contentW, y + rowH);

    xPos = marginL + 2;
    const cells = [
      { text: field1, bold: true,  color: [71, 85, 105]  },
      { text: val1,   bold: false, color: [30, 41, 59]   },
      { text: field2, bold: true,  color: [71, 85, 105]  },
      { text: val2,   bold: false, color: [30, 41, 59]   }
    ];

    cells.forEach(function(cell, ci) {
      doc.setFont('helvetica', cell.bold ? 'bold' : 'normal');
      doc.setTextColor(cell.color[0], cell.color[1], cell.color[2]);
      const maxW = colW[ci] - 3;
      let txt = cell.text;
      while (txt.length > 0 && doc.getTextWidth(txt) > maxW) {
        txt = txt.slice(0, -1);
      }
      if (txt !== cell.text) txt += '..';
      doc.text(txt, xPos + 1, y + 6);
      xPos += colW[ci];
    });

    y += rowH;
  }

  // FOOTER
  checkNewPage(20);
  y += 10;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.setLineDash([2, 2]);
  doc.line(marginL, y, marginL + contentW, y);
  doc.setLineDash([]);

  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Bao cao duoc tao tu dong boi SerenePath. Khong thay the cho chan doan y te chuyen nghiep.', pageW / 2, y, { align: 'center' });

  doc.save('Social_Anxiety_Predict_Report.pdf');
}


// ─────────────────────────────────────────────
// Hiển thị kết quả trên giao diện sau khi predict
// ─────────────────────────────────────────────
function displayResult(prediction) {
  if (!prediction) return;

  const score        = prediction.predicted_score;
  const roundedLevel = prediction.rounded_level;
  const anxietyLevel = prediction.anxiety_level;
  const copy         = getResultCopy(anxietyLevel);

  const resultBadge       = document.getElementById('resultBadge');
  const resultTitle       = document.getElementById('resultTitle');
  const resultDescription = document.getElementById('resultDescription');
  const resultAnxietyEl  = document.getElementById('resultAnxietyLevel');

  if (resultBadge) {
    resultBadge.innerHTML = `<span class="material-symbols-outlined text-sm">spa</span> ${copy.badge} – Level ${roundedLevel}/10`;
  }
  if (resultTitle) {
    resultTitle.textContent = copy.title;
  }
  if (resultDescription) {
    resultDescription.textContent = `${copy.description} Model used: ${prediction.model_used || 'Final model'}.`;
  }

  // Lưu kết quả thô vào hidden span để PDF đọc
  if (resultAnxietyEl) {
    resultAnxietyEl.innerText = `${anxietyLevel} (Level ${roundedLevel}/10, Score: ${Number(score || 0).toFixed(2)})`;
  }

  renderComparison(prediction.comparisons, prediction.model_file);

  // ── Gắn nút Download PDF ──
  const downloadBtn = document.getElementById('downloadPdfBtn');
  if (downloadBtn) {
    const newBtn = downloadBtn.cloneNode(true); // xoá listener cũ
    downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);

    newBtn.addEventListener('click', function (e) {
      e.preventDefault();

      const predictionText = document.getElementById('resultAnxietyLevel')?.innerText?.trim();
      if (!predictionText) {
        alert('Vui lòng thực hiện dự đoán trước khi xuất PDF!');
        return;
      }

      // Xây object inputData khớp với BASE_COLUMNS
      const inp = prediction.input || {};
      const userInputs = {
        "Age":                                String(inp.age ?? 'N/A'),
        "Gender":                             String(inp.gender ?? 'N/A'),
        "Occupation":                         String(inp.occupation ?? 'N/A'),
        "Sleep Hours":                        String(inp.sleepHours ?? 'N/A'),
        "Physical Activity (hrs/week)":       String(inp.physicalActivity ?? 'N/A'),
        "Caffeine Intake (mg/day)":           String(inp.caffeineIntake ?? 'N/A'),
        "Alcohol Consumption (drinks/week)":  String(inp.alcoholConsumption ?? 'N/A'),
        "Smoking":                            inp.smoking ? 'Yes' : 'No',
        "Family History of Anxiety":          inp.familyHistoryOfAnxiety ? 'Yes' : 'No',
        "Stress Level (1-10)":               String(inp.stressLevel ?? 'N/A'),
        "Heart Rate (bpm)":                  String(inp.heartRate ?? 'N/A'),
        "Breathing Rate (breaths/min)":      String(inp.breathingRate ?? 'N/A'),
        "Sweating Level (1-5)":             String(inp.sweatingLevel ?? 'N/A'),
        "Dizziness":                         inp.dizziness ? 'Yes' : 'No',
        "Medication":                        inp.medication ? 'Yes' : 'No',
        "Therapy Sessions (per month)":      String(inp.therapySessions ?? 'N/A'),
        "Recent Major Life Event":           inp.recentMajorLifeEvent ? 'Yes' : 'No',
        "Diet Quality (1-10)":              String(inp.dietQuality ?? 'N/A')
      };

      const originalText = newBtn.innerHTML;
      newBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span> Generating...';
      newBtn.disabled = true;

      setTimeout(() => {
        exportSocialAnxietyPDF(userInputs, predictionText);
        newBtn.innerHTML = originalText;
        newBtn.disabled = false;
      }, 100);
    });
  }
}
