import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ClosePosition,
  CreateFuture,
  DecreaseCollateral,
  DecreasePosition,
  IncreaseCollateral,
  IncreasePosition,
  InitiateTrade,
  LiquidatePosition,
  OpenPosition,
  PriceUpdate,
  UpdatedGovernance
} from "../generated/Futures/Futures"

export function createClosePositionEvent(
  marketId: BigInt,
  positionId: BigInt,
  trader: Address,
  startedAt: BigInt,
  size: BigInt,
  collateral: BigInt,
  entryPrice: BigInt,
  liqPrice: BigInt,
  long: boolean,
  currentPrice: BigInt
): ClosePosition {
  let closePositionEvent = changetype<ClosePosition>(newMockEvent())

  closePositionEvent.parameters = new Array()

  closePositionEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  closePositionEvent.parameters.push(
    new ethereum.EventParam(
      "positionId",
      ethereum.Value.fromUnsignedBigInt(positionId)
    )
  )
  closePositionEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  closePositionEvent.parameters.push(
    new ethereum.EventParam(
      "startedAt",
      ethereum.Value.fromUnsignedBigInt(startedAt)
    )
  )
  closePositionEvent.parameters.push(
    new ethereum.EventParam("size", ethereum.Value.fromUnsignedBigInt(size))
  )
  closePositionEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromUnsignedBigInt(collateral)
    )
  )
  closePositionEvent.parameters.push(
    new ethereum.EventParam(
      "entryPrice",
      ethereum.Value.fromUnsignedBigInt(entryPrice)
    )
  )
  closePositionEvent.parameters.push(
    new ethereum.EventParam(
      "liqPrice",
      ethereum.Value.fromUnsignedBigInt(liqPrice)
    )
  )
  closePositionEvent.parameters.push(
    new ethereum.EventParam("long", ethereum.Value.fromBoolean(long))
  )
  closePositionEvent.parameters.push(
    new ethereum.EventParam(
      "currentPrice",
      ethereum.Value.fromUnsignedBigInt(currentPrice)
    )
  )

  return closePositionEvent
}

export function createCreateFutureEvent(
  futureId: BigInt,
  market: string
): CreateFuture {
  let createFutureEvent = changetype<CreateFuture>(newMockEvent())

  createFutureEvent.parameters = new Array()

  createFutureEvent.parameters.push(
    new ethereum.EventParam(
      "futureId",
      ethereum.Value.fromUnsignedBigInt(futureId)
    )
  )
  createFutureEvent.parameters.push(
    new ethereum.EventParam("market", ethereum.Value.fromString(market))
  )

  return createFutureEvent
}

export function createDecreaseCollateralEvent(
  marketId: BigInt,
  positionId: BigInt,
  trader: Address,
  startedAt: BigInt,
  size: BigInt,
  collateral: BigInt,
  entryPrice: BigInt,
  liqPrice: BigInt,
  long: boolean,
  currentPrice: BigInt
): DecreaseCollateral {
  let decreaseCollateralEvent = changetype<DecreaseCollateral>(newMockEvent())

  decreaseCollateralEvent.parameters = new Array()

  decreaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  decreaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "positionId",
      ethereum.Value.fromUnsignedBigInt(positionId)
    )
  )
  decreaseCollateralEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  decreaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "startedAt",
      ethereum.Value.fromUnsignedBigInt(startedAt)
    )
  )
  decreaseCollateralEvent.parameters.push(
    new ethereum.EventParam("size", ethereum.Value.fromUnsignedBigInt(size))
  )
  decreaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromUnsignedBigInt(collateral)
    )
  )
  decreaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "entryPrice",
      ethereum.Value.fromUnsignedBigInt(entryPrice)
    )
  )
  decreaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "liqPrice",
      ethereum.Value.fromUnsignedBigInt(liqPrice)
    )
  )
  decreaseCollateralEvent.parameters.push(
    new ethereum.EventParam("long", ethereum.Value.fromBoolean(long))
  )
  decreaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "currentPrice",
      ethereum.Value.fromUnsignedBigInt(currentPrice)
    )
  )

  return decreaseCollateralEvent
}

