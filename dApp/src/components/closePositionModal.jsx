import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Center,
  Switch,
  useRadioGroup,
  HStack,
  FormLabel,
} from "@chakra-ui/react";
import { ClosePositionButton } from "./tradingComponents/closePositionButton";
import { useState, useEffect } from "react";
import { RadioCard } from "./radioCards";
import { ClosePositionButtonV2 } from "./tradingComponents/closePositionButtonV2";
import { useNetwork } from "wagmi";

export const ClosePositionModal = ({
  isOpen,
  onClose,
  position,
  marketPrice,
}) => {
  const [sizeToClose, setSizeToClose] = useState(0);
  const options = ["25", "50", "75", "100"];
  const { value, setValue, getRootProps, getRadioProps } = useRadioGroup({
    name: "sizePercent",
    defaultValue: "",
    onChange: (value) => setSizeToClose((position.size * value) / 100),
  });
  const group = getRootProps();
  const { chain } = useNetwork();

  useEffect(() => {
    setSizeToClose(0);
  }, [isOpen]);

  useEffect(() => {
    if (sizeToClose > position.size) {
      setSizeToClose(position.size);
    }
  }, [sizeToClose, position.size]);

  // Check radio button value when user types in input
  useEffect(() => {
    const percent = ((sizeToClose / position.size) * 100).toFixed(0);
    if (percent != value) {
      setValue(percent);
    }
  }, [value, sizeToClose, position.size, setValue]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        colorScheme="pink"
        size="sm"
        isCentered
      >
        <ModalOverlay />
        <ModalContent className="bg-[#0d1116]">
          <ModalHeader className="text-white bg-[#0d1116]">
            Close position ({position.marketId == 1 ? "BTC" : "ETH"})
          </ModalHeader>
          <ModalCloseButton className="text-gray-400" />
          <ModalBody className="text-white bg-[#0d1116]">
            <div className="mt-4 p-4 w-full bg-gray-900 border-gray-600 rounded-lg">
              <div className="flex items-center justify-between text-sm font-medium text-gray-400">
                <div>
                  <span className="">Close: </span>
                  <span className="text-white">
                    ${parseFloat(sizeToClose).toFixed(2)}
                  </span>
                </div>
                <div
                  onClick={() => setSizeToClose(position.size.toFixed(2))}
                  className="cursor-pointer"
                >
                  <span className="">Max: </span>
                  <span className="text-white">{position.size.toFixed(2)}</span>
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
            <div className="flex items-center justify-between mt-4">
              <FormLabel htmlFor="mantainLeverage">
                Keep leverage at {position.leverage}x:
              </FormLabel>
              <Switch
                colorScheme="pink"
                id="mantainLeverage"
                isChecked
                isReadOnly
              />
            </div>
          </ModalBody>
          <ModalFooter className="bg-[#0d1116]">
            <Center className="w-full">
              {chain.id == "421614" ? (
                <ClosePositionButtonV2
                  marketId={position.marketId}
                  sizeToClose={sizeToClose}
                  totalSize={position.size}
                  onSuccess={() => onClose()}
                />
              ) : (
                <ClosePositionButton
                  marketId={position.marketId}
                  sizeToClose={sizeToClose}
                  totalSize={position.size}
                  marketPrice={marketPrice}
                  onSuccess={() => onClose()}
                />
              )}
            </Center>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
