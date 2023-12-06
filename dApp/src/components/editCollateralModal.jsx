import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { IncreaseCollateralForm } from "./increaseCollateralForm";
import { DecreaseCollateralForm } from "./decreaseCollateralForm";

export const EditCollateralModal = ({ isOpen, onClose, position, marketPrice }) => {
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
            Edit position ({position.marketId == 1 ? "BTC" : "ETH"})
          </ModalHeader>
          <ModalCloseButton className="text-gray-400" />
          <ModalBody className="text-white bg-[#0d1116]">
            <Tabs isFitted variant="line" colorScheme="pink">
              <TabList>
                <Tab>Increase collateral</Tab>
                <Tab>Decrease collateral</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <IncreaseCollateralForm
                    position={position}
                    marketPrice={marketPrice}
                    closeModal={onClose}
                  />
                </TabPanel>
                <TabPanel>
                  <DecreaseCollateralForm
                    position={position}
                    marketPrice={marketPrice}
                    closeModal={onClose}
                  />{" "}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
