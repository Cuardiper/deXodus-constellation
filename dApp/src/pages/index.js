import { Navbar } from "@/components/layout/navbar";
import TradingViewWidget from "@/components/tradingViewWidget";
import Head from "next/head";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { ExchangeUserInfo } from "@/components/exchangeUserInfo";
import { Trading } from "@/components/trading";
import { useMarket } from "@/context/marketContext";
import { usePrice } from "@/context/priceContext";

export default function Home() {
  const { market } = useMarket();
  const { getPriceByMarket } = usePrice();
  const price = getPriceByMarket(market);

  return (
    <div>
      <Head>
        <title>
          DeXodus |{" "}
          {price
            ? "$" + Number(price)
                .toLocaleString("en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
                .toString() + (market == 1 ? " - BTC-USDC" : " ETH-USDC")
            : ""}
        </title>
        <meta name="description" content="ETH Istanbul project" />
        <link rel="icon" href="/images/dexLogo_fit.png" />
      </Head>
      <div className="container mx-auto py-10">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div id="left" className="grid grid-cols-1 w-full">
            <div id="exchange-chart" style={{ height: "600px" }}>
              <TradingViewWidget
                chartSymbol={
                  market == 1 ? "BINANCE:BTCUSDC" : "BINANCE:ETHUSDC"
                }
              />
            </div>
            <div id="exchange-info" className="mt-6 hidden lg:block">
              <ExchangeUserInfo />
            </div>
          </div>
          <div id="right" className="mx-auto grid gird-cols-1">
            <div className="w-full sm:w-96 grid relative">
              <div className="w-full max-w-md p-2 bg-black/60 rounded-xl">
                <Tabs isFitted variant="solid-rounded" colorScheme="pink">
                  <TabList className="space-x-1 rounded-full bg-gray-900">
                    <Tab>Long</Tab>
                    <Tab isDisabled>Short</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Trading type="long" />
                    </TabPanel>
                    <TabPanel>
                      <Trading type="short" />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        <div id="exchange-info" className="mt-6  lg:hidden">
          <ExchangeUserInfo />
        </div>
      </div>
    </div>
  );
}
