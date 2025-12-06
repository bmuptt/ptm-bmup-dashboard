import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fetchAllMembershipDues, exportToExcel, exportToPDF } from '@/utils/finance/export-dues';
import { getMembershipDues } from '@/service/Finance/membershipDues';
import type { IMembershipDuesItem, IMembershipDuesResponse } from '@/model/finance-interface';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

// Mocks
vi.mock('@/service/Finance/membershipDues');
vi.mock('xlsx', () => ({
  utils: {
    json_to_sheet: vi.fn().mockReturnValue({}),
    book_new: vi.fn().mockReturnValue({}),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}));

// Mock jsPDF
const mockSave = vi.fn();
const mockText = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetTextColor = vi.fn();

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    save: mockSave,
    text: mockText,
    setFontSize: mockSetFontSize,
    setTextColor: mockSetTextColor,
  })),
}));

vi.mock('jspdf-autotable', () => ({
  default: vi.fn(),
}));

describe('Export Dues Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAllMembershipDues', () => {
    test('fetches all pages of data', async () => {
      const mockItemsPage1 = [{ member: { id: 1, name: 'Member 1', photo: null }, months: [] }];
      const mockItemsPage2 = [{ member: { id: 2, name: 'Member 2', photo: null }, months: [] }];

      const createMockResponse = (items: IMembershipDuesItem[], currentPage: number, hasMore: boolean): AxiosResponse<IMembershipDuesResponse> => ({
        data: {
          items: items,
          pagination: { currentPage, totalPages: 2, totalItems: 2, itemsPerPage: 1 },
          meta: { nextCursor: null, hasMore, limit: 10 },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      });

      vi.mocked(getMembershipDues)
        .mockResolvedValueOnce(createMockResponse(mockItemsPage1 as IMembershipDuesItem[], 1, true))
        .mockResolvedValueOnce(createMockResponse(mockItemsPage2 as IMembershipDuesItem[], 2, false));

      const result = await fetchAllMembershipDues(2024);

      expect(getMembershipDues).toHaveBeenCalledTimes(2);
      expect(getMembershipDues).toHaveBeenNthCalledWith(1, {
        period_year: 2024,
        search: '',
        page: 1,
        limit: 20000,
      });
      expect(result).toHaveLength(2);
      expect(result).toEqual([...mockItemsPage1, ...mockItemsPage2]);
    });
  });

  describe('exportToExcel', () => {
    test('generates excel file with correct data', () => {
      const mockItems: IMembershipDuesItem[] = [
        {
          member: { id: 1, name: 'John Doe', photo: null },
          months: [
            { month: 1, status: 'paid', amount: 0, id: 1 },
            { month: 2, status: 'unpaid', amount: 0, id: 2 },
          ],
        },
      ];

      exportToExcel(mockItems, 2024);

      expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            'Member ID': 1,
            'Member Name': 'John Doe',
            'Jan': 'Paid',
            'Feb': 'Unpaid'
          })
        ])
      );
      expect(XLSX.utils.book_new).toHaveBeenCalled();
      expect(XLSX.utils.book_append_sheet).toHaveBeenCalled();
      expect(XLSX.writeFile).toHaveBeenCalledWith(expect.anything(), 'Membership_Dues_2024.xlsx');
    });
  });

  describe('exportToPDF', () => {
    test('generates pdf file with correct data', async () => {
      const mockItems: IMembershipDuesItem[] = [
        {
          member: { id: 1, name: 'John Doe', photo: null },
          months: [
            { month: 1, status: 'paid', amount: 0, id: 1 },
            { month: 2, status: 'unpaid', amount: 0, id: 2 },
          ],
        },
      ];

      exportToPDF(mockItems, 2024);

      expect(jsPDF).toHaveBeenCalledWith({ orientation: 'landscape' });
      expect(mockText).toHaveBeenCalledWith('Membership Dues - 2024', 14, 22);
      
      // Verify autoTable call
      const autoTable = await import('jspdf-autotable');
      expect(autoTable.default).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          head: [['Member Name', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']],
          body: [
            ['John Doe', 'Paid', 'Unpaid', 'Unpaid', 'Unpaid', 'Unpaid', 'Unpaid', 'Unpaid', 'Unpaid', 'Unpaid', 'Unpaid', 'Unpaid', 'Unpaid']
          ]
        })
      );

      expect(mockSave).toHaveBeenCalledWith('Membership_Dues_2024.pdf');
    });
  });
});