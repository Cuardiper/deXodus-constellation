import { ethers } from 'ethers';

type Log = ethers.providers.Log;

// =================================================================
// Template requests
// =================================================================
export function buildMadeTemplateRequest(overrides?: Partial<Log>): Log {
  return {
    blockNumber: 12,
    blockHash: '0x9e5060c8773f336e79910fa168626a58209f731155c629e577dad6cc82c0ad79',
    transactionIndex: 0,
    removed: false,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    data: '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000007a69000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512b3df2ca7646e7823c18038ed320ae3fa29bcd7452fdcd91398833da362df1b4600000000000000000000000061648b2ec3e6b3492e90184ef281c2ba28a675ec00000000000000000000000091fa5bf7fe3cf2a8970b031b1eb6f824ffe228be000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f05127c1de7e10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000060317300000000000000000000000000000000000000000000000000000000000066726f6d000000000000000000000000000000000000000000000000000000004554480000000000000000000000000000000000000000000000000000000000',
    topics: [
      '0xeb39930cdcbb560e6422558a2468b93a215af60063622e63cbb165eba14c3203',
      '0x000000000000000000000000a30ca71ba54e83127214d3271aea8f5d6bd4dace',
      '0x894580d6cffd205170373f9b95adfe58b65d63f273bb9945e81fa5f0d7901ffe',
    ],
    transactionHash: '0x40b93a1e81c7162460af066be96266ff692515a2f6b54bd622aa9f82ee00670f',
    logIndex: 0,
    ...overrides,
  };
}

export function buildTemplateFulfilledRequest(overrides?: Partial<Log>): Log {
  return {
    blockNumber: 15,
    blockHash: '0x34411e20e7a1ed9e2a18c74c7db034e298ad84253d0bd968e8285a8af1e34679',
    transactionIndex: 0,
    removed: false,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    data: '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000044fcf02',
    topics: [
      '0xc0977dab79883641ece94bb6a932ca83049f561ffff8d8daaeafdbc1acce9e0a',
      '0x000000000000000000000000a30ca71ba54e83127214d3271aea8f5d6bd4dace',
      '0x894580d6cffd205170373f9b95adfe58b65d63f273bb9945e81fa5f0d7901ffe',
    ],
    transactionHash: '0x6f0a11898efc15d49bdc5c799348f32d36f6b4294e24ff1c51feceeba8953d5f',
    logIndex: 1,
    ...overrides,
  };
}

// =================================================================
// Full requests
// =================================================================
export function buildMadeFullRequest(overrides?: Partial<Log>): Log {
  return {
    blockNumber: 13,
    blockHash: '0x7471cc731b177fe17b8f289d39d08d9aa3bed2f3199730f8e7571b575fe14224',
    transactionIndex: 0,
    removed: false,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    data: '0x00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000007a69000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f051213dea3311fe0d6b84f4daeab831befbc49e19e6494c41e9e065a09c3c68f43b600000000000000000000000061648b2ec3e6b3492e90184ef281c2ba28a675ec00000000000000000000000091fa5bf7fe3cf2a8970b031b1eb6f824ffe228be000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f05127c1de7e10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000160317373737373000000000000000000000000000000000000000000000000000066726f6d000000000000000000000000000000000000000000000000000000004554480000000000000000000000000000000000000000000000000000000000746f00000000000000000000000000000000000000000000000000000000000055534400000000000000000000000000000000000000000000000000000000005f74797065000000000000000000000000000000000000000000000000000000696e7432353600000000000000000000000000000000000000000000000000005f70617468000000000000000000000000000000000000000000000000000000726573756c7400000000000000000000000000000000000000000000000000005f74696d657300000000000000000000000000000000000000000000000000003130303030300000000000000000000000000000000000000000000000000000',
    topics: [
      '0x3a52c462346de2e9436a3868970892956828a11b9c43da1ed43740b12e1125ae',
      '0x000000000000000000000000a30ca71ba54e83127214d3271aea8f5d6bd4dace',
      '0x263c11afed6cff9933cc46487ce6b10cf36a795e4908724c09da9e1c16f43799',
    ],
    transactionHash: '0x420ebda3f246256ced7a58fb72d28d99548eb30de6d2e4d5c767fb547ff795ff',
    logIndex: 0,
    ...overrides,
  };
}

export function buildFullFulfilledRequest(overrides?: Partial<Log>): Log {
  return {
    blockNumber: 17,
    blockHash: '0xa509207d4e349272b12b722faade5b9f2da31bbbb70fd49fd47bb0b70a2aa969',
    transactionIndex: 0,
    removed: false,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    data: '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000044fcf02',
    topics: [
      '0xc0977dab79883641ece94bb6a932ca83049f561ffff8d8daaeafdbc1acce9e0a',
      '0x000000000000000000000000a30ca71ba54e83127214d3271aea8f5d6bd4dace',
      '0x263c11afed6cff9933cc46487ce6b10cf36a795e4908724c09da9e1c16f43799',
    ],
    transactionHash: '0x30d06728bf419cf15348c747d811ca66a912e0dba11f57f801905a3fdf6bccad',
    logIndex: 1,
    ...overrides,
  };
}

// =================================================================
// Withdrawals
// =================================================================
export function buildRequestedWithdrawal(overrides?: Partial<Log>): Log {
  return {
    blockNumber: 14,
    blockHash: '0xa701dc5061a799b387363a2869938f2d22b2840f97444f81f4882086c77adc44',
    transactionIndex: 0,
    removed: false,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    data: '0x0000000000000000000000001c1ceef1a887edeab20219889971e1fd4645b55d',
    topics: [
      '0xd48d52c7c6d0c940f3f8d07591e1800ef3a70daf79929a97ccd80b4494769fc7',
      '0x000000000000000000000000a30ca71ba54e83127214d3271aea8f5d6bd4dace',
      '0x0000000000000000000000002479808b1216e998309a727df8a0a98a1130a162',
      '0xcadc095f1dc6808a34d6166a72e3c3bb039fb401a5d90a270091aa1d25e4e342',
    ],
    transactionHash: '0xcc764cd8c569d23b8b2246c80ec8e2091772140e1aafe9e326dfe37cd73454c4',
    logIndex: 0,
    ...overrides,
  };
}

export function buildFulfilledWithdrawal(overrides?: Partial<Log>): Log {
  return {
    blockNumber: 16,
    blockHash: '0x3a807e3eda2449f3448f8e5eeeac8f61d1fa85d524646789f4ec2954f69868c1',
    transactionIndex: 0,
    removed: false,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    data: '0x0000000000000000000000001c1ceef1a887edeab20219889971e1fd4645b55d0000000000000000000000000000000000000000000000000ddff2f7a13b7b48',
    topics: [
      '0xadb4840bbd5f924665ae7e0e0c83de5c0fb40a98c9b57dba53a6c978127a622e',
      '0x000000000000000000000000a30ca71ba54e83127214d3271aea8f5d6bd4dace',
      '0x0000000000000000000000002479808b1216e998309a727df8a0a98a1130a162',
      '0xcadc095f1dc6808a34d6166a72e3c3bb039fb401a5d90a270091aa1d25e4e342',
    ],
    transactionHash: '0x04fb3bb7d88ff7d1f766eb7643fd0289586a705f46aad214f845e05e1056202c',
    logIndex: 0,
    ...overrides,
  };
}
