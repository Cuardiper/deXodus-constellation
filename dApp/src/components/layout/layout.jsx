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
  const { chain } = useNetwork();

  //Load deployment context
  useEffect(() => {
    let deployment;
    if (!chain || chain.id == "421614") {
      //Sepolia network id
      deployment = {
        futures: process.env.NEXT_PUBLIC_SEPOLIA_FUTURES_ADDRESS,
        liquidity: process.env.NEXT_PUBLIC_SEPOLIA_LIQUIDITY_ADDRESS,
        price: process.env.NEXT_PUBLIC_SEPOLIA_PRICE_FEED,
        usdc: process.env.NEXT_PUBLIC_SEPOLIA_USDC_TEST,
        chest: process.env.NEXT_PUBLIC_SEPOLIA_CHEST,
        exd: process.env.NEXT_PUBLIC_SEPOLIA_EXD,
        guardians: process.env.NEXT_PUBLIC_SEPOLIA_GUARDIANS,
      };
    } else {
      deployment = {
        futures: process.env.NEXT_PUBLIC_ZKSYNC_FUTURES_ADDRESS,
        liquidity: process.env.NEXT_PUBLIC__ZKSYNC_LIQUIDITY_ADDRESS,
        price: process.env.NEXT_PUBLIC_ZKSYNC_PRICE_FEED,
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
    return (
      <>
        <Navbar />
        <div className="w-full flex justify-center items-center h-screen bg-[#0d1116]">
          <Spinner
            size="xl"
            colorScheme="pink"
            thickness="4px"
            emptyColor="gray.800"
            color="teal.500"
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <Navbar />
        <div className="relative w-full min-h-screen bg-[#0d1116]">
          <div className="flex">
            <main className="mx-3 z-40 flex-auto w-full lg:overflow-hidden">{children}</main>
          </div>
          <Image
            alt=""
            className="z-10 opacity-10 object-contain"
            src={backgroundImage}
            layout="fill"
          />
        </div>
      </>
    );
  }
}
