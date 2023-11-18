import { Navbar } from "./navbar";
import React, { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { useETH1InchPriceAggregator } from "@/hooks/useETH1inchPriceAggregator";
import { useBTC1InchPriceAggregator } from "@/hooks/useBTC1inchPriceAggregator";
import { usePrice } from "@/context/priceContext";
import { useMarket } from "@/context/marketContext";
import { useDeployment } from "@/context/deploymentContext";
import { useNetwork } from "wagmi";
import backgroundImage from "../../../public/images/istanbul_wallpaper_fit.png";
import Image from "next/image";

export default function Layout({ children, ...props }) {
  const { isLoading: ethIsLoading1inch } = useETH1InchPriceAggregator();
  const { isLoading: btcIsLoading1inch } = useBTC1InchPriceAggregator(
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
  ); //WBTC (mainnet) address
  const { market } = useMarket();
  const { getDeploymentAddress, setDeploymentData } = useDeployment();
  const { getPriceByMarket } = usePrice();
  const price = getPriceByMarket(market);
  const { chain, chains } = useNetwork();

  //Load deployment context
  useEffect(() => {
    let deployment;
    if (!chain || chain.id == "11155111") {
      //Sepolia network id
      deployment = {
        futures: process.env.NEXT_PUBLIC_SEPOLIA_FUTURES_ADDRESS,
        liquidity: process.env.NEXT_PUBLIC_SEPOLIA_LIQUIDITY_ADDRESS,
        usdc: process.env.NEXT_PUBLIC_SEPOLIA_USDC_TEST,
        chest: process.env.NEXT_PUBLIC_SEPOLIA_CHEST,
        exd: process.env.NEXT_PUBLIC_SEPOLIA_EXD,
        guardians: process.env.NEXT_PUBLIC_SEPOLIA_GUARDIANS,
      };
    } else {
      deployment = {
        futures: process.env.NEXT_PUBLIC_ZKSYNC_FUTURES_ADDRESS,
        liquidity: process.env.NEXT_PUBLIC__ZKSYNC_LIQUIDITY_ADDRESS,
        usdc: process.env.NEXT_PUBLIC_ZKSYNC_USDC_TEST,
        chest: process.env.NEXT_PUBLIC_ZKSYNC_CHEST,
        exd: process.env.NEXT_PUBLIC_ZKSYNC_EXD,
        guardians: process.env.NEXT_PUBLIC_ZKSYNC_GUARDIANS,
      };
    }
    setDeploymentData(deployment);
  }, [chain]);

  const futuresAddress = getDeploymentAddress("futures");

  if (ethIsLoading1inch || btcIsLoading1inch || !price || !futuresAddress) {
    console.log("loading");
    return (
      <div className="w-full flex justify-center items-center h-screen bg-[#0d1116]">
        <Navbar />
        <Spinner
          size="xl"
          colorScheme="teal"
          thickness="4px"
          emptyColor="gray.800"
          color="teal.500"
        />
      </div>
    );
  } else {
    return (
      <>
        <Navbar />
        <div className="relative w-full bg-[#0d1116]">
          <div className="lg:flex">
            <main className="z-40 flex-auto w-full min-h-screen lg:static lg:max-h-full lg:overflow-visible">
              {children}
            </main>
          </div>
          <Image
            className="z-10 opacity-10 object-contain"
            src={backgroundImage}
            layout="fill"
          />
        </div>
      </>
    );
  }
}
