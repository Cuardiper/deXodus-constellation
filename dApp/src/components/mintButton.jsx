import { Button } from "@chakra-ui/react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
} from "wagmi";
import { USDC_ABI } from "../../smartContracts/USDC_Test";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { floatToBigInt } from "@/lib/bigIntegers";
import { useAccount } from "wagmi";
import { useDeployment } from "@/context/deploymentContext";

export const MintButton = () => {
  const [txStatus, setTxStatus] = useState("idle");
  const toast = useToast();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { deployment } = useDeployment();
  const { chain } = useNetwork();

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: deployment.usdc,
    abi: USDC_ABI,
    functionName: "mint",
  });

  const { data, error, isError, write } = useContractWrite({
    ...config,
    onSuccess() {
      setTxStatus("submitting");
    },
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(TxData) {
      setTxStatus("success");
      toast({
        title: "Minted",
        description: "Successfully minted 5.000 Test USDC!",
        status: "success",
        duration: 7000,
        isClosable: true,
      });
    },
  });

  return (
    <Button
      colorScheme="pink"
      onClick={write}
      isLoading={isLoading}
      loadingText="Submitting"
    >
      Mint USDC
    </Button>
  );
};
