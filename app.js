const form = document.getElementById('calculator-form');
const errorMessage = document.getElementById('error-message');
const results = document.getElementById('results');

const volumeResult = document.getElementById('volumeResult');
const concentrationResult = document.getElementById('concentrationResult');
const doseVolumeResult = document.getElementById('doseVolumeResult');
const molarResult = document.getElementById('molarResult');

const formatValue = (value, decimals = 2) => {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
};

const readInputNumber = (fieldName) => {
  const rawValue = form.elements[fieldName].value.trim();

  if (rawValue === '') {
    return null;
  }

  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) ? parsedValue : NaN;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  errorMessage.textContent = '';

  const peptideAmountMg = readInputNumber('peptideAmountMg');
  const targetConcentrationMgMl = readInputNumber('targetConcentrationMgMl');
  const doseMcg = readInputNumber('doseMcg');
  const molecularWeight = readInputNumber('molecularWeight');

  if (!Number.isFinite(peptideAmountMg) || !Number.isFinite(targetConcentrationMgMl)) {
    errorMessage.textContent = 'Enter numeric values for peptide amount and target concentration.';
    results.hidden = true;
    return;
  }

  if (peptideAmountMg <= 0 || targetConcentrationMgMl <= 0) {
    errorMessage.textContent = 'Peptide amount and target concentration must be greater than zero.';
    results.hidden = true;
    return;
  }

  if (doseMcg !== null && (!Number.isFinite(doseMcg) || doseMcg <= 0)) {
    errorMessage.textContent = 'If included, planned dose must be a positive number.';
    results.hidden = true;
    return;
  }

  if (molecularWeight !== null && (!Number.isFinite(molecularWeight) || molecularWeight <= 0)) {
    errorMessage.textContent = 'If included, molecular weight must be a positive number.';
    results.hidden = true;
    return;
  }

  const volumeMl = peptideAmountMg / targetConcentrationMgMl;

  volumeResult.textContent = `${formatValue(volumeMl, 3)} mL`;
  concentrationResult.textContent = `${formatValue(targetConcentrationMgMl, 3)} mg/mL`;

  if (doseMcg !== null) {
    const doseMg = doseMcg / 1000;
    const drawVolumeMl = doseMg / targetConcentrationMgMl;
    const drawVolumeUnits = drawVolumeMl * 100;

    doseVolumeResult.textContent = `${formatValue(drawVolumeMl, 3)} mL (${formatValue(drawVolumeUnits, 1)} IU on U-100 insulin syringe)`;
  } else {
    doseVolumeResult.textContent = '--';
  }

  if (molecularWeight !== null) {
    const concentrationGPerL = targetConcentrationMgMl;
    const molarM = concentrationGPerL / molecularWeight;
    const concentrationMm = molarM * 1000;

    molarResult.textContent = `${formatValue(concentrationMm, 3)} mM`;
  } else {
    molarResult.textContent = '--';
  }

  results.hidden = false;
});
