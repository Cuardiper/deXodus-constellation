import {
  PositionsSummaryDocument,
  PositionsSummaryQuery,
  execute,
} from "../../.graphclient";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { bigIntToFloat } from "@/lib/bigIntegers";
import { CryptoIcon } from "./cryptoIcon";
import { useMarket } from "@/context/marketContext";

export const TradesHistory = () => {
  const { address } = useAccount();
  const [data, setData] = useState(null);
  const { market } = useMarket();

  const calculatePnL = (currentPrice, entryPrice, collateral) => {
    return (1 - entryPrice / currentPrice) * (collateral / 1000000);
  };

  const calculatePnLSymbol = (entryPrice, currentPrice, isLong) => {
    return isLong
      ? 1 - entryPrice / currentPrice > 0
        ? "+"
        : "-"
      : 1 - entryPrice / currentPrice > 0
      ? "-"
      : "+";
  };

  useEffect(() => {
    execute(PositionsSummaryDocument, {
      traderAddress: address,
    }).then((result) => {
      
      if (!result.data) return;
      setData(result.data.positions);
    });
  }, [setData, address]);

  if (!data || data.length == 0) {
    return (
      <div>
        <p className="text-white">You did not close any positions yet.</p>
      </div>
    );
  } else {
    return (
      <>
        <div className="">
          {data && (
            <div className="text-white">
              <TableContainer>
                <Table size={"sm"} colorScheme="pink">
                  <Thead>
                    <Tr>
                      <Th>Time</Th>
                      <Th>Market</Th>
                      <Th isNumeric>Price</Th>
                      <Th isNumeric>Size</Th>
                      <Th isNumeric>Realized profit</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.map((item) => (
                      <Tr key={item.blockTimestamp + item.trader}>
                        <Td>
                          {new Date(
                            item.blockTimestamp * 1000
                          ).toLocaleString()}
                        </Td>
                        <Td>
                          <CryptoIcon size={"sm"} market={item.marketId} />
                        </Td>
                        <Td isNumeric>{item.currentPrice / 1000000}</Td>
                        <Td isNumeric>{bigIntToFloat(BigInt(item.size))}</Td>
                        <Td isNumeric className="">
                          {calculatePnLSymbol(
                            item.entryPrice,
                            item.currentPrice,
                            item.long
                          )}
                          $
                          {Math.abs(
                            calculatePnL(
                              item.currentPrice,
                              item.entryPrice,
                              item.collateral
                            )
                          ).toLocaleString("en", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
          )}
        </div>
      </>
    );
  }
};
