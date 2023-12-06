import { useState, useEffect } from "react";
import BasicGrid from "@/components/layout/basicGrid";
import { useAccount } from "wagmi";
import axios from "axios";
import { useContractRead } from "wagmi";
import { useDeployment } from "@/context/deploymentContext";
import { guardiansABI } from "../../smartContracts/guardians";

export const NFTCollectionV2 = ({ onItemClick, selectedItems = [] }) => {
  const { address } = useAccount();
  const { deployment } = useDeployment();
  const [nftsData, setNftsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    data,
    isError,
    isLoading: guardiansIsLoading,
  } = useContractRead({
    address: deployment.guardians,
    abi: guardiansABI,
    functionName: "holdingsOf",
    args: [address],
    watch: true,
  });

  useEffect(() => {
    const fetchNFTsData = async (data) => {
      data = data.filter((nftID) => nftID < 199);
      
      let nftsData = [];
      data.forEach(async (nftID) => {
        nftID = nftID;
        const url = `https://ipfs.io/ipfs/bafybeie4rqfkmtugo76im235g2qvur2vmj5mszsbfi3t6yddbmvj5d6chi/${nftID}.json`;
        const response = await axios.get(url);
        //Get string after ipfs:// (explode)
        const image = response.data.image;
        const nft = {
          id: nftID,
          image: image,
        };
        //Add to the nftData array
        nftsData.push(nft);
      });
      setNftsData(nftsData);
      setIsLoading(false);
    };
    setIsLoading(true);
    if (data) {
      fetchNFTsData(data);
    } else {
      setIsLoading(false);
    }
  }, [data, address]);

  return nftsData.length > 0 ? (
    <BasicGrid
      width="1000"
      height="1000"
      data={nftsData}
      isLoading={isLoading}
      onItemClick={onItemClick}
      selectedItems={selectedItems}
    />
  ) : (
    <div className="flex flex-col items-center w-full h-full border border-gray-800 mt-4 bg-[#0d1116] p-4 rounded-lg">
      <p className="text-xl font-bold text-white">No NFTs Found</p>
      <p className="text-lg text-white">You don&apos;t have any guardians. yet</p>
    </div>
  );
};
