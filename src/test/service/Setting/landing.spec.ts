import { describe, it, expect, vi, beforeEach } from 'vitest';
import { upsertLandingItems } from '@/service/Setting/landing';
import { apiMaster } from '@/service/apiSetting';
import type { IUpsertLandingRequestPayload } from '@/model/landing-interface';

// Mock apiMaster
vi.mock('@/service/apiSetting', () => ({
  apiMaster: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('Landing Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('upsertLandingItems constructs FormData correctly with structured fields', async () => {
    const payload: IUpsertLandingRequestPayload = {
      sections: [
        {
          page_key: 'home',
          items: [
            {
              key: 'hero',
              type: 'text',
              title: 'Hero Title',
              content: 'Hero Content',
              published: true,
            },
            {
              key: 'about_us',
              type: 'image',
              title: null,
              content: null,
              published: true,
              status_image: '1',
            },
          ],
        },
      ],
    };

    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const images = {
      about_us: mockFile,
    };

    (apiMaster.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { success: true } });

    await upsertLandingItems(payload, images);

    expect(apiMaster.post).toHaveBeenCalledTimes(1);
    
    const [url, formData] = (apiMaster.post as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    
    expect(url).toContain('setting/landing/items?_method=PUT');
    expect(formData).toBeInstanceOf(FormData);

    // Helper to get value from FormData
    const get = (key: string) => formData.get(key);

    // Check section data
    expect(get('sections[0][page_key]')).toBe('home');

    // Check first item (Hero)
    expect(get('sections[0][items][0][key]')).toBe('hero');
    expect(get('sections[0][items][0][type]')).toBe('text');
    expect(get('sections[0][items][0][title]')).toBe('Hero Title');
    expect(get('sections[0][items][0][content]')).toBe('Hero Content');
    expect(get('sections[0][items][0][published]')).toBe('true');
    // Ensure no image fields for first item
    expect(get('sections[0][items][0][status_image]')).toBeNull();
    expect(get('sections[0][items][0][image]')).toBeNull();

    // Check second item (About Us)
    expect(get('sections[0][items][1][key]')).toBe('about_us');
    expect(get('sections[0][items][1][type]')).toBe('image');
    expect(get('sections[0][items][1][status_image]')).toBe('1');
    expect(get('sections[0][items][1][image]')).toBe(mockFile);
  });
});
