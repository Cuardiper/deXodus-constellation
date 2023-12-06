import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { decreaseCollateralV2 } from "@/lib/smartContracts/futures";
import { useDeployment } from "@/context/deploymentContext";
import { useContractEvent } from "wagmi";
import { FuturesABI } from "../../../smartContracts/futures";

export const DecreaseCollateralButtonV2 = ({
  marketId,
  sizeToClose,
  totalSize,
  type = "long",
  onSuccess, // Callback function when the transaction is successful (position is closed)
}) => {
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
        status: "success",
        duration: 7000,
        isClosable: true,
      });
      onSuccess();
      setIsLoading(false);
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

  useContractEvent({
    address: deployment.futures,
    abi: FuturesABI,
    eventName: "PriceUpdate",
    listener(log) {
      toast({
        title: "Position edited",
        description: "Position edited",
        status: "success",
        duration: 7000,
        isClosable: true,
      });
    },
  });

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
