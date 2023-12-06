import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useDeployment } from "@/context/deploymentContext";
import { Web3Provider, Signer, Contract } from "zksync-web3";
import getPaymasterParams from "@/hooks/usePaymasterPosition";
import { FuturesABI } from "../../smartContracts/futures";
import { ethers } from "ethers";
import { useErc20Allowance } from "@/hooks/useErc20Allowance";
import { approve } from "@/lib/smartContracts/erc20Functions";
import { floatToBigInt } from "@/lib/bigIntegers";
import { useMarket } from "@/context/marketContext";
import { usePrice } from "@/context/priceContext";

export const OpenPositionPaymasterButton = ({ collateral, leverage }) => {
  const { deployment } = useDeployment();
  const { balance: allowance, isLoading: isLoadingAllowance } =
    useErc20Allowance(deployment.usdc, deployment.futures);
  const { market: marketId } = useMarket();
  const toast = useToast();
  const { getPriceByMarket } = usePrice();
  const assetPrice = getPriceByMarket(marketId);
  const size = parseFloat((collateral * leverage).toFixed(2));
  const [isLoading, setIsLoading] = useState(false);

  const provider = new Web3Provider(window.ethereum);
  const signerInstance = provider.getSigner();

  const futuresContract = new Contract(
    process.env.NEXT_PUBLIC_ZKSYNC_FUTURES_ADDRESS,
    FuturesABI,
    signerInstance
  );

  const callTxPaymaster = async () => {
    try {
      let gasPrice = await provider.getGasPrice();
      let price = ethers.utils.formatEther(gasPrice.toString());

      let txHandle;
      const params = await getPaymasterParams({
        FuturesInstance: futuresContract,
        marketId: marketId,
        size: size,
        collateral: collateral,
        assetPrice: assetPrice,
        price: price,
      });
      txHandle = await futuresContract.increasePosition(
        marketId,
        floatToBigInt(size),
        floatToBigInt(collateral),
        floatToBigInt(assetPrice ? parseFloat(assetPrice) : 0),
        true,
        params
      );
      const res = await txHandle.wait();
      console.log("Transaction successful", res);
    } catch (err) {
      console.log("Transaction failed", err);
    }
  };

  const handleOpenPosition = async () => {
    setIsLoading(true);

    if (allowance < collateral) {
      const approveReq = await approve(
        deployment.usdc,
        deployment.futures,
        collateral
      );
    }
    await callTxPaymaster();
    setIsLoading(false);
  };

  return (
    <Button
      colorScheme="yellow"
      onClick={handleOpenPosition}
      isLoading={isLoading}
      loadingText="Submitting"
    >
      Open position (gasless)
    </Button>
  );
};
