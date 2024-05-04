import {
  createMachineEntity,
  extractUniquePublicMacAddresses,
} from './converters';
import { getMockMachine } from '../../../../test/mocks';
import { IpAddress } from '../../../types';

test('#createMachineEntity', () => {
  expect(createMachineEntity(getMockMachine())).toMatchGraphObjectSchema({
    _class: ['HostAgent'],
    schema: {
      properties: {
        _type: { const: 'microsoft_defender_machine' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  });
});

describe('extractUniquePublicMacAddresses Tests', () => {
  test('should ignore private and loopback addresses', () => {
    const testIpAddresses = [
      {
        ipAddress: '192.168.1.1',
        macAddress: '00:1B:44:11:3A:B7',
        type: 'Ethernet',
      },
      {
        ipAddress: '10.0.0.1',
        macAddress: '00:1B:44:11:3A:B8',
        type: 'Ethernet',
      },
      {
        ipAddress: '172.16.0.1',
        macAddress: '00:1B:44:11:3A:B9',
        type: 'Ethernet',
      },
      { ipAddress: '127.0.0.1', macAddress: null, type: 'SoftwareLoopback' },
      { ipAddress: '::1', macAddress: null, type: 'SoftwareLoopback' },
      {
        ipAddress: '169.254.0.1',
        macAddress: '00:1B:44:11:3A:BA',
        type: 'Ethernet',
      }, // APIPA, not technically private but often treated as such
    ] as IpAddress[];
    expect(extractUniquePublicMacAddresses(testIpAddresses)).toEqual([]);
  });

  test('should return unique MAC addresses for public IP addresses', () => {
    const testIpAddresses = [
      {
        ipAddress: '8.8.8.8',
        macAddress: '00:1B:44:11:3A:B7',
        type: 'Ethernet',
      },
      {
        ipAddress: '8.8.4.4',
        macAddress: '00:1B:44:11:3A:B7',
        type: 'Ethernet',
      },
      {
        ipAddress: '192.0.2.1',
        macAddress: '00:1B:44:11:3A:B8',
        type: 'Ethernet',
      }, // Test public address
      {
        ipAddress: '198.51.100.1',
        macAddress: '00:1B:44:11:3A:B9',
        type: 'Ethernet',
      }, // Test public address
    ] as IpAddress[];
    expect(extractUniquePublicMacAddresses(testIpAddresses)).toEqual([
      '00:1B:44:11:3A:B7',
      '00:1B:44:11:3A:B8',
      '00:1B:44:11:3A:B9',
    ]);
  });

  test('should handle null macAddresses gracefully', () => {
    const testIpAddresses = [
      { ipAddress: '8.8.8.8', macAddress: null, type: 'Ethernet' },
      {
        ipAddress: '8.8.4.4',
        macAddress: '00:1B:44:11:3A:B7',
        type: 'Ethernet',
      },
    ] as IpAddress[];
    expect(extractUniquePublicMacAddresses(testIpAddresses)).toEqual([
      '00:1B:44:11:3A:B7',
    ]);
  });

  test('should ignore macAddresses based on filter', () => {
    const testIpAddresses = [
      {
        ipAddress: '8.8.8.8',
        macAddress: '00:00:00:00:00:00',
        type: 'Ethernet',
      },
      {
        ipAddress: '8.8.4.4',
        macAddress: '00:1B:44:11:3A:B7',
        type: 'Ethernet',
      },
    ] as IpAddress[];
    expect(extractUniquePublicMacAddresses(testIpAddresses)).toEqual([
      '00:1B:44:11:3A:B7',
    ]);
  });
});
