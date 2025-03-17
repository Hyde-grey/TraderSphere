import { ColumnDef } from "@tanstack/react-table";
import {
  priceFormatter,
  priceChangeFormatter,
  volumeFormatter,
} from "./marketSummaryUtility";

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
    cell: ({ row }) => priceFormatter(row.original.lastPrice),
  },

  {
    header: "24h Change",
    accessorKey: "priceChangePercent",
    filterFn: "inNumberRange",
    cell: ({ row }) => priceChangeFormatter(row.original.priceChangePercent),
  },
  {
    header: "Volume",
    accessorKey: "volume",
    filterFn: "includesString",
    cell: ({ row }) => volumeFormatter(row.original.volume),
  },
];
