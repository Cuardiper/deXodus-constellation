import Image from "next/image";
import {
  Center,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { NFTCollectionV2 } from "./nftCollectionV2";
import { InfoIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";

export const NftArenaSelector = () => {
  const [selectedNft, setSelectedNft] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleNftClick = (nft) => {
    setSelectedNft(nft);
    onClose();
  };

  return (
    <>
      <div className="mt-3 pr-2 flex items-center justify-between">
        <div className="text-white flex flex-col">
          <div className="flex items-center gap-1">
            <p className="text-gray-200 font-bold">NFT ARENA</p>
            <Tooltip
              label="Whenever you close a trade with a profit, your companions gain experience points, allowing them to ascend to higher levels. This dynamic feature transforms your NFTs into a visual representation of your trading prowess."
              aria-label="A tooltip"
            >
              <InfoIcon
                color={"blue.500"}
                className="cursor-pointer ml-1 text-sm"
              />
            </Tooltip>
          </div>
          <p className="text-sm text-gray-400">Select your companion</p>
        </div>
        <div
          className="p-0.5 opacity-90 hover:opacity-100 cursor-pointer"
          style={{
            background: "rgba(12, 184, 152, 0.3)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            backdropFilter: "blur(3.5px)",
            WebkitBackdropFilter: "blur(3.5px)",
            borderRadius: "10px",
          }}
        >
          <Center>
            <Image
              onClick={onOpen}
              src={selectedNft?.image || "/images/dexLogo_fit.png"}
              width={42}
              height={42}
              alt="logo"
              className={`${selectedNft ? "opacity-100" : "opacity-50"}`}
            />
          </Center>
        </div>
      </div>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size={"lg"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton className="text-white" />
          <DrawerHeader className="bg-gray-900 text-white">
            <h2 className="bg-gradient-to-bl from-teal-700 via-emerald-500 to-blue-600 bg-clip-text text-transparent font-bold text-3xl">
              NFT ARENA
            </h2>
          </DrawerHeader>
          <DrawerBody className="bg-gray-900 text-white">
            <p className="text-gray-200 mt-2 font-semibold">
              Select the guardian that will participate in the trade
            </p>
            <NFTCollectionV2
              onItemClick={handleNftClick}
              selectedItems={[selectedNft?.id]}
            />
          </DrawerBody>
          <DrawerFooter className="bg-gray-900 text-white"></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
