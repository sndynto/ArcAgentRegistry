export const IDENTITY_REGISTRY_ADDRESS = '0x8004A818BFB912233c491871b3d84c89A494BD9e' as const
export const REPUTATION_REGISTRY_ADDRESS = '0x8004B663056A597Dffe9eCcC1965A193B7388713' as const
export const VALIDATION_REGISTRY_ADDRESS = '0x8004Cb1BF31DAf7788923b405b754f57acEB4272' as const

export const IDENTITY_REGISTRY_ABI = [
  {
    inputs: [{ name: 'metadataURI', type: 'string' }],
    name: 'register',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const

export const REPUTATION_REGISTRY_ABI = [
  {
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'rating', type: 'uint8' },
      { name: 'comment', type: 'string' },
    ],
    name: 'giveFeedback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getAverageReputation',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: true, name: 'reviewer', type: 'address' },
      { name: 'rating', type: 'uint8' },
      { name: 'comment', type: 'string' },
    ],
    name: 'FeedbackGiven',
    type: 'event',
  },
] as const

export const VALIDATION_REGISTRY_ABI = [
  {
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'isValid', type: 'bool' },
      { name: 'reportURI', type: 'string' },
    ],
    name: 'validate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getValidationStatus',
    outputs: [{ name: 'isValid', type: 'bool' }, { name: 'reportURI', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