export function createDecreasePositionEvent(
  marketId: BigInt,
  positionId: BigInt,
  trader: Address,
  startedAt: BigInt,
  size: BigInt,
  collateral: BigInt,
  entryPrice: BigInt,
  liqPrice: BigInt,
  long: boolean,
  currentPrice: BigInt
): DecreasePosition {
  let decreasePositionEvent = changetype<DecreasePosition>(newMockEvent())

  decreasePositionEvent.parameters = new Array()

  decreasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  decreasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "positionId",
      ethereum.Value.fromUnsignedBigInt(positionId)
    )
  )
  decreasePositionEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  decreasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "startedAt",
      ethereum.Value.fromUnsignedBigInt(startedAt)
    )
  )
  decreasePositionEvent.parameters.push(
    new ethereum.EventParam("size", ethereum.Value.fromUnsignedBigInt(size))
  )
  decreasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromUnsignedBigInt(collateral)
    )
  )
  decreasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "entryPrice",
      ethereum.Value.fromUnsignedBigInt(entryPrice)
    )
  )
  decreasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "liqPrice",
      ethereum.Value.fromUnsignedBigInt(liqPrice)
    )
  )
  decreasePositionEvent.parameters.push(
    new ethereum.EventParam("long", ethereum.Value.fromBoolean(long))
  )
  decreasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "currentPrice",
      ethereum.Value.fromUnsignedBigInt(currentPrice)
    )
  )

  return decreasePositionEvent
}

export function createIncreaseCollateralEvent(
  marketId: BigInt,
  positionId: BigInt,
  trader: Address,
  startedAt: BigInt,
  size: BigInt,
  collateral: BigInt,
  entryPrice: BigInt,
  liqPrice: BigInt,
  long: boolean,
  currentPrice: BigInt
): IncreaseCollateral {
  let increaseCollateralEvent = changetype<IncreaseCollateral>(newMockEvent())

  increaseCollateralEvent.parameters = new Array()

  increaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  increaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "positionId",
      ethereum.Value.fromUnsignedBigInt(positionId)
    )
  )
  increaseCollateralEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  increaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "startedAt",
      ethereum.Value.fromUnsignedBigInt(startedAt)
    )
  )
  increaseCollateralEvent.parameters.push(
    new ethereum.EventParam("size", ethereum.Value.fromUnsignedBigInt(size))
  )
  increaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromUnsignedBigInt(collateral)
    )
  )
  increaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "entryPrice",
      ethereum.Value.fromUnsignedBigInt(entryPrice)
    )
  )
  increaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "liqPrice",
      ethereum.Value.fromUnsignedBigInt(liqPrice)
    )
  )
  increaseCollateralEvent.parameters.push(
    new ethereum.EventParam("long", ethereum.Value.fromBoolean(long))
  )
  increaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "currentPrice",
      ethereum.Value.fromUnsignedBigInt(currentPrice)
    )
  )

  return increaseCollateralEvent
}

export function createIncreasePositionEvent(
  marketId: BigInt,
  positionId: BigInt,
  trader: Address,
  startedAt: BigInt,
  size: BigInt,
  collateral: BigInt,
  entryPrice: BigInt,
  liqPrice: BigInt,
  long: boolean,
  currentPrice: BigInt
): IncreasePosition {
  let increasePositionEvent = changetype<IncreasePosition>(newMockEvent())

  increasePositionEvent.parameters = new Array()

  increasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  increasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "positionId",
      ethereum.Value.fromUnsignedBigInt(positionId)
    )
  )
  increasePositionEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  increasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "startedAt",
      ethereum.Value.fromUnsignedBigInt(startedAt)
    )
  )
  increasePositionEvent.parameters.push(
    new ethereum.EventParam("size", ethereum.Value.fromUnsignedBigInt(size))
  )
  increasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromUnsignedBigInt(collateral)
    )
  )
  increasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "entryPrice",
      ethereum.Value.fromUnsignedBigInt(entryPrice)
    )
  )
  increasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "liqPrice",
      ethereum.Value.fromUnsignedBigInt(liqPrice)
    )
  )
  increasePositionEvent.parameters.push(
    new ethereum.EventParam("long", ethereum.Value.fromBoolean(long))
  )
  increasePositionEvent.parameters.push(
    new ethereum.EventParam(
      "currentPrice",
      ethereum.Value.fromUnsignedBigInt(currentPrice)
    )
  )

  return increasePositionEvent
}

export function createInitiateTradeEvent(
  msgSender: Address,
  futureId: BigInt,
  size: BigInt,
  collateral: BigInt,
  long: boolean,
  txType: BigInt,
  feedId: string
): InitiateTrade {
  let initiateTradeEvent = changetype<InitiateTrade>(newMockEvent())

  initiateTradeEvent.parameters = new Array()

  initiateTradeEvent.parameters.push(
    new ethereum.EventParam("msgSender", ethereum.Value.fromAddress(msgSender))
  )
  initiateTradeEvent.parameters.push(
    new ethereum.EventParam(
      "futureId",
      ethereum.Value.fromUnsignedBigInt(futureId)
    )
  )
  initiateTradeEvent.parameters.push(
    new ethereum.EventParam("size", ethereum.Value.fromUnsignedBigInt(size))
  )
  initiateTradeEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromUnsignedBigInt(collateral)
    )
  )
  initiateTradeEvent.parameters.push(
    new ethereum.EventParam("long", ethereum.Value.fromBoolean(long))
  )
  initiateTradeEvent.parameters.push(
    new ethereum.EventParam("txType", ethereum.Value.fromUnsignedBigInt(txType))
  )
  initiateTradeEvent.parameters.push(
    new ethereum.EventParam("feedId", ethereum.Value.fromString(feedId))
  )

  return initiateTradeEvent
}

