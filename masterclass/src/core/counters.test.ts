// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { BIKE_DETAIL, INTERIOR_SEDAN, POLISH_SEDAN, WASH_WAX_SEDAN, makeJob, priceItems } from './__tests__/fixtures';
import { carsLogged, founderSlotsUsed, machinePolishJobsSold } from './counters';

const prices = priceItems();

describe('cars logged toward 25 (BLUEPRINT 3.3, Lando 2026-10-10)', () => {
  it('24 paint-touching cars plus one Interior Only reads 24; one more Wash & Ceramic Wax reads 25', () => {
    const jobs = [
      ...Array.from({ length: 24 }, () => makeJob('delivered', { packageId: WASH_WAX_SEDAN })),
      makeJob('delivered', { packageId: INTERIOR_SEDAN }),
    ];
    expect(carsLogged(jobs, prices, 0)).toBe(24);
    expect(carsLogged([...jobs, makeJob('debriefed', { packageId: WASH_WAX_SEDAN })], prices, 0)).toBe(25);
  });

  it('never counts bikes, Stopped, Canceled, or unfinished jobs; adds the seed', () => {
    const jobs = [
      makeJob('delivered', { packageId: BIKE_DETAIL, vehicleType: 'bike' }),
      makeJob('stopped', { packageId: POLISH_SEDAN }),
      makeJob('canceled', { packageId: POLISH_SEDAN }),
      makeJob('inProgress', { packageId: POLISH_SEDAN }),
      makeJob('qc', { packageId: POLISH_SEDAN }),
      makeJob('draft'),
    ];
    expect(carsLogged(jobs, prices, 0)).toBe(0);
    expect(carsLogged(jobs, prices, 7)).toBe(7);
  });

  it('a package missing from the content counts as not touching paint', () => {
    expect(carsLogged([makeJob('delivered', { packageId: 'price-car-unknown-sedan' })], prices, 0)).toBe(0);
  });
});

describe("founder's slots", () => {
  it('held from Booked; released by Cancel and Stop; four then five', () => {
    const four = [makeJob('booked'), makeJob('checkedIn'), makeJob('inProgress'), makeJob('delivered'), makeJob('canceled'), makeJob('stopped'), makeJob('quoted')];
    expect(founderSlotsUsed(four)).toBe(4);
    expect(machinePolishJobsSold(four, prices)).toBe(4);
    expect(founderSlotsUsed([...four, makeJob('debriefed')])).toBe(5);
  });

  it('a list-price polish job counts as sold but holds no founder slot', () => {
    const sixth = makeJob('booked', { founderRate: false });
    expect(founderSlotsUsed([sixth])).toBe(0);
    expect(machinePolishJobsSold([sixth], prices)).toBe(1);
  });
});
