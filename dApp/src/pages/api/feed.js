import { getUnixTime } from "date-fns";
import { formatUnits } from "viem";
import { api } from "@/lib/chainlink-sdk";

//return all sports
const get = async (req, res) => {
  const { feedId } = req.query;
  const timestamp = getUnixTime(new Date());
  try {
    const report = await api.fetchFeed({
      timestamp,
      feed: feedId,
    });
    return res.status(200).json({
      feedId,
      timestamp: Number(report.observationsTimestamp),
      price: formatUnits(report.benchmarkPrice, 8),
    });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

const handler = (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      get(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
