import React from "react";
import { format, fromUnixTime } from "date-fns";
import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";

enum Pair {
  ETH_USD = "ETH-USD",
  BTC_USD = "BTC-USD",
}

const chainlinkPairToFeedId = {
  [Pair.ETH_USD]:
    "0x00027bbaff688c906a3e20a34fe951715d1018d262a5b66e38eda027a674cd1b",
  [Pair.BTC_USD]:
    "0x00020ffa644e6c585a5bec0e25ca476b9538198259e22b6240957720dcba0e14",
};

async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

type DatafeedContextType = {
  prices: {
    [Pair.ETH_USD]: string;
    [Pair.BTC_USD]: string;
  };
  dates: {
    [Pair.ETH_USD]: string;
    [Pair.BTC_USD]: string;
  };
  getPriceByMarket: (id: string) => string | undefined;
};

const DatafeedContext = createContext<DatafeedContextType>({
  prices: {
    [Pair.ETH_USD]: "",
    [Pair.BTC_USD]: "",
  },
  dates: { [Pair.ETH_USD]: "", [Pair.BTC_USD]: "" },
  getPriceByMarket: () => "",
});

export const useDatafeed = () => {
  return useContext(DatafeedContext);
};

export const DatafeedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ethUsdPrice, setEthUsdPrice] = useState("");
  const [btcUsdPrice, setBtcUsdPrice] = useState("");
  const [ethUsdDate, setEthUsdDate] = useState(
    format(new Date(), "MMM dd, y, HH:mm O")
  );
  const [btcUsdDate, setBtcUsdDate] = useState(
    format(new Date(), "MMM dd, y, HH:mm O")
  );

  const { data: ethData } = useSWR<
    {
      feedId: string;
      timestamp: number;
      price: string;
    }[]
  >(
    `/api/feed/${chainlinkPairToFeedId[Pair.ETH_USD]}
    `,
    fetcher,
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (ethData) {
      const ethUsd = ethData.find(
        (entry) => entry.feedId === chainlinkPairToFeedId[Pair.ETH_USD]
      );
      if (ethUsd) {
        setEthUsdPrice((Number(ethUsd.price) / 10 ** 10).toFixed(2));
        setEthUsdDate(
          format(fromUnixTime(ethUsd.timestamp), "MMM dd, y, HH:mm O")
        );
      }
    }
  }, [ethData]);

  const { data: btcData } = useSWR<
    {
      feedId: string;
      timestamp: number;
      price: string;
    }[]
  >(
    `/api/feed/${chainlinkPairToFeedId[Pair.BTC_USD]}
    `,
    fetcher,
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (btcData) {
      const btcUsd = btcData.find(
        (entry) => entry.feedId === chainlinkPairToFeedId[Pair.BTC_USD]
      );
      if (btcUsd) {
        setBtcUsdPrice((Number(btcUsd.price) / 10 ** 10).toFixed(2));
        setBtcUsdDate(
          format(fromUnixTime(btcUsd.timestamp), "MMM dd, y, HH:mm O")
        );
      }
    }
  }, [btcData]);

  const getPriceByMarket = (id: string) => {
    if (id == Pair.ETH_USD) {
      return ethUsdPrice;
    } else if (id === Pair.BTC_USD) {
      return btcUsdPrice;
    }
  };

  return (
    <DatafeedContext.Provider
      value={{
        prices: { [Pair.ETH_USD]: ethUsdPrice, [Pair.BTC_USD]: btcUsdPrice },
        dates: {
          [Pair.ETH_USD]: ethUsdDate,
          [Pair.BTC_USD]: btcUsdDate,
        },
        getPriceByMarket,
      }}
    >
      {children}
    </DatafeedContext.Provider>
  );
};
