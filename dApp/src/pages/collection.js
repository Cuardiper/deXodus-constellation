import Head from "next/head";
import { NFTCollectionV2 } from "@/components/nftCollectionV2";
import { Chests } from "@/components/Chests";

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Collection | DeXodus</title>
        <meta name="description" content="ETH Istanbul project" />
        <link rel="icon" href="/images/dexLogo_fit.png" />
      </Head>
      <div className="container mx-auto sm:my-6 my-2 flex flex-col w-full justify-center">
        <div className="mt-6">
          <h1 className="text-white text-2xl">Market</h1>
          <p className="text-gray-400">Get new guardians!</p>
        </div>
        <Chests />
        <div className="mt-6">
          <h1 className="text-white text-2xl">My guardians</h1>
          <p className="text-gray-400">
            Unique digital assets that not only represent your trading
            achievements but also grow and evolve as you succeed in the market.
          </p>
        </div>
        <NFTCollectionV2 />
      </div>
    </div>
  );
}
