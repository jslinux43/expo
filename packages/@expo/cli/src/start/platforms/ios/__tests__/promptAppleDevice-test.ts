import { getBestSimulatorAsync } from '../getBestSimulator';
import { sortDefaultDeviceToBeginningAsync } from '../promptAppleDevice';

jest.mock('../getBestSimulator');

const asMock = <T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> =>
  fn as jest.MockedFunction<T>;

describe(sortDefaultDeviceToBeginningAsync, () => {
  it(`sorts default to the beginning`, async () => {
    asMock(getBestSimulatorAsync).mockResolvedValueOnce('should-be-first');

    const devices = await sortDefaultDeviceToBeginningAsync([
      { udid: 'abc' },
      { udid: 'def' },
      { udid: 'should-be-first' },
      { udid: 'ghi' },
    ] as any);
    expect(devices[0].udid).toBe('should-be-first');
  });

  it(`does not change order when there is no default`, async () => {
    asMock(getBestSimulatorAsync).mockResolvedValueOnce(null);
    const devices = await sortDefaultDeviceToBeginningAsync([
      { udid: 'abc' },
      { udid: 'def' },
    ] as any);
    expect(devices[0].udid).toBe('abc');
  });
});
