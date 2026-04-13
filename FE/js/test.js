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
  
  // 10. Stress Level (active button)
  const activeStress = document.querySelector('[data-stress-level].active');
  if (activeStress) {
    filledCount++;
  }
  
  // 11. Family History toggle
  const familyToggle = document.querySelector('[data-family-history-toggle].active');
  if (familyToggle) {
    filledCount++;
  }
  
  // 12. Active Medication button
  const medicationBtn = document.querySelector('[data-medication-btn].active');
  if (medicationBtn) {
    filledCount++;
  }
  
  // 13. Therapy Sessions input
  const therapySessionsInput = document.getElementById('therapySessionsInput');
  if (therapySessionsInput && therapySessionsInput.value && therapySessionsInput.value.trim() !== '') {
    filledCount++;
  }
  
  // 14. Major Recent Life Event textarea
  const lifeEventInput = document.getElementById('lifeEventInput');
  if (lifeEventInput && lifeEventInput.value && lifeEventInput.value.trim() !== '') {
    filledCount++;
  }
  
  // Calculate percentage (14 main fields)
  const totalFields = 14;
  const progress = Math.round((filledCount / totalFields) * 100);
  
  // Update progress bar
  progressBar.style.width = progress + '%';
  progressText.textContent = progress + '% Complete';
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
});
