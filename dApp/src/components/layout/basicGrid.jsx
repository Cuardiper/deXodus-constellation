import { ContentCover } from "@/components/contentCover";
import { Spinner } from "@chakra-ui/react";

export default function BasicGrid({
  data,
  isLoading = true,
  itemsPerPage = 16,
  page = 1,
  setPage,
  unoptimized = false,
  width = "500",
  height = "500",
  columns = 6,
  onItemClick,
  selectedItems = [],
}) {
  return (
    <div
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(min(100%/2, max(200px, 100%/${columns})), 1fr))`,
      }}
      className="grid gap-4 py-8 lg:py-10 h-full"
    >
      {isLoading ? (
        <Spinner size="xl" />
      ) : (
        data.slice(0, page * itemsPerPage).map((item, index) => (
          <div
            className={`h-fit shadow-md shadow-cyan-700/30 rounded-md ${
              selectedItems.includes(item.id)
                ? "inline-block from-teal-500 via-yellow-500 to-teal-500 bg-[length:_400%_400%] p-0.5 bg-gradient-to-r"
                : "border border-zinc-900"
            }`}
            key={item.id}
            onClick={() => {
              onItemClick(item);
            }}
          >
            <ContentCover
              key={item.id}
              id={item.id}
              image={item.image || "/images/dexLogo_fit.png"}
              isLast={index === page * itemsPerPage - 1}
              newLimit={() => setPage(page + 1)}
              width={width}
              height={height}
              unoptimized={unoptimized}
            />
          </div>
        ))
      )}
    </div>
  );
}
