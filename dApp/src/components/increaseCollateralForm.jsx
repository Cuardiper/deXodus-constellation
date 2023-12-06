import { IncreaseCollateralButton } from "./tradingComponents/IncreaseCollateralButton";
import { useState, useEffect } from "react";
import { Center } from "@chakra-ui/react";
import { useNetwork } from "wagmi";
import { IncreaseCollateralButtonV2 } from "./tradingComponents/IncreaseCollateralButtonV2";

export const IncreaseCollateralForm = ({ position, marketPrice, closeModal }) => {
  const [newCollateral, setNewCollateral] = useState(0);
  const { chain } = useNetwork();

  useEffect(() => {
    setNewCollateral(0);
  }, []);

  return (
    <>
      <div className="mt-4 p-4 w-full bg-gray-900 border-gray-600 rounded-lg">
        <div className="flex items-center justify-between text-sm font-medium text-gray-400">
          <div>
            <span className="">Add: </span>
            <span className="text-white">
              ${parseFloat(newCollateral).toFixed(2)}
            </span>
          </div>
          <div
            onClick={() => setNewCollateral(position.size.toFixed(2))}
            className="cursor-pointer"
          >
            <span className="">Max: </span>
            <span className="text-white">{position.size.toFixed(2)}</span>
          </div>
        </div>
        <div className="w-full mt-3 flex items-center justify-between">
          <input
            value={newCollateral}
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
              setNewCollateral(e.target.value);
            }}
          />
          USD
        </div>
      </div>
      <Center className="mt-6 mb-4 w-full">
        {chain.id == "421614" ? (
          <IncreaseCollateralButtonV2
            marketId={position.marketId}
            newCollateral={newCollateral}
            totalSize={position.size}
            marketPrice={marketPrice}
            onSuccess={() => closeModal()}
          />
        ) : (
          <IncreaseCollateralButton
            marketId={position.marketId}
            newCollateral={newCollateral}
            totalSize={position.size}
            marketPrice={marketPrice}
            onSuccess={() => closeModal()}
          />
        )}
      </Center>
    </>
  );
};
