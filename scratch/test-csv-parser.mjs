import fs from 'fs';
import path from 'path';

const csvPath = 'frontend/public/assets/datasets/temperature/gistemp-global-monthly.csv';
const text = fs.readFileSync(csvPath, 'utf-8');

function parseAnomalyToken(token) {
  if (!token) return null;
  const trimmed = token.trim();
  if (trimmed === '***' || trimmed === '' || trimmed === 'NA') {
    return null;
  }
  const val = parseFloat(trimmed);
  return isNaN(val) ? null : val;
}

const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
console.log('Total lines:', lines.length);
console.log('Line 0:', lines[0]);
console.log('Line 1:', lines[1]);

const dataLines = lines.slice(2);
console.log('Data lines count:', dataLines.length);

const row1880 = dataLines[0].split(',');
console.log('1880 Year:', row1880[0], 'Jan:', parseAnomalyToken(row1880[1]), 'Annual J-D:', parseAnomalyToken(row1880[13]), 'D-N:', parseAnomalyToken(row1880[14]));

const row2024 = dataLines.find(l => l.startsWith('2024')).split(',');
console.log('2024 Year:', row2024[0], 'Jan:', parseAnomalyToken(row2024[1]), 'Annual J-D:', parseAnomalyToken(row2024[13]));

const row2025 = dataLines.find(l => l.startsWith('2025')).split(',');
console.log('2025 Year:', row2025[0], 'Jan:', parseAnomalyToken(row2025[1]), 'Annual J-D:', parseAnomalyToken(row2025[13]));

const row2026 = dataLines.find(l => l.startsWith('2026')).split(',');
console.log('2026 Year:', row2026[0], 'Jan:', parseAnomalyToken(row2026[1]), 'Feb:', parseAnomalyToken(row2026[2]), 'Mar (***):', parseAnomalyToken(row2026[3]), 'Annual J-D (***):', parseAnomalyToken(row2026[13]));
