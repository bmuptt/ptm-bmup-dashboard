import { getMembershipDues } from '@/service/Finance/membershipDues';
import type { IMembershipDuesItem } from '@/model/finance-interface';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export async function fetchAllMembershipDues(
  periodYear: number,
  search: string = '',
  onProgress?: (loaded: number, total: number) => void
): Promise<IMembershipDuesItem[]> {
  let allItems: IMembershipDuesItem[] = [];
  let page = 1;
  const limit = 20000; // Fetch in chunks
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await getMembershipDues({
        period_year: periodYear,
        search,
        page,
        limit,
      });

      const { items, pagination } = response.data;
      allItems = [...allItems, ...items];

      if (pagination) {
        if (onProgress) {
          onProgress(allItems.length, pagination.totalItems);
        }
        
        if (page < pagination.totalPages) {
          page++;
        } else {
          hasMore = false;
        }
      } else {
        // Fallback if pagination is missing (shouldn't happen based on interface)
        hasMore = false;
      }
    }
  } catch (error) {
    console.error('Error fetching all membership dues:', error);
    throw error;
  }

  return allItems;
}

function prepareDataForExport(items: IMembershipDuesItem[]) {
  return items.map(item => {
    const row: Record<string, string | number> = {
      'Member ID': item.member.id,
      'Member Name': item.member.name,
    };

    MONTH_NAMES.forEach((month, index) => {
      const monthData = item.months.find(m => m.month === index + 1);
      row[month] = monthData?.status === 'paid' ? 'Paid' : 'Unpaid';
    });

    return row;
  });
}

export function exportToExcel(items: IMembershipDuesItem[], periodYear: number) {
  const data = prepareDataForExport(items);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Membership Dues');
  
  // Adjust column widths
  const colWidths = [{ wch: 10 }, { wch: 30 }]; // Member ID, Member Name
  for (let i = 0; i < 12; i++) {
    colWidths.push({ wch: 10 }); // Months
  }
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, `Membership_Dues_${periodYear}.xlsx`);
}

export function exportToPDF(items: IMembershipDuesItem[], periodYear: number) {
  const doc = new jsPDF({ orientation: 'landscape' });
  
  // Title
  doc.setFontSize(18);
  doc.text(`Membership Dues - ${periodYear}`, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  const tableHead = [['Member Name', ...MONTH_NAMES]];
  const tableBody = items.map(item => {
    const row = [item.member.name];
    MONTH_NAMES.forEach((_, index) => {
      const monthData = item.months.find(m => m.month === index + 1);
      row.push(monthData?.status === 'paid' ? 'Paid' : 'Unpaid');
    });
    return row;
  });

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 35,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] },
    didParseCell: function(data) {
      // Color code status
      if (data.section === 'body' && data.column.index > 0) {
        const text = data.cell.raw as string;
        if (text === 'Paid') {
          data.cell.styles.textColor = [0, 128, 0]; // Green
        } else {
          data.cell.styles.textColor = [200, 0, 0]; // Red
        }
      }
    }
  });

  doc.save(`Membership_Dues_${periodYear}.pdf`);
}
