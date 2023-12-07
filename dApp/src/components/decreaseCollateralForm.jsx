import { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Center,
  useRadioGroup,
  HStack,
} from "@chakra-ui/react";
import { RadioCard } from "./radioCards";
import { DecreaseCollateralButton } from "./tradingComponents/DecreaseCollateralButton";
import { useNetwork } from "wagmi";
import { DecreaseCollateralButtonV2 } from "./tradingComponents/DecreaseCollateralButtonV2";

export const DecreaseCollateralForm = ({ position, marketPrice, closeModal }) => {
  const [sizeToClose, setSizeToClose] = useState(0);
  const options = ["25", "50", "75", "100"];
  const { value, setValue, getRootProps, getRadioProps } = useRadioGroup({
    name: "sizePercent",
    defaultValue: "",
    onChange: (value) => setSizeToClose((position.collateral * value) / 100),
  });
  const group = getRootProps();
  const { chain } = useNetwork();

  useEffect(() => {
    if (sizeToClose > position.collateral) {
      setSizeToClose(position.collateral);
    }
  }, [sizeToClose, position.collateral]);

  // Check radio button value when user types in input
  useEffect(() => {
    const percent = ((sizeToClose / position.collateral) * 100).toFixed(0);
    if (percent != value) {
      setValue(percent);
    }
  }, [value, sizeToClose, position.collateral, setValue]);

  useEffect(() => {
    setSizeToClose(0);
  }, []);

  return (
    <>
      <div className="mt-4 p-4 w-full bg-gray-900 border-gray-600 rounded-lg">
        <div className="flex items-center justify-between text-sm font-medium text-gray-400">
          <div>
            <span className="">Reduce: </span>
            <span className="text-white">
              ${parseFloat(sizeToClose).toFixed(2)}
            </span>
          </div>
          <div
            onClick={() => setSizeToClose(position.collateral.toFixed(2))}
            className="cursor-pointer"
          >
            <span className="">Max: </span>
            <span className="text-white">{position.collateral.toFixed(2)}</span>
          </div>
        </div>
        <div className="w-full mt-3 flex items-center justify-between">
          <Popover trigger="hover" closeOnBlur="true">
            <PopoverTrigger>
              <input
                value={sizeToClose}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                autoCorrect="off"
                minLength={1}
                maxLength={15}
                spellCheck="false"
                id="close-input"
                className="bg-transparent sm:text-lg text-white"
                placeholder="0.00"
                onChange={(e) => {
                  setSizeToClose(e.target.value);
                }}
              />
            </PopoverTrigger>
            <PopoverContent border="0px" bg="#202a36">
              <PopoverArrow bg="#202a36" />
              <PopoverCloseButton />
              <PopoverBody>
                <HStack {...group}>
                  {options.map((value) => {
                    const radio = getRadioProps({ value });
                    return (
                      <RadioCard key={value} {...radio}>
                        {value}
                      </RadioCard>
                    );
                  })}
                </HStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          USD
        </div>
      </div>
      <Center className="mt-6 mb-4 w-full">
        {chain.id == "421614" ? (
          <DecreaseCollateralButtonV2
            marketId={position.marketId}
            sizeToClose={sizeToClose}
            totalSize={position.collateral}
            onSuccess={() => closeModal()}
          />
        ) : (
          <DecreaseCollateralButton
            marketId={position.marketId}
            sizeToClose={sizeToClose}
            totalSize={position.collateral}
            marketPrice={marketPrice}
            onSuccess={() => closeModal()}
          />
        )}
      </Center>
    </>
  );
};
