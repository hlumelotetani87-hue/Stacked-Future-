import { useState, useCallback } from "react";
import type { Timeframe } from "@/store/trading-store";

const BASE = "https://api.twelvedata.com";
const KEY = process.env.EXPO_PUBLIC_TWELVE_DATA_KEY;

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export function useTwelveData() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandles = useCallback(async (symbol: string, interval: Timeframe, outputsize = 120) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${BASE}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === "error") throw new Error(data.message);

      const formatted: Candle[] = data.values
        .map((v: any) => ({
          time: Math.floor(new Date(v.datetime).getTime() / 1000),
          open: parseFloat(v.open),
          high: parseFloat(v.high),
          low: parseFloat(v.low),
          close: parseFloat(v.close),
        }))
        .reverse();

      setCandles(formatted);
      if (formatted.length > 0) {
        const last = formatted[formatted.length - 1];
        const first = formatted[0];
        setPrice(last.close);
        setChange(((last.close - first.close) / first.close) * 100);
      }
    } catch (e: any) {
      setError(e.message ?? "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { candles, price, change, isLoading, error, fetchCandles };
}
