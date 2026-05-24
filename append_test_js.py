with open('FE/js/test.js', 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace the submitPrediction block entirely, and append the new functions at the end of the file.
import re

submit_func = """async function submitPrediction(event) {
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
}"""

content = re.sub(r'async function submitPrediction\(event\) \{[\s\S]*?(?=\n// Add event listeners to track input changes)', submit_func + '\n', content)

additional_code = """
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

function displayResult(prediction) {
  if (!prediction) return;

  const score = prediction.predicted_score;
  const roundedLevel = prediction.rounded_level;
  const anxietyLevel = prediction.anxiety_level;
  const copy = getResultCopy(anxietyLevel);

  updateGauge(score);

  const resultBadge = document.getElementById('resultBadge');
  const resultTitle = document.getElementById('resultTitle');
  const resultDescription = document.getElementById('resultDescription');

  if (resultBadge) {
    resultBadge.innerHTML = `<span class="material-symbols-outlined text-sm">spa</span> ${copy.badge} - Level ${roundedLevel}/10`;
  }

  if (resultTitle) {
    resultTitle.textContent = copy.title;
  }

  if (resultDescription) {
    resultDescription.textContent = `${copy.description} Model used: ${prediction.model_used || 'Final model'}.`;
  }

  renderComparison(prediction.comparisons, prediction.model_file);
  
  const downloadBtn = document.getElementById('downloadPdfBtn');
  if (downloadBtn) {
    // remove previous listeners to avoid duplicates if submitted multiple times
    const newBtn = downloadBtn.cloneNode(true);
    downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);
    
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const element = document.getElementById('pdfContent');
      const opt = {
        margin:       10,
        filename:     'SerenePath-Result.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      const originalText = newBtn.innerHTML;
      newBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Generating...';
      newBtn.disabled = true;
      
      html2pdf().set(opt).from(element).save().then(() => {
        newBtn.innerHTML = originalText;
        newBtn.disabled = false;
      }).catch(err => {
        console.error("PDF generation failed:", err);
        newBtn.innerHTML = originalText;
        newBtn.disabled = false;
        alert("Failed to generate PDF. Please try again.");
      });
    });
  }
}
"""

content += additional_code

with open('FE/js/test.js', 'w', encoding='utf-8') as f:
    f.write(content)
