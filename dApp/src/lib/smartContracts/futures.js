import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
  watchContractEvent,
} from "@wagmi/core";

import { FuturesABI } from "../../../smartContracts/futures";
import { floatToBigInt } from "@/lib/bigIntegers";

export async function increasePosition(
  marketId,
  size,
  collateral,
  price,
  futuresAddress
) {
  const config = await prepareWriteContract({
    address: futuresAddress,
    abi: FuturesABI,
    functionName: "increasePosition",
    args: [
      marketId,
      floatToBigInt(size),
      floatToBigInt(collateral),
      floatToBigInt(price ? parseFloat(price) : 0),
      true,
    ],
    //chainId: chain.id,
  });

  const { hash } = await writeContract(config);

  const data = await waitForTransaction({ hash });

  return data;
}

export async function increasePositionV2(
  marketId,
  size,
  collateral,
  futuresAddress
) {
  const config = await prepareWriteContract({
    address: futuresAddress,
    abi: FuturesABI,
    functionName: "increasePosition",
    args: [
      marketId,
      floatToBigInt(size),
      floatToBigInt(collateral),
      true,
      "0x00027bbaff688c906a3e20a34fe951715d1018d262a5b66e38eda027a674cd1b",
    ],
  });

  const { hash } = await writeContract(config);

  const data = await waitForTransaction({ hash });

  return data;
}

export async function increaseCollateral(
  marketId,
  newCollateral,
  marketPrice,
  isLong = true,
  deployment
) {
  const config = await prepareWriteContract({
    address: deployment.futures,
    abi: FuturesABI,
    functionName: "increaseCollateral",
    args: [
      marketId,
      floatToBigInt(newCollateral),
      floatToBigInt(marketPrice ? parseFloat(marketPrice) : 0),
      isLong,
    ],
    //chainId: chain.id,
  });

  const { hash } = await writeContract(config);

  const data = await waitForTransaction({ hash });

  return data;
}

export async function increaseCollateralV2(
  marketId,
  newCollateral,
  isLong = true,
  deployment
) {
  console.log(
    "increaseCollateralV2",
    marketId,
    newCollateral,
    isLong,
    deployment.futures
  );
  const config = await prepareWriteContract({
    address: deployment.futures,
    abi: FuturesABI,
    functionName: "increaseCollateral",
    args: [
      marketId,
      floatToBigInt(newCollateral),
      isLong,
      "0x00027bbaff688c906a3e20a34fe951715d1018d262a5b66e38eda027a674cd1b",
    ],
    //chainId: chain.id,
  });

  const { hash } = await writeContract(config);

  const data = await waitForTransaction({ hash });

  return data;
}

export async function decreaseCollateral(
  marketId,
  percentageDecrease,
  marketPrice,
  isLong = true,
  deployment
) {
  const config = await prepareWriteContract({
    address: deployment.futures,
    abi: FuturesABI,
    functionName: "decreaseCollateral",
    args: [
      marketId,
      percentageDecrease,
      floatToBigInt(marketPrice ? parseFloat(marketPrice) : 0),
      isLong,
    ],
    //chainId: chain.id,
  });

  const { hash } = await writeContract(config);

  const data = await waitForTransaction({ hash });

  return data;
}

export async function decreaseCollateralV2(
  marketId,
  percentageDecrease,
  isLong = true,
  deployment
) {
  const config = await prepareWriteContract({
    address: deployment.futures,
    abi: FuturesABI,
    functionName: "decreaseCollateral",
    args: [
      marketId,
      percentageDecrease,
      isLong,
      "0x00027bbaff688c906a3e20a34fe951715d1018d262a5b66e38eda027a674cd1b",
    ],
    //chainId: chain.id,
  });

  const { hash } = await writeContract(config);

  const data = await waitForTransaction({ hash });

  return data;
}

export function watchEvent(eventName, handleEventFn, deployment) {
  const unwatch = watchContractEvent(
    {
      address: deployment.futures,
      abi: FuturesABI,
      eventName: eventName,
    },
    (log) => {
      handleEventFn(log, unwatch);
    }
  );
  return unwatch;
}
