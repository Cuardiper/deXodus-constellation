import { Contract, utils } from "zksync-web3";
import * as ethers from "ethers";
import { floatToBigInt } from "@/lib/bigIntegers";

const getPaymasterParams = async ({
  FuturesInstance,
  marketId,
  size,
  collateral,
  assetPrice,
  price,
}) => {
  console.log("marketId", marketId);
  console.log("size", size);
  console.log("collateral", collateral);
  console.log("assetPrice", assetPrice);
  console.log("price", price);
  const payMasterContractAddress = "0x1AE6569a8Aa548ab994e7567D6410C047E2530c9";

  let gasPrice = ethers.utils.parseEther(price);

  const paymasterParams = utils.getPaymasterParams(payMasterContractAddress, {
    type: "General",
    innerInput: new Uint8Array(), //ToDoo quitar!?!!?
  });

  // estimate gasLimit via paymaster
  const gasLimit = await FuturesInstance.estimateGas.increasePosition(
    marketId,
    floatToBigInt(size),
    floatToBigInt(collateral),
    floatToBigInt(assetPrice ? parseFloat(assetPrice) : 0),
    true,
    {
      //toDo poner amount a mintar
      customData: {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams: paymasterParams,
      },
    }
  );

  return {
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: ethers.BigNumber.from(0),
    gasLimit: gasLimit,
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams: paymasterParams,
    },
  };
};

export default getPaymasterParams;
