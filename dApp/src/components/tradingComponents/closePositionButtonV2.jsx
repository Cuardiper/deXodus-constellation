import { Button, ButtonGroup } from "@chakra-ui/react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
} from "wagmi";
import { FuturesABI } from "../../../smartContracts/futures";
import { useToast } from "@chakra-ui/react";
import { useContractEvent } from "wagmi";
import { useDeployment } from "@/context/deploymentContext";

export const ClosePositionButtonV2 = ({
  marketId,
  sizeToClose,
  totalSize,
  type = "long",
  onSuccess, // Callback function when the transaction is successful (position is closed)
}) => {
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

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(TxData) {
      toast({
        title: "Request sent",
        description: "Your position is being closed",
        status: "info",
        duration: 7000,
        isClosable: true,
      });
      onSuccess();
    },
  });

  useContractEvent({
    address: deployment.futures,
    abi: FuturesABI,
    eventName: "PriceUpdate",
    listener(log) {
      toast({
        title: "Position closed",
        description: "Position closed",
        status: "success",
        duration: 7000,
        isClosable: true,
      });
    },
  });

  return (
    <>
      <Button
        colorScheme="teal"
        size="lg"
        onClick={write}
        isLoading={isLoading}
        loadingText="Closing"
        width="100%"
      >
        Close position
      </Button>
    </>
  );
};
