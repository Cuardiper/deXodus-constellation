export const FuturesABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_liquidityPool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_priceFeed",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdc",
        type: "address",
      },
      {
        internalType: "address",
        name: "_weth",
        type: "address",
      },
      {
        internalType: "address",
        name: "_wbtc",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_liquidationThreshold",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "Futures__FutureAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "Futures__FutureDoesNotExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "feedParamKey",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "feeds",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "timeParamKey",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "extraData",
        type: "bytes",
      },
    ],
    name: "StreamsLookup",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "entryPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liqPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currentPrice",
        type: "uint256",
      },
    ],
    name: "ClosePosition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "futureId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "market",
        type: "string",
      },
    ],
    name: "CreateFuture",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "entryPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liqPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currentPrice",
        type: "uint256",
      },
    ],
    name: "DecreaseCollateral",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "entryPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liqPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currentPrice",
        type: "uint256",
      },
    ],
    name: "DecreasePosition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "entryPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liqPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currentPrice",
        type: "uint256",
      },
    ],
    name: "IncreaseCollateral",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "entryPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liqPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currentPrice",
        type: "uint256",
      },
    ],
    name: "IncreasePosition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "msgSender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "futureId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "txType",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "feedId",
        type: "string",
      },
    ],
    name: "InitiateTrade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "entryPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liqPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currentPrice",
        type: "uint256",
      },
    ],
    name: "LiquidatePosition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "entryPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liqPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currentPrice",
        type: "uint256",
      },
    ],
    name: "OpenPosition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "PriceUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldGovernance",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newGovernance",
        type: "address",
      },
    ],
    name: "UpdatedGovernance",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "FEE_ADDRESS",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "positionId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startedAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "size",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "entryPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liqPrice",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "marketId",
            type: "uint256",
          },
        ],
        internalType: "struct Futures.Position",
        name: "_position",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_currentPrice",
        type: "uint256",
      },
    ],
    name: "IsPositionLiquidable",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PERCENTAGE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "STRING_DATASTREAMS_FEEDLABEL",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "STRING_DATASTREAMS_QUERYLABEL",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "USDC",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "borrowingFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "positionId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startedAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "size",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "entryPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liqPrice",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "marketId",
            type: "uint256",
          },
        ],
        internalType: "struct Futures.Position",
        name: "_position",
        type: "tuple",
      },
    ],
    name: "calcLiquidationPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "liqPrice",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "values",
        type: "bytes[]",
      },
      {
        internalType: "bytes",
        name: "extraData",
        type: "bytes",
      },
    ],
    name: "checkCallback",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "index",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "txHash",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "blockNumber",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "blockHash",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "source",
            type: "address",
          },
          {
            internalType: "bytes32[]",
            name: "topics",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Log",
        name: "log",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "checkLog",
    outputs: [
      {
        internalType: "bool",
        name: "upkeepNeeded",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "performData",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "counter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_market",
        type: "string",
      },
    ],
    name: "createFuture",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_futureId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_percentageDecrease",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_long",
        type: "bool",
      },
      {
        internalType: "string",
        name: "feedId",
        type: "string",
      },
    ],
    name: "decreaseCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_futureId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_percentageDecrease",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_long",
        type: "bool",
      },
      {
        internalType: "string",
        name: "feedId",
        type: "string",
      },
    ],
    name: "decreasePosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "executionFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "feedIds",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fundingFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "futureId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "futureMarket",
    outputs: [
      {
        internalType: "string",
        name: "market",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_futureId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_long",
        type: "bool",
      },
    ],
    name: "getTraderPosition",
    outputs: [
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "entryPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "liqPrice",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "governance",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_futureId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_collateral",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_long",
        type: "bool",
      },
      {
        internalType: "string",
        name: "feedId",
        type: "string",
      },
    ],
    name: "increaseCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_futureId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_size",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_collateral",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_long",
        type: "bool",
      },
      {
        internalType: "string",
        name: "feedId",
        type: "string",
      },
    ],
    name: "increasePosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_futureId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_long",
        type: "bool",
      },
    ],
    name: "liquidatePosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidationThreshold",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidityPool",
    outputs: [
      {
        internalType: "contract ILiquidityPool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "longPositions",
    outputs: [
      {
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "entryPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "liqPrice",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "makerTradingFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "performData",
        type: "bytes",
      },
    ],
    name: "performUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "positionIdCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_long",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_futureId",
        type: "uint256",
      },
    ],
    name: "positionNetValue",
    outputs: [
      {
        internalType: "uint256",
        name: "positionNetValue",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "priceFeed",
    outputs: [
      {
        internalType: "contract IPriceFeed",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "priceImpactFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newGovernance",
        type: "address",
      },
    ],
    name: "setGovernance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_makerFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_takerFee",
        type: "uint256",
      },
    ],
    name: "setTradingFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_borrowingFee",
        type: "uint256",
      },
    ],
    name: "setborrowingFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_executionFee",
        type: "uint256",
      },
    ],
    name: "setexecutionFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_fundingFee",
        type: "uint256",
      },
    ],
    name: "setfundingFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_priceImpactFee",
        type: "uint256",
      },
    ],
    name: "setpriceImpactFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "shortPositions",
    outputs: [
      {
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "entryPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "liqPrice",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "takerTradingFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_futureId",
        type: "uint256",
      },
    ],
    name: "validFuture",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "verifier",
    outputs: [
      {
        internalType: "contract IVerifierProxy",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wbtc",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "weth",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
