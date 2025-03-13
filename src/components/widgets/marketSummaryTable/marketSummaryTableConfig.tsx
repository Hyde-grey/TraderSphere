import { ColumnDef } from "@tanstack/react-table";
import styles from "../widgets.module.css";

export type MarketData = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
};

export const columns: ColumnDef<MarketData>[] = [
  {
    header: "Symbols",
    accessorKey: "symbol",
    cell: ({ row }) => <span>{row.original.symbol}</span>,
    filterFn: "includesString",
  },
  {
    header: "Price",
    accessorKey: "lastPrice",
    filterFn: "includesString",
    cell: ({ row }) => (
      <span>
        $
        {parseFloat(row.original.lastPrice).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    header: "24h Change",
    accessorKey: "priceChangePercent",
    filterFn: "inNumberRange",
    cell: ({ row }) => {
      const value = parseFloat(row.original.priceChangePercent);
      const isPositive = value >= 0;
      return (
        <span className={isPositive ? styles.positive : styles.negative}>
          {value > 0 ? "+" : ""}
          {value.toFixed(2)}%
        </span>
      );
    },
  },
  {
    header: "Volume",
    accessorKey: "volume",
    filterFn: "includesString",
    cell: ({ row }) => {
      const volume = parseFloat(row.original.volume);
      return <span>{volume.toLocaleString("en-US")}</span>;
    },
  },
];
