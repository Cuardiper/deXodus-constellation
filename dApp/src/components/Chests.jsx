import { useState } from "react";
import { useAccount } from "wagmi";
import { useContractRead } from "wagmi";
import { useDeployment } from "@/context/deploymentContext";
import { chestABI } from "../../smartContracts/chest";
import Image from "next/image";
import { Button } from "@chakra-ui/react";
import { openChest, buyChest } from "@/lib/smartContracts/chest";
import { approve } from "@/lib/smartContracts/erc20Functions";
import { useErc20Allowance } from "@/hooks/useErc20Allowance";
import { claimNfts } from "@/lib/smartContracts/chest";
import { Badge } from "@chakra-ui/react";

export const Chests = ({}) => {
  const { address } = useAccount();
  const { deployment } = useDeployment();
  const [isLoadingBuy, setIsLoadingBuy] = useState(false);
  const [isLoadingOpen, setIsLoadingOpen] = useState(false);

  const { balance: allowanceUSDC } = useErc20Allowance(
    deployment.usdc,
    deployment.chest
  );

  const { balance: allowanceEXD } = useErc20Allowance(
    deployment.exd,
    deployment.chest
  );

  const { data: nChests } = useContractRead({
    address: deployment.chest,
    abi: chestABI,
    functionName: "balanceOf",
    args: [address, 1],
    watch: true,
  });

  const handleBuy = async () => {
    try {
      setIsLoadingBuy(true);
      if (allowanceUSDC < 50) {
        const approveReq = await approve(deployment.usdc, deployment.chest, 50);
      }
      await buyChest(deployment.chest);
      setIsLoadingBuy(false);
    } catch (e) {
      console.log(e);
      setIsLoadingBuy(false);
    }
  };

  const handleOpen = async () => {
    try {
      setIsLoadingOpen(true);
      if (allowanceEXD < 1) {
        const approveReq = await approve(
          deployment.exd,
          deployment.chest,
          1,
          18
        );
      }
      await openChest(deployment.chest);
      setIsLoadingOpen(false);
    } catch (e) {
      console.log(e);
      setIsLoadingOpen(false);
    }
  };

  return (
    <div
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(min(100%/2, max(350px, 100%/${5})), 1fr))`,
      }}
      className="grid gap-4 py-8 lg:py-10 h-full"
    >
      <div className="flex flex-col justify-center items-center border border-neutral-800 rounded-lg p-4 bg-[#0d1116]">
        <Image
          src="/images/chest.png"
          alt="Chests"
          width={928}
          height={928}
          className="w-48 h-auto"
        />
        <div className="-mt-4 text-white text-2xl font-semibold">
          Treasury chest
        </div>
        <div className="text-gray-400 mt-1">
          Discover exclusive NFT guardians
        </div>
        <Badge className="mt-4" variant="subtle" colorScheme="purple">
          {nChests > 0 ? "Owned: " + nChests : "New"}
        </Badge>
        {nChests > 0 ? (
          <Button
            colorScheme="pink"
            className="mt-4 w-full"
            isLoading={isLoadingOpen}
            onClick={handleOpen}
          >
            Open chest
          </Button>
        ) : (
          <Button
            colorScheme="pink"
            className="w-full mt-4"
            isLoading={isLoadingBuy}
            onClick={handleBuy}
          >
            Purchase for 50 USDC
          </Button>
        )}
      </div>
    </div>
  );
};
