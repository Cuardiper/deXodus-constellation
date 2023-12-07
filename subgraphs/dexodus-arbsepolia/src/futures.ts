import {
  ClosePosition as ClosePositionEvent,
  DecreaseCollateral as DecreaseCollateralEvent,
  DecreasePosition as DecreasePositionEvent,
  IncreaseCollateral as IncreaseCollateralEvent,
  IncreasePosition as IncreasePositionEvent,
  LiquidatePosition as LiquidatePositionEvent,
  OpenPosition as OpenPositionEvent
} from "../generated/Futures/Futures"
import {
  Position,
  PositionUpdate
} from "../generated/schema"

export function handleOpenPosition(event: OpenPositionEvent): void {
  // create Position entity
  let id = event.params.positionId.toString()
  let position = new Position(id)
  position.marketId = event.params.marketId
  position.trader = event.params.trader
  position.startedAt = event.params.startedAt
  position.size = event.params.size
  position.collateral = event.params.collateral
  position.entryPrice = event.params.entryPrice
  position.currentPrice = event.params.currentPrice
  position.liqPrice = event.params.liqPrice
  position.long = event.params.long
  position.blockNumber = event.block.number
  position.blockTimestamp = event.block.timestamp
  position.transactionHash = event.transaction.hash
  position.isClosed = false
  position.save()

  // create PositionUpdate entity
  let positionUpdate = new PositionUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  positionUpdate.updateType = "open"
  positionUpdate.size = event.params.size
  positionUpdate.collateral = event.params.collateral
  positionUpdate.entryPrice = event.params.entryPrice
  positionUpdate.currentPrice = event.params.currentPrice
  positionUpdate.liqPrice = event.params.liqPrice
  positionUpdate.startedAt = event.params.startedAt
  positionUpdate.blockNumber = event.block.number
  positionUpdate.blockTimestamp = event.block.timestamp
  positionUpdate.transactionHash = event.transaction.hash
  positionUpdate.position = id
  positionUpdate.save()
}

export function handleIncreasePosition(event: IncreasePositionEvent): void {
  // update Position entity
  let id = event.params.positionId.toString()
  let position = Position.load(id)
  position!.size = event.params.size
  position!.collateral = event.params.collateral
  position!.entryPrice = event.params.entryPrice
  position!.currentPrice = event.params.currentPrice
  position!.liqPrice = event.params.liqPrice
  position!.transactionHash = event.transaction.hash
  position!.save()

  // create PositionUpdate entity
  let positionUpdate = new PositionUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  positionUpdate.updateType = "inc-pos"
  positionUpdate.size = event.params.size
  positionUpdate.collateral = event.params.collateral
  positionUpdate.entryPrice = event.params.entryPrice
  positionUpdate.currentPrice = event.params.currentPrice
  positionUpdate.liqPrice = event.params.liqPrice
  positionUpdate.startedAt = event.params.startedAt
  positionUpdate.blockNumber = event.block.number
  positionUpdate.blockTimestamp = event.block.timestamp
  positionUpdate.transactionHash = event.transaction.hash
  positionUpdate.position = id
  positionUpdate.save()
}

export function handleDecreasePosition(event: DecreasePositionEvent): void {
  // update Position entity
  let id = event.params.positionId.toString()
  let position = Position.load(id)
  position!.size = event.params.size
  position!.collateral = event.params.collateral
  position!.entryPrice = event.params.entryPrice
  position!.currentPrice = event.params.currentPrice
  position!.liqPrice = event.params.liqPrice
  position!.transactionHash = event.transaction.hash
  position!.save()

  // create PositionUpdate entity
  let positionUpdate = new PositionUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  positionUpdate.updateType = "dec-pos"
  positionUpdate.size = event.params.size
  positionUpdate.collateral = event.params.collateral
  positionUpdate.entryPrice = event.params.entryPrice
  positionUpdate.currentPrice = event.params.currentPrice
  positionUpdate.liqPrice = event.params.liqPrice
  positionUpdate.startedAt = event.params.startedAt
  positionUpdate.blockNumber = event.block.number
  positionUpdate.blockTimestamp = event.block.timestamp
  positionUpdate.transactionHash = event.transaction.hash
  positionUpdate.position = id
  positionUpdate.save()
}

