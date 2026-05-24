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
  const medicationBtn = document.querySelector('[data-medication-btn].active');
  if (medicationBtn) {
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
  
  // Calculate percentage (17 main fields)
  const totalFields = 17;
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

function caffeineLevelToMg(value) {
  const caffeineMap = {
    None: 0,
    Moderate: 200,
    High: 400
  };

  return caffeineMap[value] ?? null;
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
    caffeineIntake: caffeineLevelToMg(document.getElementById('caffeinInput')?.value),
    alcoholConsumption: getNumberInput('alcoholInput'),
    smoking: getActiveValue('[data-smoking-btn]') === 'yes',
    dietQuality: getNumberInput('dietQualityInput'),
    recentMajorLifeEvent: lifeEventText.length > 0,

    stressLevel: Number(getActiveValue('[data-stress-level]')),
    heartRate: getNumberInput('heartRateInput'),
    breathingRate: getNumberInput('breathingRateInput'),
    sweatingLevel: getNumberInput('sweatingIntensityInput'),
    dizziness: false,

    familyHistoryOfAnxiety: Boolean(document.querySelector('[data-family-history-toggle].active')),
    medication: Boolean(document.querySelector('[data-medication-btn].active')),
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
    ['caffeineIntake', 'Caffeine intake'],
    ['alcoholConsumption', 'Alcohol usage'],
    ['dietQuality', 'Diet quality'],
    ['stressLevel', 'Stress level'],
    ['heartRate', 'Heart rate'],
    ['breathingRate', 'Breathing rate'],
    ['sweatingLevel', 'Sweating intensity'],
    ['therapySessions', 'Therapy sessions']
  ];

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
    localStorage.setItem('serenePathPrediction', JSON.stringify({
      ...selectedPrediction,
      comparisons: predictions
    }));
    window.location.href = 'result.html';
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
  
  // Track Medication button
  const medicationBtn = document.querySelector('[data-medication-btn]');
  if (medicationBtn) {
    medicationBtn.addEventListener('click', function(e) {
      this.classList.toggle('active');
      calculateProgress();
      e.preventDefault();
    });
  }

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
