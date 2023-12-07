import { Button, ButtonGroup } from "@chakra-ui/react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
} from "wagmi";
import { FuturesABI } from "../../../smartContracts/futures";
import { useToast } from "@chakra-ui/react";
import { useDeployment } from "@/context/deploymentContext";
import { useAccount } from "wagmi";
import { watchEvent } from "@/lib/smartContracts/futures";
import { useState } from "react";

export const ClosePositionButtonV2 = ({
  marketId,
  sizeToClose,
  totalSize,
  type = "long",
  onSuccess, // Callback function when the transaction is successful (position is closed)
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const toast = useToast();
  const { chain } = useNetwork();
  const { deployment } = useDeployment();
  //calculate the tenmilpercent of the position to close
  const percent = Math.round((sizeToClose / totalSize) * 10000);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: deployment.futures,
    abi: FuturesABI,
    functionName: "decreasePosition",
    args: [
      marketId,
      percent,
      //true,     //TODO: keep leverage ratio, hardcoded in smart contract for now
      type == "long" ? true : false,
      "0x00027bbaff688c906a3e20a34fe951715d1018d262a5b66e38eda027a674cd1b",
    ],
    chainId: chain.id,
    onError(error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 7000,
        isClosable: true,
      });
    },
  });

  const { data, error, isError, write } = useContractWrite({
    ...config,
    onSuccess() {
      // Handle success logic
    },
  });

  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(TxData) {
      toast({
        title: "Request sent",
        description: "Your position will be closed soon",
        status: "info",
        duration: 7000,
        isClosable: true,
      });
    },
  });

  const handleClosePosition = async () => {
    try {
      setIsLoading(true);
      await write();
      watchEvent("DecreasePosition", handleEventReceived, deployment);
      watchEvent("ClosePosition", handleEventReceived, deployment);
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Something went wrong",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      console.log(error);
    }
  };

  const handleEventReceived = (log, unwatch) => {
    console.log("ClosePosition", log);
    if (log[0].args.trader == address) {
      toast({
        title: "Position closed",
        description: "Positon closed",
        status: "success",
        duration: 7000,
        isClosable: true,
      });
      setIsLoading(false);
      onSuccess();
      unwatch?.();
    }
  };

  /*const unwatch = useContractEvent({
    address: deployment.futures,
    abi: FuturesABI,
    eventName: "PriceUpdate",
    listener(log) {
      console.log("PriceUpdate(closePosition)", log);
      if (log[0].args.trader == address) {
        toast({
          title: "Position closed",
          description: "Your position has been closed",
          status: "success",
          duration: 7000,
          isClosable: true,
        });
        unwatch?.();
      } else {
        console.log("Position opened by another user");
      }
    },
  });
  */

  return (
    <>
      <Button
        colorScheme="teal"
        size="lg"
        onClick={handleClosePosition}
        isLoading={isLoading}
        loadingText="Closing"
        width="100%"
      >
        Close position
      </Button>
    </>
  );
};
