import { LeverageSlider } from "@/components/leverageSlider";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useBalance, useAccount, useNetwork } from "wagmi";
import { useEffect, useState, useRef } from "react";
import { OpenPositionButton } from "./tradingComponents/openPositionButton";
import { usePrice } from "@/context/priceContext";
import { TriangleDownIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { useMarket } from "@/context/marketContext";
import { CryptoIcon } from "./cryptoIcon";
import { NftArenaSelector } from "./nftArenaSelector";
import { useDeployment } from "@/context/deploymentContext";
import { OpenPositionPaymasterButton } from "./openPositionPaymasterButton";
import { OpenPositionButtonV2 } from "./tradingComponents/openPositionButtonV2";

export const Trading = ({ type = "long" }) => {
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const [collateralValue, setCollateralValue] = useState(0.0); // [USDC]
  const [cryptoValue, setCryptoValue] = useState(0); // [BTC]
  const [leverageValue, setLeverageValue] = useState(1.1);
  const { market, setMarketData } = useMarket();
  const { deployment } = useDeployment();
  const { chain } = useNetwork();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const { getPriceByMarket } = usePrice();
  const price = getPriceByMarket(market);

  useEffect(() => {
    const value = (collateralValue * leverageValue) / price;
    setCryptoValue(isNaN(value) || !isFinite(value) || value === 0 ? 0 : value);
  }, [collateralValue, leverageValue, price]);

  const { data, balanceIsLoading } = useBalance({
    address: address,
    token: deployment.usdc,
    watch: true,
  });

  const changeCollateral = (value) => {
    if (isNaN(value) || !isFinite(value)) {
      setCollateralValue(0);
      return;
    }
    setCollateralValue(value);
  };

  return (
    <>
      <span className="text-white">Market price</span>
      <div className="px-1 py-3 mb-4">
        <div className="p-4 w-full bg-gray-900 border-gray-600 rounded-lg">
          <div className="flex items-center justify-between text-sm font-medium text-gray-400">
            <div>
              <span className="">Pay: </span>
              <span className="text-white">${collateralValue?.toFixed(2)}</span>
            </div>
            <span className="">
              Balance:{" "}
              <span
                className="text-white cursor-pointer"
                onClick={() => setCollateralValue(parseFloat(data?.formatted))}
              >
                {" "}
                {isMounted && !balanceIsLoading && data
                  ? parseFloat(data.formatted).toFixed(4)
                  : "..."}
              </span>
            </span>
          </div>
          <div className="w-full mt-3 flex items-center justify-between">
            <input
              value={collateralValue}
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
                changeCollateral(parseFloat(e.target.value));
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
        <div className="mt-4 p-4 w-full bg-gray-900 border-gray-600 rounded-lg">
          <div className="flex items-center justify-between text-sm font-medium text-gray-400">
            <div>
              <span className="">Long: </span>
              <span className="text-white">
                ${parseFloat(leverageValue * collateralValue).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="">Leverage: </span>
              <span className="text-white">{leverageValue.toFixed(1)}x</span>
            </div>
          </div>
          <div
            className="w-full mt-3 flex items-center justify-between hover:cursor-pointer"
            ref={btnRef}
            onClick={onOpen}
          >
            <input
              value={cryptoValue != 0 ? parseFloat(cryptoValue).toFixed(8) : 0}
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
                setCryptoValue(e.target.value);
              }}
              disabled
            />
            <CryptoIcon market={market} />
            <TriangleDownIcon color="whiteAlpha.400" />
          </div>
        </div>
        <div className="mt-6">
          <span className="text-gray-400">Leverage slider</span>
          <div className="-mt-2 px-2">
            <LeverageSlider
              sliderValue={leverageValue}
              setSliderValue={setLeverageValue}
            />
          </div>
        </div>
        <div className="mt-12">
          <NftArenaSelector />
        </div>
        <div className="w-fit mx-auto mt-14">
          {isMounted &&
            (isConnected ? (
              chain.id == "421614" ? (
                <OpenPositionButtonV2
                  collateral={collateralValue}
                  leverage={leverageValue}
                  type={type}
                />
              ) : (
                <OpenPositionPaymasterButton
                  collateral={collateralValue}
                  leverage={leverageValue}
                  type={type}
                />
              )
            ) : (
              <ConnectButton />
            ))}
        </div>
      </div>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton className="text-gray-400" />
          <DrawerHeader className="bg-gray-900 text-white">
            Select asset
          </DrawerHeader>
          <DrawerBody className="bg-gray-900">
            <Button
              variant="outline"
              colorScheme="whiteAlpha"
              className="w-full mb-2 cursor-not-allowed"
              onClick={() => {
                //setMarketData(1);
                //onClose();
              }}
            >
              <Image
                src="/images/crypto_logos/bitcoin-btc-logo-40.png"
                width={40}
                height={40}
                style={{ width: "22px", height: "22px" }}
                alt="BTC logo"
              />
              <span className="ml-1 font-semibold text-lg">BTC</span>
            </Button>
            <Button
              variant="outline"
              colorScheme="whiteAlpha"
              className="w-full mb-2"
              onClick={() => {
                setMarketData(2);
                onClose();
              }}
            >
              <Image
                src="/images/crypto_logos/ethereum-eth-logo-40.png"
                width={40}
                height={40}
                style={{ width: "22px", height: "22px" }}
                alt="ETH logo"
              />
              <span className="ml-1 font-semibold text-lg">ETH</span>
            </Button>
          </DrawerBody>
          <DrawerFooter className="bg-gray-900">
            <Button
              colorScheme="pink"
              variant="outline"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
