import { Navbar } from "@/components/layout/navbar";
import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import { AddLiquidityButton } from "@/components/tradingComponents/addLiquidityButton";
import { WithdrawLiquidityButton } from "@/components/tradingComponents/withdrawLiquidityButton";
import { useErc20Allowance } from "@/hooks/useErc20Allowance";
import { useBalance, useAccount } from "wagmi";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useDeployment } from "@/context/deploymentContext";

export default function Home() {
  const isMounted = useIsMounted();
  const { address, isConnected } = useAccount();
  const { deployment } = useDeployment();
  const [quantity, setQuantity] = useState(0.0);
  const [quantityW, setQuantityW] = useState(0.0);
  const { balance: allowance, isLoading: isLoadingAllowance } =
    useErc20Allowance(deployment.usdc, deployment.liquidity);

  const { data, isError, isLoading } = useBalance({
    address: address,
    token: deployment.liquidity,
    watch: true,
  });

  const { data: USDCBalance, balanceIsLoading } = useBalance({
    address: address,
    token: deployment.usdc,
    watch: true,
  });

  const changeLiquidity = (value) => {
    if (isNaN(value) || !isFinite(value)) {
      setQuantity(0);
      return;
    }
    setQuantity(parseFloat(value));
  };

  const changeLiquidityW = (value) => {
    if (isNaN(value) || !isFinite(value)) {
      setQuantityW(0);
      return;
    }
    setQuantityW(parseFloat(value));
  };

  return (
    <>
      <div>
        <Head>
          <title>Protocol | DeXodus</title>
          <meta name="description" content="ETH Istanbul project" />
          <link rel="icon" href="/images/dexLogo_fit.png" />
        </Head>
        <div className="container mx-auto sm:my-6 my-2 flex flex-col w-full justify-center">
          <div className="mt-6 mb-6">
            <h1 className="text-white text-2xl">Provide liquidity</h1>
            <p className="text-gray-400">
              Become a liquidity provider and empower the market, earning
              rewards while supporting the seamless flow of assets.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex flex-col bg-[#1a212b] p-6 rounded-lg">
              <div className="text-neutral-400 font-semibold">EXLP value</div>
              <div className="flex mt-2 text-white font-semibold text-xl justify-between w-52 items-center">
                <div>
                  {isMounted && !isLoading && data
                    ? parseFloat(data.formatted).toFixed(4)
                    : "..."}
                </div>
                <div>
                  <Image
                    src="/images/liquidity.png"
                    width={40}
                    height={40}
                    style={{ width: "30px", height: "30px" }}
                    alt="USDC logo"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-[#1a212b] p-6 rounded-lg">
              <div className="text-neutral-400 font-semibold">USDC balance</div>
              <div className="flex mt-2 text-white font-semibold text-xl justify-between w-52 items-center">
                <div>
                  {isMounted && !balanceIsLoading && USDCBalance
                    ? parseFloat(USDCBalance.formatted).toFixed(4)
                    : "..."}
                </div>
                <div>
                  <Image
                    src="/images/crypto_logos/usd-coin-usdc-logo-40.png"
                    width={40}
                    height={40}
                    style={{ width: "25px", height: "25px" }}
                    alt="USDC"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex flex-wrap gap-10 mt-4">
              <div className="flex-col">
                <div className="ml-1 mb-2 text-white text-xl font-semibold">
                  Add
                </div>
                <div className="flex flex-col">
                  <div className="p-4 w-fit bg-gray-900 border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between text-sm font-medium text-gray-400">
                      <div>
                        <span className="">Quantity: </span>
                      </div>
                      <span className="">
                        Balance:{" "}
                        <span
                          className="text-white cursor-pointer"
                          onClick={() =>
                            changeLiquidity(parseFloat(USDCBalance?.formatted))
                          }
                        >
                          {" "}
                          {isMounted && !balanceIsLoading && USDCBalance
                            ? parseFloat(USDCBalance.formatted).toFixed(4)
                            : "..."}
                        </span>
                      </span>
                    </div>
                    <div className="w-fit mt-3 flex items-center justify-between">
                      <input
                        value={quantity}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        autoCorrect="off"
                        minLength={1}
                        maxLength={15}
                        spellCheck="false"
                        id="pay-input"
                        className="bg-transparent sm:text-lg text-white"
                        placeholder="0.00"
                        onChange={(e) => {
                          changeLiquidity(parseFloat(e.target.value));
                        }}
                      />
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
                    </div>
                  </div>
                  <div className="w-full text-center mt-6">
                    <AddLiquidityButton amount={quantity} />
                  </div>
                </div>
              </div>
              <div className="flex-col">
                <div className="ml-1 mb-2 text-white text-xl font-semibold">
                  Withdraw
                </div>
                <div className="flex flex-col">
                  <div className="p-4 w-fit bg-gray-900 border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between text-sm font-medium text-gray-400">
                      <div>
                        <span className="">Quantity: </span>
                      </div>
                    </div>
                    <div className="w-fit mt-3 flex items-center justify-between">
                      <input
                        value={quantityW}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        autoCorrect="off"
                        minLength={1}
                        maxLength={15}
                        spellCheck="false"
                        id="pay-input"
                        className="bg-transparent sm:text-lg text-white"
                        placeholder="0.00"
                        onChange={(e) => {
                          changeLiquidityW(parseFloat(e.target.value));
                        }}
                      />
                      <div className="flex items-center">
                        <Image
                          src="/images/crypto_logos/usd-coin-usdc-logo-40.png"
                          width={40}
                          height={40}
                          style={{ width: "22px", height: "22px" }}
                          alt="USDC logo"
                        />
                        <span className="ml-1 text-white font-semibold text-lg">
                          EXLP
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full text-center mt-6">
                    <WithdrawLiquidityButton amount={quantityW} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
