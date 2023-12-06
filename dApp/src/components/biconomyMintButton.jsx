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
import { ethers } from "ethers";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";
import { BiconomySmartAccount } from "@biconomy/account";

export const BiconomyMintButton = ({
  signer,
  biconomyAddress,
  smartAccount,
}) => {
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
        description: "Successfully minted 1.000.000 Test USDC!",
        status: "success",
        duration: 7000,
        isClosable: true,
      });
    },
  });

  const handleMint = async () => {
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ARBITRUM_USDC_TEST,
      USDC_ABI,
      signer
    );
    try {
      const minTx = await contract.populateTransaction.mint();
      console.log(minTx.data);
      const tx1 = {
        to: process.env.NEXT_PUBLIC_ARBITRUM_USDC_TEST,
        data: minTx.data,
      };
      let userOp = await smartAccount.buildUserOp([tx1], {
        skipBundlerGasEstimation: true,
      });
      console.log({ userOp });
      const biconomyPaymaster = smartAccount.paymaster;
      let paymasterServiceData = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
          name: "BICONOMY",
          version: "2.0.0",
        },
      };
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );

      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      const userOpResponse = await smartAccount.sendUserOp(userOp);
      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
    } catch (err) {
      console.error(err);
      console.log(err);
    }
  };

  return (
    <Button
      colorScheme="pink"
      onClick={handleMint}
      isLoading={isLoading}
      loadingText="Submitting"
    >
      Biconomy mint USDC
    </Button>
  );
};
