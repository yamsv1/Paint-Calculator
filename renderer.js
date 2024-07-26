document.getElementById('shape').addEventListener('change', function () {
  const shape = this.value;
  const dimensionsDiv = document.getElementById('dimensions');
  const unit = document.getElementById('unit').value;

  let unitLabel = unit === 'meters' ? 'meters' : 'feet';

  if (shape === 'square' || shape === 'rectangle') {
    dimensionsDiv.innerHTML = `
      <div class="form-group">
        <label for="width">Width (${unitLabel})</label>
        <input type="number" id="width" step="0.01" required>
        <small>Enter width in ${unitLabel} (e.g., 5.5)</small>
      </div>
      <div class="form-group">
        <label for="height">Height (${unitLabel})</label>
        <input type="number" id="height" step="0.01" required>
        <small>Enter height in ${unitLabel} (e.g., 3.2)</small>
      </div>`;
  } else if (shape === 'triangle') {
    dimensionsDiv.innerHTML = `
      <div class="form-group">
        <label for="base">Base (${unitLabel})</label>
        <input type="number" id="base" step="0.01" required>
        <small>Enter base in ${unitLabel} (e.g., 4.0)</small>
      </div>
      <div class="form-group">
        <label for="triangleHeight">Height (${unitLabel})</label>
        <input type="number" id="triangleHeight" step="0.01" required>
        <small>Enter height in ${unitLabel} (e.g., 2.5)</small>
      </div>`;
  } else if (shape === 'circle') {
    dimensionsDiv.innerHTML = `
      <div class="form-group">
        <label for="radius">Radius (${unitLabel})</label>
        <input type="number" id="radius" step="0.01" required>
        <small>Enter radius in ${unitLabel} (e.g., 2.0)</small>
      </div>`;
  } else {
    dimensionsDiv.innerHTML = '';
  }
});

document.getElementById('unit').addEventListener('change', function () {
  const shape = document.getElementById('shape').value;
  if (shape) {
    document.getElementById('shape').dispatchEvent(new Event('change'));
  }
});

document.getElementById('paintForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const shape = document.getElementById('shape').value;
  const unit = document.getElementById('unit').value;
  const color = document.getElementById('color').value;
  const coats = parseInt(document.getElementById('coats').value);
  const brand = document.getElementById('brand').value;
  const rooms = parseInt(document.getElementById('rooms').value);

  let area = 0;
  const conversionFactor = unit === 'feet' ? 0.3048 : 1;

  if (shape === 'square' || shape === 'rectangle') {
    const width = parseFloat(document.getElementById('width').value) * conversionFactor;
    const height = parseFloat(document.getElementById('height').value) * conversionFactor;
    area = width * height;
  } else if (shape === 'triangle') {
    const base = parseFloat(document.getElementById('base').value) * conversionFactor;
    const height = parseFloat(document.getElementById('triangleHeight').value) * conversionFactor;
    area = (base * height) / 2;
  } else if (shape === 'circle') {
    const radius = parseFloat(document.getElementById('radius').value) * conversionFactor;
    area = Math.PI * Math.pow(radius, 2);
  }

  const paintBrands = {
    'sherwin williams': { coverage: 10, cost: 80 },
    'behr': { coverage: 12, cost: 45 },
    'valspar': { coverage: 8, cost: 15.98 }
  };

  const paintColors = {
    'emerald green': 5,
    'sky blue': 0,
    'sunset orange': 3,
    'charcoal gray': 2
  };

  const canSizes = [1, 5, 10];
  const canCosts = {
    1: 20,
    5: 80,
    10: 150
  };

  const { coverage, cost: costPerGallon } = paintBrands[brand];
  const colorCost = paintColors[color];
  const costPerLiter = (costPerGallon / 3.785) + colorCost;
  const paintNeeded = (area * coats * rooms) / coverage;

  // Calculate total cost before discount
  const totalCostBeforeDiscount = paintNeeded * costPerLiter;

  // Calculate cost comparison for different can sizes
  const costComparison = canSizes.map(size => {
    const cansRequired = Math.ceil(paintNeeded / size);
    return { size, cansRequired, cost: cansRequired * canCosts[size] };
  });

  // Determine discount and final cost
  let discount = 0;
  if (paintNeeded >= 50) {
    discount = 0.15;
  } else if (paintNeeded >= 20) {
    discount = 0.1;
  }

  const discountAmount = totalCostBeforeDiscount * discount;
  const finalTotalCost = totalCostBeforeDiscount - discountAmount;

  // Determine most cost-effective can size
  const mostCostEffective = costComparison.reduce((prev, curr) => {
    return prev.cost < curr.cost ? prev : curr;
  });

  const result = `
    <h2>Results</h2>
    <p>Total Area to Paint: ${area.toFixed(2)} square meters</p>
    <p>Total Paint Needed: ${paintNeeded.toFixed(2)} liters</p>
    <p>Total Cost (before discount): $${totalCostBeforeDiscount.toFixed(2)}</p>
    ${discount > 0 ? `
      <p>Discount Applied: ${discount * 100}%</p>
      <p>Discount Amount: $${discountAmount.toFixed(2)}</p>
      <p>Final Total Cost after Discount: $${finalTotalCost.toFixed(2)}</p>
    ` : '<p>No discount applied.</p>'}
    <h3>Cost Comparison by Can Size:</h3>
    <ul>
      ${costComparison.map(item => `<li>${item.size}L Can: $${item.cost.toFixed(2)} (${item.cansRequired} can(s) needed)</li>`).join('')}
    </ul>
    <h3>Recommended Can Size:</h3>
    <p>The most cost-effective can size is ${mostCostEffective.size} liters, costing $${mostCostEffective.cost.toFixed(2)}.</p>
  `;

  document.getElementById('result').innerHTML = result;
});

document.getElementById('resetButton').addEventListener('click', function () {
  document.getElementById('paintForm').reset();
  document.getElementById('dimensions').innerHTML = '';
  document.getElementById('result').innerHTML = '';
});


























