import Head from "next/head";
import { MintButton } from "@/components/mintButton";
import { Button } from "@chakra-ui/react";
import { MintEXDButton } from "@/components/mintEXDButton";
import { useBalance } from "wagmi";
import { useAccount } from "wagmi";
import { Image } from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
import { useDeployment } from "@/context/deploymentContext";
import Link from "next/link";

export default function Home() {
  const { address } = useAccount();
  const { deployment } = useDeployment();

  /*const { data: paymasterBalance } = useBalance({
    address: "0x1AE6569a8Aa548ab994e7567D6410C047E2530c9",
    watch: true,
  });*/

  const { data: usdcBalance } = useBalance({
    address: address,
    token: deployment.usdc,
    watch: true,
  });

  const { data: exdBalance } = useBalance({
    address: address,
    token: deployment.exd,
    watch: true,
  });

  return (
    <div className="">
      <Head>
        <title>Use guide | DeXodus</title>
        <meta name="description" content="ETH Istanbul project" />
        <link rel="icon" href="/images/dexLogo_fit.png" />
      </Head>
      <div className="container mx-auto sm:my-6 my-2 flex flex-col w-full justify-center">
        <div className="mt-6 mb-6">
          <h1 className="text-white text-2xl">Use guide</h1>
          <p className="text-gray-400">
            Everything you need to know how to use the platform. Thanks for
            joining us in our early stages!
          </p>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <div className="w-full p-5 text-white bg-gradient-to-r from-rose-500/80 to-red-500/80 rounded-xl">
            <div className="flex flex-wrap sm:flex-nowrap justify-between">
              <div className="flex flex-wrap sm:flex-nowrap flex-grow">
                <div className="flex flex-col flex-grow w-full justify-center max-w-[140px] mr-10">
                  <div className="text-lg font-semibold">Trading</div>
                </div>
                <div className="flex flex-grow shrink items-center mr-4">
                  <p className="text-sm text-white">
                    Trading is the main feature of the platform. You can trade
                    long or short positions on BTC-USDC and ETH-USDC.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Button className="w-20">
                  <Link href="/">Trade</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full p-5 text-white bg-gradient-to-r from-fuchsia-600/80 to-pink-600/80 rounded-xl">
            <div className="flex flex-wrap sm:flex-nowrap justify-between">
              <div className="flex flex-wrap sm:flex-nowrap flex-grow">
                <div className="flex flex-col flex-grow w-full justify-center max-w-[140px] mr-10">
                  <div className="text-lg font-semibold">Provide liquidity</div>
                </div>
                <div className="flex flex-grow shrink items-center mr-4">
                  <p className="text-sm text-white">
                    You can provide liquidity to the platform and earn fees from
                    traders. You can also stake your LP tokens to earn EXD.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Button className="w-20">
                  <Link href="/liquidity">Stake</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full p-5 text-white bg-gradient-to-l from-blue-800 via-blue-700 to-indigo-700 rounded-xl">
            <div className="flex flex-wrap sm:flex-nowrap justify-between">
              <div className="flex flex-wrap sm:flex-nowrap flex-grow">
                <div className="flex flex-col flex-grow w-full justify-center max-w-[140px] mr-10">
                  <div className="text-lg font-semibold">Guardians</div>
                </div>
                <div className="flex flex-grow shrink items-center mr-4">
                  <p className="text-sm text-white">
                    This NFTs are your companions in DeXodus. They will grow and
                    evolve as you trade, giving you more benefits and rewards
                    just by using the platform.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Button className="w-20">
                  <Link href="/collection">Explore</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-10">
          <div>
            <h2 className="ml-2 text-white text-2xl">Utils</h2>
            <p className="ml-2 text-gray-400">
              These are some utils to help you manage the platform.
            </p>
          </div>
          <div className="w-full p-5 text-white bg-black/60 rounded-xl">
            <div className="flex flex-wrap sm:flex-nowrap justify-between">
              <div className="flex flex-wrap sm:flex-nowrap flex-grow mr-4">
                <div className="flex flex-col justify-center flex-grow w-full max-w-[550px] mr-10">
                  <div className="text-lg font-semibold">USDC (test)</div>
                  <p className="text-sm text-gray-400">
                    Get USDC token test the platform, you don&apos;t even need
                    native ETH to pay for gas!
                  </p>
                </div>
                <Divider
                  className="mr-4 hidden sm:block"
                  orientation="vertical"
                />
                <div className="flex flex-wrap justify-center">
                  <div className="flex items-center">
                    <Image
                      src="/images/crypto_logos/usd-coin-usdc-logo-40.png"
                      width={40}
                      height={40}
                      style={{ width: "22px", height: "22px" }}
                      alt="USDC logo"
                    />
                    <span className="ml-1 text-white font-semibold text-lg">
                      USDC
                    </span>
                  </div>
                  <div className="ml-2 flex flex-col justify-center">
                    <div className="text-lg font-semibold">
                      {usdcBalance &&
                        Number(usdcBalance.formatted)
                          .toLocaleString("en", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                          .toString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <MintButton />
              </div>
            </div>
          </div>
          <div className="w-full p-5 text-white bg-black/60 rounded-xl">
            <div className="flex flex-wrap sm:flex-nowrap justify-between">
              <div className="flex flex-wrap sm:flex-nowrap flex-grow mr-4">
                <div className="flex flex-col justify-center flex-grow w-full max-w-[550px] mr-10">
                  <div className="text-lg font-semibold">EXD</div>
                  <p className="text-sm text-gray-400">
                    EXD is the native token of the DeXodus platform. It is used
                    for staking and governance. It is also needed to open chests
                    and mint NFTs.
                  </p>
                </div>
                <Divider
                  className="mr-4 hidden sm:block"
                  orientation="vertical"
                />
                <div className="flex flex-wrap justify-center">
                  <div className="flex items-center">
                    <Image
                      src="/images/crypto_logos/usd-coin-usdc-logo-40.png"
                      width={40}
                      height={40}
                      style={{ width: "22px", height: "22px" }}
                      alt="USDC logo"
                    />
                    <span className="ml-1 text-white font-semibold text-lg">
                      EXD
                    </span>
                  </div>
                  <div className="ml-2 flex flex-col justify-center">
                    <div className="text-lg font-semibold">
                      {exdBalance &&
                        Number(exdBalance.formatted)
                          .toLocaleString("en", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                          .toString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <MintEXDButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