export function createLiquidatePositionEvent(
  marketId: BigInt,
  positionId: BigInt,
  trader: Address,
  startedAt: BigInt,
  size: BigInt,
  collateral: BigInt,
  entryPrice: BigInt,
  liqPrice: BigInt,
  long: boolean,
  currentPrice: BigInt
): LiquidatePosition {
  let liquidatePositionEvent = changetype<LiquidatePosition>(newMockEvent())

  liquidatePositionEvent.parameters = new Array()

  liquidatePositionEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  liquidatePositionEvent.parameters.push(
    new ethereum.EventParam(
      "positionId",
      ethereum.Value.fromUnsignedBigInt(positionId)
    )
  )
  liquidatePositionEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  liquidatePositionEvent.parameters.push(
    new ethereum.EventParam(
      "startedAt",
      ethereum.Value.fromUnsignedBigInt(startedAt)
    )
  )
  liquidatePositionEvent.parameters.push(
    new ethereum.EventParam("size", ethereum.Value.fromUnsignedBigInt(size))
  )
  liquidatePositionEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromUnsignedBigInt(collateral)
    )
  )
  liquidatePositionEvent.parameters.push(
    new ethereum.EventParam(
      "entryPrice",
      ethereum.Value.fromUnsignedBigInt(entryPrice)
    )
  )
  liquidatePositionEvent.parameters.push(
    new ethereum.EventParam(
      "liqPrice",
      ethereum.Value.fromUnsignedBigInt(liqPrice)
    )
  )
  liquidatePositionEvent.parameters.push(
    new ethereum.EventParam("long", ethereum.Value.fromBoolean(long))
  )
  liquidatePositionEvent.parameters.push(
    new ethereum.EventParam(
      "currentPrice",
      ethereum.Value.fromUnsignedBigInt(currentPrice)
    )
  )

  return liquidatePositionEvent
}

export function createOpenPositionEvent(
  marketId: BigInt,
  positionId: BigInt,
  trader: Address,
  startedAt: BigInt,
  size: BigInt,
  collateral: BigInt,
  entryPrice: BigInt,
  liqPrice: BigInt,
  long: boolean,
  currentPrice: BigInt
): OpenPosition {
  let openPositionEvent = changetype<OpenPosition>(newMockEvent())

  openPositionEvent.parameters = new Array()

  openPositionEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  openPositionEvent.parameters.push(
    new ethereum.EventParam(
      "positionId",
      ethereum.Value.fromUnsignedBigInt(positionId)
    )
  )
  openPositionEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  openPositionEvent.parameters.push(
    new ethereum.EventParam(
      "startedAt",
      ethereum.Value.fromUnsignedBigInt(startedAt)
    )
  )
  openPositionEvent.parameters.push(
    new ethereum.EventParam("size", ethereum.Value.fromUnsignedBigInt(size))
  )
  openPositionEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromUnsignedBigInt(collateral)
    )
  )
  openPositionEvent.parameters.push(
    new ethereum.EventParam(
      "entryPrice",
      ethereum.Value.fromUnsignedBigInt(entryPrice)
    )
  )
  openPositionEvent.parameters.push(
    new ethereum.EventParam(
      "liqPrice",
      ethereum.Value.fromUnsignedBigInt(liqPrice)
    )
  )
  openPositionEvent.parameters.push(
    new ethereum.EventParam("long", ethereum.Value.fromBoolean(long))
  )
  openPositionEvent.parameters.push(
    new ethereum.EventParam(
      "currentPrice",
      ethereum.Value.fromUnsignedBigInt(currentPrice)
    )
  )

  return openPositionEvent
}

export function createPriceUpdateEvent(
  trader: Address,
  price: BigInt
): PriceUpdate {
  let priceUpdateEvent = changetype<PriceUpdate>(newMockEvent())

  priceUpdateEvent.parameters = new Array()

  priceUpdateEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  priceUpdateEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return priceUpdateEvent
}

export function createUpdatedGovernanceEvent(
  oldGovernance: Address,
  newGovernance: Address
): UpdatedGovernance {
  let updatedGovernanceEvent = changetype<UpdatedGovernance>(newMockEvent())

  updatedGovernanceEvent.parameters = new Array()

  updatedGovernanceEvent.parameters.push(
    new ethereum.EventParam(
      "oldGovernance",
      ethereum.Value.fromAddress(oldGovernance)
    )
  )
  updatedGovernanceEvent.parameters.push(
    new ethereum.EventParam(
      "newGovernance",
      ethereum.Value.fromAddress(newGovernance)
    )
  )

  return updatedGovernanceEvent
}
