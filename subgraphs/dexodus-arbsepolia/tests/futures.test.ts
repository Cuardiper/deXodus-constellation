import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ClosePosition } from "../generated/schema"
import { ClosePosition as ClosePositionEvent } from "../generated/Futures/Futures"
import { handleClosePosition } from "../src/futures"
import { createClosePositionEvent } from "./futures-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let marketId = BigInt.fromI32(234)
    let positionId = BigInt.fromI32(234)
    let trader = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let startedAt = BigInt.fromI32(234)
    let size = BigInt.fromI32(234)
    let collateral = BigInt.fromI32(234)
    let entryPrice = BigInt.fromI32(234)
    let liqPrice = BigInt.fromI32(234)
    let long = "boolean Not implemented"
    let currentPrice = BigInt.fromI32(234)
    let newClosePositionEvent = createClosePositionEvent(
      marketId,
      positionId,
      trader,
      startedAt,
      size,
      collateral,
      entryPrice,
      liqPrice,
      long,
      currentPrice
    )
    handleClosePosition(newClosePositionEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ClosePosition created and stored", () => {
    assert.entityCount("ClosePosition", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ClosePosition",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "marketId",
      "234"
    )
    assert.fieldEquals(
      "ClosePosition",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "positionId",
      "234"
    )
    assert.fieldEquals(
      "ClosePosition",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "trader",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ClosePosition",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "startedAt",
      "234"
    )
    assert.fieldEquals(
      "ClosePosition",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "size",
      "234"
    )
    assert.fieldEquals(
      "ClosePosition",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "collateral",
      "234"
    )
    assert.fieldEquals(
      "ClosePosition",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "entryPrice",
      "234"
    )
    assert.fieldEquals(
      "ClosePosition",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "liqPrice",
      "234"
    )
    assert.fieldEquals(
      "ClosePosition",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "long",
      "boolean Not implemented"
    )
    assert.fieldEquals(
      "ClosePosition",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "currentPrice",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
