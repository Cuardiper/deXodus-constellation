import { usePrice } from "@/context/priceContext";
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
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { ClosePositionModal } from "./closePositionModal";
import { EditCollateralModal } from "./editCollateralModal";
import { Button } from "@chakra-ui/react";
import { useUserOpenedPositions } from "@/hooks/useUserOpenedPositions";
import { useEffect, useState } from "react";
import { useMarket } from "@/context/marketContext";
import { CryptoIcon } from "./cryptoIcon";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { EditIcon, StarIcon } from "@chakra-ui/icons";
import { TradesHistory } from "./tradesHistory";

export const ExchangeUserInfo = () => {
  const { market } = useMarket();
  const { getPriceByMarket } = usePrice();
  const price = getPriceByMarket(market);
  const {
    isOpen: isOpenClosePositionModal,
    onClose: onCloseClosePositionModal,
    onOpen: onOpenClosePositionModal,
  } = useDisclosure();
  const {
    isOpen: isOpenEditCollateralModal,
    onClose: onCloseEditCollateralModal,
    onOpen: onOpenEditCollateralModal,
  } = useDisclosure();
  const { position, isLoading: isLoadingPosition } =
    useUserOpenedPositions(market);
  const [myPosition, setMyPosition] = useState([]);

  useEffect(() => {
    if (!isLoadingPosition && position && position[1] != 0) {
      const OpenPositions = [
        {
          marketId: market,
          isLong: true,
          size: parseFloat(position[1]) / 1000000,
          collateral: parseFloat(position[2]) / 1000000,
          leverage: parseFloat(position[1]) / parseFloat(position[2]),
          entryPrice: parseFloat(position[3]) / 1000000,
          liqPrice: parseFloat(position[4]) / 1000000,
        },
      ];
      setMyPosition(OpenPositions);
    } else if (!isLoadingPosition) {
      setMyPosition([]);
    }
  }, [market, position, isLoadingPosition]);

  const calculateNetValue = (position) => {
    return position.collateral + calculatePnL(position);
  };

  const calculatePnL = (position) => {
    return (1 - position.entryPrice / price) * position.collateral;
  };

  const calculatePnLPercentage = (position) => {
    return (1 - position.entryPrice / price) * 100 * (position.isLong ? 1 : -1);
  };

  const calculatePnLSymbol = (position) => {
    return position.isLong
      ? 1 - position.entryPrice / price > 0
        ? "+"
        : "-"
      : 1 - position.entryPrice / price > 0
      ? "-"
      : "+";
  };

  return (
    <div className="p-2 bg-black/70 rounded-xl">
      <Tabs isFitted variant="solid-rounded" colorScheme="pink">
        <TabList className="flex space-x-1 rounded-full bg-gray-900">
          <Tab>Positions</Tab>
          <Tab>Trades</Tab>
        </TabList>
        <TabPanels className="mt-2">
          <TabPanel>
            <div className="w-full text-white">
              {myPosition.length == 0 ? (
                <div>
                  <p className="text-white">You have no open positions.</p>
                </div>
              ) : (
                <TableContainer>
                  <Table variant="simple" colorScheme="pink">
                    <Thead>
                      <Tr>
                        <Th>Position</Th>
                        <Th>Net Value</Th>
                        <Th isNumeric>Size</Th>
                        <Th isNumeric>Collateral</Th>
                        <Th isNumeric>Entry Price</Th>
                        <Th isNumeric>Mark Price</Th>
                        <Th isNumeric>Liq. Price</Th>
                        <Th></Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {myPosition.map((position, index) => (
                        <Tr key={index}>
                          <Td>
                            <div className="flex flex-col items-center">
                              <div className="flex items-center">
                                <CryptoIcon market={market} size="sm" />
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-400">
                                  {position.leverage?.toFixed(1)}x
                                </span>
                                <span
                                  className={`${
                                    position.isLong
                                      ? "text-green-500"
                                      : "text-red-500"
                                  } ml-1`}
                                >
                                  {position.isLong ? "Long" : "Short"}
                                </span>
                              </div>
                            </div>
                          </Td>
                          <Td>
                            <div className="flex flex-col items-center">
                              <div className="">
                                <span className="text-white">
                                  $
                                  {calculateNetValue(position).toLocaleString(
                                    "en",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span
                                  className={`${
                                    1 - position.entryPrice / price > 0
                                      ? position.isLong
                                        ? "text-green-500"
                                        : "text-red-500"
                                      : position.isLong
                                      ? "text-red-500"
                                      : "text-green-500"
                                  } ml-1`}
                                >
                                  {calculatePnLSymbol(position)}$
                                  {Math.abs(
                                    calculatePnL(position)
                                  ).toLocaleString("en", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}{" "}
                                  ({calculatePnLSymbol(position)}
                                  {Math.abs(
                                    calculatePnLPercentage(position)
                                  ).toLocaleString("en", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                  %)
                                </span>
                              </div>
                            </div>
                          </Td>
                          <Td isNumeric>${position.size}</Td>
                          <Td isNumeric>${position.collateral}</Td>
                          <Td isNumeric>
                            $
                            {Number(position.entryPrice).toLocaleString("en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Td>
                          <Td isNumeric>
                            $
                            {price
                              ? Number(price).toLocaleString("en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : "..."}
                          </Td>
                          <Td isNumeric>
                            $
                            {Number(position.liqPrice).toLocaleString("en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Td>
                          <Td>
                            <ClosePositionModal
                              isOpen={isOpenClosePositionModal}
                              onClose={onCloseClosePositionModal}
                              position={position}
                              marketPrice={price}
                            />
                            <Button
                              colorScheme="pink"
                              variant="link"
                              onClick={onOpenClosePositionModal}
                            >
                              Close
                            </Button>
                          </Td>
                          <Td isNumeric>
                            <Menu>
                              <MenuButton>&hellip;</MenuButton>
                              <MenuList bg="#202a36" border="0px">
                                <MenuItem
                                  icon={<EditIcon />}
                                  bg="#202a36"
                                  onClick={onOpenEditCollateralModal}
                                >
                                  <EditCollateralModal
                                    isOpen={isOpenEditCollateralModal}
                                    onClose={onCloseEditCollateralModal}
                                    position={position}
                                    marketPrice={price}
                                  />
                                  Edit collateral
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </TabPanel>
          <TabPanel>
            <span className="text-white">
              <TradesHistory />
            </span>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};