export function handleIncreaseCollateral(event: IncreaseCollateralEvent): void {
  // update Position entity
  let id = event.params.positionId.toString()
  let position = Position.load(id)
  position!.size = event.params.size
  position!.collateral = event.params.collateral
  position!.entryPrice = event.params.entryPrice
  position!.currentPrice = event.params.currentPrice
  position!.liqPrice = event.params.liqPrice
  position!.transactionHash = event.transaction.hash
  position!.save()

  // create PositionUpdate entity
  let positionUpdate = new PositionUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  positionUpdate.updateType = "inc-col"
  positionUpdate.size = event.params.size
  positionUpdate.collateral = event.params.collateral
  positionUpdate.entryPrice = event.params.entryPrice
  positionUpdate.currentPrice = event.params.currentPrice
  positionUpdate.liqPrice = event.params.liqPrice
  positionUpdate.startedAt = event.params.startedAt
  positionUpdate.blockNumber = event.block.number
  positionUpdate.blockTimestamp = event.block.timestamp
  positionUpdate.transactionHash = event.transaction.hash
  positionUpdate.position = id
  positionUpdate.save()
}

export function handleDecreaseCollateral(event: DecreaseCollateralEvent): void {
  // update Position entity
  let id = event.params.positionId.toString()
  let position = Position.load(id)
  position!.size = event.params.size
  position!.collateral = event.params.collateral
  position!.entryPrice = event.params.entryPrice
  position!.currentPrice = event.params.currentPrice
  position!.liqPrice = event.params.liqPrice
  position!.transactionHash = event.transaction.hash
  position!.save()

  // create PositionUpdate entity
  let positionUpdate = new PositionUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  positionUpdate.updateType = "dec-col"
  positionUpdate.size = event.params.size
  positionUpdate.collateral = event.params.collateral
  positionUpdate.entryPrice = event.params.entryPrice
  positionUpdate.currentPrice = event.params.currentPrice
  positionUpdate.liqPrice = event.params.liqPrice
  positionUpdate.startedAt = event.params.startedAt
  positionUpdate.blockNumber = event.block.number
  positionUpdate.blockTimestamp = event.block.timestamp
  positionUpdate.transactionHash = event.transaction.hash
  positionUpdate.position = id
  positionUpdate.save()
}

export function handleClosePosition(event: ClosePositionEvent): void {
  // update Position entity
  let id = event.params.positionId.toString()
  let position = Position.load(id)
  position!.size = event.params.size
  position!.collateral = event.params.collateral
  position!.entryPrice = event.params.entryPrice
  position!.currentPrice = event.params.currentPrice
  position!.liqPrice = event.params.liqPrice
  position!.transactionHash = event.transaction.hash
  position!.isClosed = true
  position!.save()

  // create PositionUpdate entity
  let positionUpdate = new PositionUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  positionUpdate.updateType = "close"
  positionUpdate.size = event.params.size
  positionUpdate.collateral = event.params.collateral
  positionUpdate.entryPrice = event.params.entryPrice
  positionUpdate.currentPrice = event.params.currentPrice
  positionUpdate.liqPrice = event.params.liqPrice
  positionUpdate.startedAt = event.params.startedAt
  positionUpdate.blockNumber = event.block.number
  positionUpdate.blockTimestamp = event.block.timestamp
  positionUpdate.transactionHash = event.transaction.hash
  positionUpdate.position = id
  positionUpdate.save()
}

export function handleLiquidatePosition(event: LiquidatePositionEvent): void {
  // update Position entity
  let id = event.params.positionId.toString()
  let position = Position.load(id)
  position!.size = event.params.size
  position!.collateral = event.params.collateral
  position!.entryPrice = event.params.entryPrice
  position!.currentPrice = event.params.currentPrice
  position!.liqPrice = event.params.liqPrice
  position!.transactionHash = event.transaction.hash
  position!.isClosed = true
  position!.save()

  // create PositionUpdate entity
  let positionUpdate = new PositionUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  positionUpdate.updateType = "liq"
  positionUpdate.size = event.params.size
  positionUpdate.collateral = event.params.collateral
  positionUpdate.entryPrice = event.params.entryPrice
  positionUpdate.currentPrice = event.params.currentPrice
  positionUpdate.liqPrice = event.params.liqPrice
  positionUpdate.startedAt = event.params.startedAt
  positionUpdate.blockNumber = event.block.number
  positionUpdate.blockTimestamp = event.block.timestamp
  positionUpdate.transactionHash = event.transaction.hash
  positionUpdate.position = id
  positionUpdate.save()
}
