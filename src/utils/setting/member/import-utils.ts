import * as XLSX from 'xlsx';

const REQUIRED_HEADERS = ['name', 'username', 'gender', 'birthdate', 'address', 'phone'];
const OPTIONAL_HEADERS = ['active'];

export function generateMemberTemplate() {
  const headers = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS];
  const worksheet = XLSX.utils.aoa_to_sheet([headers]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');
  worksheet['!cols'] = headers.map(() => ({ wch: 20 }));
  XLSX.writeFile(workbook, 'Member_Import_Template.xlsx');
}

export function validateHeaders(sheet: XLSX.WorkSheet) {
  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
  const headerRow = Array.isArray(rows[0]) ? rows[0] : [];
  const missing = REQUIRED_HEADERS.filter(h => !headerRow.includes(h));
  const unknown = headerRow.filter(h => ![...REQUIRED_HEADERS, ...OPTIONAL_HEADERS].includes(h));
  const valid = missing.length === 0;
  return { valid, missing, unknown, headerRow };
}

export function validateRows(sheet: XLSX.WorkSheet) {
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
  const errors: string[] = [];
  const usernames = new Set<string>();
  const duplicates: string[] = [];
  rows.forEach((row, idx) => {
    REQUIRED_HEADERS.forEach((key) => {
      const val = row[key];
      if (val === '' || val === null || typeof val === 'undefined') {
        errors.push(`Row ${idx + 2}: ${key} is required`);
      }
    });
    const uname = String(row['username'] ?? '');
    if (uname) {
      if (usernames.has(uname)) duplicates.push(uname);
      usernames.add(uname);
    }
  });
  return { errors, duplicates, total: rows.length };
}
