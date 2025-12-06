import { describe, test, expect, vi, beforeEach } from 'vitest';
import { uploadMembershipDuesProof, getMembershipDuesProof, getMembershipDuesDetail } from '@/service/Finance/membershipDues';
import { apiFinance } from '@/service/apiFinance';

vi.mock('@/service/apiFinance', () => ({
  apiFinance: vi.fn(),
}));

describe('Finance Service: Membership Dues Proof', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('calls endpoint with FormData for replace proof', async () => {
    const file = new File([new Blob(['dummy'])], 'proof.jpg', { type: 'image/jpeg' });
    vi.mocked(apiFinance).mockResolvedValue({} as unknown as Response);

    await uploadMembershipDuesProof(123, { status_file: 1, proof_file: file });

    expect(apiFinance).toHaveBeenCalledWith(expect.objectContaining({
      url: 'finance/dues/123/proof',
      method: 'PUT',
      headers: { 'Content-Type': 'multipart/form-data' },
    }));

    const callArg = vi.mocked(apiFinance).mock.calls[0][0] as unknown as { data: FormData };
    expect(callArg.data).toBeInstanceOf(FormData);
  });

  test('calls endpoint with status_file=0 (no change)', async () => {
    vi.mocked(apiFinance).mockResolvedValue({} as unknown as Response);

    await uploadMembershipDuesProof(1, { status_file: 0 });

    expect(apiFinance).toHaveBeenCalledWith(expect.objectContaining({
      url: 'finance/dues/1/proof',
      method: 'PUT',
    }));
  });

  test('gets proof detail via GET', async () => {
    vi.mocked(apiFinance).mockResolvedValue({} as unknown as Response);
    await getMembershipDuesProof(999);
    expect(apiFinance).toHaveBeenCalledWith(expect.objectContaining({
      url: 'finance/dues/999/proof',
      method: 'GET',
    }));
  });

  test('gets dues detail via GET', async () => {
    vi.mocked(apiFinance).mockResolvedValue({} as unknown as Response);
    await getMembershipDuesDetail(100);
    expect(apiFinance).toHaveBeenCalledWith(expect.objectContaining({
      url: 'finance/dues/100',
      method: 'GET',
    }));
  });
});
