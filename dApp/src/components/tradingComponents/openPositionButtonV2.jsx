import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { usePrice } from "@/context/priceContext";
import { useErc20Allowance } from "@/hooks/useErc20Allowance";
import { approve } from "@/lib/smartContracts/erc20Functions";
import { increasePositionV2, watchEvent } from "@/lib/smartContracts/futures";
import { useMarket } from "@/context/marketContext";
import { useDeployment } from "@/context/deploymentContext";
import { useAccount } from "wagmi";

export const OpenPositionButtonV2 = ({
  collateral,
  leverage,
  type = "long",
}) => {
  const { address } = useAccount();
  const { market } = useMarket();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { getPriceByMarket } = usePrice();
  const price = getPriceByMarket(market);
  const { deployment } = useDeployment();
  const { balance: allowance, isLoading: isLoadingAllowance } =
    useErc20Allowance(deployment.usdc, deployment.futures);

  //Size is collateral * leverage, use 2 decimals precision
  const size = parseFloat((collateral * leverage).toFixed(2));

  const handleOpenPosition = async () => {
    setIsLoading(true);
    try {
      if (allowance < collateral) {
        const approveReq = await approve(
          deployment.usdc,
          deployment.futures,
          collateral
        );
      }
      const increasePositionReq = await increasePositionV2(
        market,
        size,
        collateral,
        deployment.futures
      );
      toast({
        title: "Request sent",
        description: "Your position will be opened soon",
        status: "info",
        duration: 7000,
        isClosable: true,
      });
      watchEvent("IncreasePosition", handleEventReceived, deployment);
      watchEvent("OpenPosition", handleEventReceived, deployment);
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Something went wrong",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleEventReceived = (log, unwatch) => {
    console.log("IncreasePosition", log);
    if (log[0].args.trader == address) {
      toast({
        title: "Position opened",
        description: "Position opened",
        status: "success",
        duration: 7000,
        isClosable: true,
      });
      setIsLoading(false);
      unwatch?.();
    }
  };

  /*useContractEvent({
    address: deployment.futures,
    abi: FuturesABI,
    eventName: "IncreasePosition",
    listener(log) {
      console.log("IncreasePosition", log);
      if (log[0].args.trader == address) {
        toast({
          title: "Position opened",
          description: "Position opened",
          status: "success",
          duration: 7000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    },
  });*/

  return (
    <Button
      colorScheme="teal"
      size="lg"
      onClick={handleOpenPosition}
      isLoading={isLoading}
      loadingText="Submitting"
      isDisabled={!price}
    >
      {!price ? "Loading...please wait" : "Open position"}
    </Button>
  );
};
