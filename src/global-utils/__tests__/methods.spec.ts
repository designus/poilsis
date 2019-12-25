import { formatValue } from '../methods';

describe('global-utils/methods', () => {
  it('formatValue()', () => {
    expect(formatValue('kambarių ...,, nuoma Palangoje')).toBe('kambariu-nuoma-palangoje');
    expect(formatValue('% svečių | namai   ----. nidoje 1')).toBe('sveciu-namai-nidoje-1');
  });
});
