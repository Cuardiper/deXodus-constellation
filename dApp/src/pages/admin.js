import Head from "next/head";
import { MintButton } from "@/components/mintButton";
import { MintNFTButton } from "@/components/mintNFTButton";
import { MintEXDButton } from "@/components/mintEXDButton";
import { useBalance } from "wagmi";
import { useAccount } from "wagmi";
import { BiconomyMintButton } from "@/components/biconomyMintButton";

import { useState, useEffect } from "react";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";

export default function Home() {
  const { address } = useAccount();
  const [smartAccount, setSmartAccount] = useState(null);
  const [biconomyAddress, setBiconomyAddress] = useState(null);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  // Biconomy smart account setup
  useEffect(() => {
    const init = async () => {
      const bundler = new Bundler({
        bundlerUrl:
          "https://bundler.biconomy.io/api/v2/421613/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
        chainId: ChainId.ARBITRUM_GOERLI_TESTNET,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      });

      const paymaster = new BiconomyPaymaster({
        paymasterUrl:
          "https://paymaster.biconomy.io/api/v1/421613/7l8kWub-v.29f1cf9b-d01f-4dbf-86df-ce6554567332",
      });

      const BCmodule = await ECDSAOwnershipValidationModule.create({
        signer: signer,
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
      });

      let biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.ARBITRUM_GOERLI_TESTNET,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: BCmodule,
        activeValidationModule: BCmodule,
      });
      setSmartAccount(biconomySmartAccount);
      setBiconomyAddress(await biconomySmartAccount.getAccountAddress());
    };
    init();
  }, [signer]);

  // GET BALANCES (paymaster testing)
  const { data, isError, isLoading } = useBalance({
    address: address,
    watch: true,
  });
  const { data: paymasterBalance } = useBalance({
    address: "0x1AE6569a8Aa548ab994e7567D6410C047E2530c9",
    watch: true,
  });
  const { data: usdcBalance } = useBalance({
    address: address,
    token: "0x0afF07256268FA6E5e5E0757806592abb776149c", //arbitrum goerli
    watch: true,
  });

  return (
    <div className="">
      <Head>
        <title>Use guide | DeXodus</title>
        <meta name="description" content="ETH Istanbul project" />
        <link rel="icon" href="/images/dexLogo_fit.png" />
      </Head>
      <div className="container mx-auto py-10 flex flex-col w-full items-center justify-center">
        <div className="mt-10 flex mb-6">
          <h1 className="text-white text-xl">ADMIN OPTIONS</h1>
        </div>
        <p className="text-white text-xl">
          My account: {data && data.formatted}
        </p>
        <p className="text-white text-xl">
          Paymaster: {paymasterBalance && paymasterBalance.formatted}
        </p>
        <p className="text-white text-xl">
          USDC: {usdcBalance && usdcBalance.formatted}
        </p>
        <div className="flex">
          <div className="ml-5 flex flex-wrap gap-4 items-center">
            <div>
              <MintButton />
            </div>
            <div>
              <MintEXDButton />
            </div>
            <div>
              <MintNFTButton />
            </div>
            <div>
              <BiconomyMintButton
                signer={signer}
                biconomyAddress={biconomyAddress}
                smartAccount={smartAccount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
