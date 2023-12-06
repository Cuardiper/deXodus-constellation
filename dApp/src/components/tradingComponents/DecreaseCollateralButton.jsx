import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { decreaseCollateral } from "@/lib/smartContracts/futures";
import { useDeployment } from "@/context/deploymentContext";

export const DecreaseCollateralButton = ({
  marketId,
  sizeToClose,
  totalSize,
  marketPrice,
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
      await decreaseCollateral(
        marketId,
        percent,
        marketPrice,
        type == "long" ? true : false,
        deployment
      );
      toast({
        title: "Position edited",
        description: "Your position has been modified",
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

  return (
    <Button
      colorScheme="pink"
      size="lg"
      onClick={handleOpenPosition}
      isLoading={isLoading}
      loadingText="Submitting"
    >
      Edit
    </Button>
  );
};
