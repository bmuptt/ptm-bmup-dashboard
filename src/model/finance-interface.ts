export interface ICashBalanceData {
  balance: number;
}

export interface ICashBalanceResponse {
  success: boolean;
  message: string;
  data: ICashBalanceData;
}

export type CashBalanceTransactionType = 'debit' | 'credit';

export interface ICashBalanceFormState {
  value: number | null;
  description: string;
  type: CashBalanceTransactionType;
}

export interface IUpdateCashBalanceRequest {
  status: boolean;
  value: number;
  description: string;
}

// History list & pagination
export interface ICashBalanceHistoryUserRole {
  id: number;
  name: string;
}

export interface ICashBalanceHistoryUser {
  id: number;
  email: string;
  name: string;
  username: string;
  role: ICashBalanceHistoryUserRole;
  active: string;
  registered_at: string; // ISO string
  contact: string | null;
}

export interface ICashBalanceHistoryItem {
  id: number;
  status: boolean;
  value: number;
  description: string;
  created_by: number;
  created_at: string; // ISO string
  created_by_user: ICashBalanceHistoryUser;
}

export interface ICashBalanceHistoryData {
  items: ICashBalanceHistoryItem[];
  next_cursor: number | null;
  has_more: boolean;
}

export interface ICashBalanceHistoryResponse {
  success: boolean;
  message: string;
  data: ICashBalanceHistoryData;
}

export interface IGetCashBalanceHistoryParams {
  limit?: number; // default 10
  cursor?: number | string;
}

// Membership Dues

export interface IGetMembershipDuesParams {
  page?: number;
  limit?: number;
  cursor?: number;
  period_year?: number;
  search?: string;
}

export interface IUpdateMembershipDuesRequest {
  member_id: number;
  period_year: number;
  period_month: number;
  status: 'paid' | 'unpaid';
  proof_file_path?: string;
}

// Upload Membership Dues Proof
export interface IUploadMembershipDuesProofRequest {
  status_file: 0 | 1;
  proof_file?: File;
}

export interface IUploadMembershipDuesProofResponse {
  message: string;
  path?: string | null;
}

export interface IMembershipDuesMember {
  id: number;
  name: string;
  photo: string | null;
}

export interface IMembershipDuesMonth {
  month: number;
  status: 'paid' | 'unpaid';
  amount: number;
  id: number | null;
}

export interface IMembershipDuesItem {
  member: IMembershipDuesMember;
  months: IMembershipDuesMonth[];
}

// Data passed to Upload Proof Dialog
export interface IUploadProofDialogData {
  membership_dues_id: number;
  member_name: string;
  month: number;
  period_year: number;
  current_status: 'paid' | 'unpaid';
}

export interface IMembershipDuesMeta {
  nextCursor: number | null;
  hasMore: boolean;
  limit: number;
}

export interface IMembershipDuesPagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface IMembershipDuesResponse {
  items: IMembershipDuesItem[];
  meta: IMembershipDuesMeta;
  pagination?: IMembershipDuesPagination;
}




// Detail Membership Dues
export interface IMembershipDuesDetailMembershipDues {
  id: number;
  member_id: number;
  amount: number;
  status: 'paid' | 'unpaid';
  due_date: string; // ISO string
  created_at: string; // ISO string
  updated_at: string; // ISO string
  proof_file_path?: string | null;
}

export interface IMembershipDuesDetailMember {
  id: number;
  name: string;
  username: string;
  gender: string;
  birthdate: string; // ISO string
  address: string;
  phone: string;
  photo: string | null;
  active: boolean;
}

export interface IMembershipDuesDetailData {
  membership_dues: IMembershipDuesDetailMembershipDues;
  member: IMembershipDuesDetailMember;
}

export interface IMembershipDuesDetailResponse {
  success: boolean;
  message?: string;
  data: IMembershipDuesDetailData;
}

// Import Membership Dues
export interface IImportMembershipDuesSummary {
  total_rows: number;
  processed_rows: number;
  success_rows: number;
  failed_rows: number;
}

export interface IImportMembershipDuesChange {
  member_id: number;
  period_year: number;
  period_month: number;
  action: 'create' | 'delete' | 'skip';
  amount: number;
  reason?: string;
}

export interface IImportMembershipDuesItemSummary {
  member_id: number;
  member_name: string;
  processed: number;
  success: number;
  failed: number;
  errors: string[];
  changes: IImportMembershipDuesChange[];
}

export interface IImportMembershipDuesData {
  summary: IImportMembershipDuesSummary;
  items: IImportMembershipDuesItemSummary[];
}

export interface IImportMembershipDuesResponse {
  success: boolean;
  data: IImportMembershipDuesData;
}
