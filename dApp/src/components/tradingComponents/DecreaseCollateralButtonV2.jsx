import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { decreaseCollateralV2, watchEvent } from "@/lib/smartContracts/futures";
import { useDeployment } from "@/context/deploymentContext";
import { useAccount } from "wagmi";

export const DecreaseCollateralButtonV2 = ({
  marketId,
  sizeToClose,
  totalSize,
  type = "long",
  onSuccess, // Callback function when the transaction is successful (position is closed)
}) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { deployment } = useDeployment();

  const percent = Math.round((sizeToClose / totalSize) * 10000);

  const handleOpenPosition = async () => {
    setIsLoading(true);
    try {
      await decreaseCollateralV2(
        marketId,
        percent,
        type == "long" ? true : false,
        deployment
      );
      toast({
        title: "Position edited",
        description: "Your position will be modified",
        status: "info",
        duration: 7000,
        isClosable: true,
      });
      watchEvent("DecreaseCollateral", handleEventReceived, deployment);
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
    console.log("DecreaseCollateral", log);
    if (log[0].args.trader == address) {
      toast({
        title: "Position edited",
        description: "The collateral has been decreased",
        status: "success",
        duration: 7000,
        isClosable: true,
      });
      onSuccess();
      setIsLoading(false);
      unwatch?.();
    }
  };

  /*useContractEvent({
    address: deployment.futures,
    abi: FuturesABI,
    eventName: "PriceUpdate",
    listener(log) {
      console.log("PriceUpdate", log);
      unwatch?.();
      toast({
        title: "Position edited",
        description: "Collateral has been decreased",
        status: "success",
        duration: 7000,
        isClosable: true,
      });
    },
  });*/

  return (
    <Button
      colorScheme="teal"
      size="lg"
      onClick={handleOpenPosition}
      isLoading={isLoading}
      loadingText="Submitting"
    >
      Edit
    </Button>
  );
};
