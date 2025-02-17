import { CommandError } from '../../../../utils/errors';
import { getAttachedDevicesAsync } from '../adb';
import { listAvdsAsync } from '../emulator';
import { getDevicesAsync } from '../getDevices';

jest.mock('../adb', () => ({
  getAttachedDevicesAsync: jest.fn(),
}));
jest.mock('../emulator', () => ({
  listAvdsAsync: jest.fn(),
}));

const asMock = <T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> =>
  fn as jest.MockedFunction<T>;

it(`asserts no devices are available`, async () => {
  asMock(getAttachedDevicesAsync).mockResolvedValueOnce([]);
  asMock(listAvdsAsync).mockResolvedValueOnce([]);
  await expect(getDevicesAsync()).rejects.toThrowError(CommandError);
  expect(getAttachedDevicesAsync).toBeCalled();
  expect(listAvdsAsync).toBeCalled();
});
