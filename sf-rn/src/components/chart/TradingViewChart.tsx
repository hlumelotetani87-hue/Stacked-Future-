import { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type ForecastCandle = Candle & { predicted: true };

type Props = {
  candles: Candle[];
  forecast?: ForecastCandle[];
};

export default function TradingViewChart({ candles, forecast = [] }: Props) {
  const webRef = useRef<WebView>(null);

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #111520; overflow: hidden; }
  #chart { width: 100vw; height: 100vh; }
</style>
</head>
<body>
<div id="chart"></div>
<script src="https://unpkg.com/lightweight-charts@4.2.0/dist/lightweight-charts.standalone.production.js"></script>
<script>
  const chart = LightweightCharts.createChart(document.getElementById('chart'), {
    width: window.innerWidth,
    height: window.innerHeight,
    layout: {
      background: { color: '#111520' },
      textColor: '#555',
    },
    grid: {
      vertLines: { color: '#1a1d2a' },
      horzLines: { color: '#1a1d2a' },
    },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
    rightPriceScale: { borderColor: '#1e2130' },
    timeScale: {
      borderColor: '#1e2130',
      timeVisible: true,
      secondsVisible: false,
    },
  });

  // Historical candles
  const candleSeries = chart.addCandlestickSeries({
    upColor: '#4ade80',
    downColor: '#f87171',
    borderUpColor: '#4ade80',
    borderDownColor: '#f87171',
    wickUpColor: '#4ade80',
    wickDownColor: '#f87171',
  });
  candleSeries.setData(${JSON.stringify(candles)});

  // Forecast candles (faded purple)
  const forecastSeries = chart.addCandlestickSeries({
    upColor: 'rgba(129, 140, 248, 0.5)',
    downColor: 'rgba(129, 140, 248, 0.4)',
    borderUpColor: 'rgba(129, 140, 248, 0.5)',
    borderDownColor: 'rgba(129, 140, 248, 0.4)',
    wickUpColor: 'rgba(129, 140, 248, 0.5)',
    wickDownColor: 'rgba(129, 140, 248, 0.4)',
  });
  if (${forecast.length} > 0) {
    forecastSeries.setData(${JSON.stringify(forecast)});
  }

  chart.timeScale().fitContent();
  window.addEventListener('resize', () => {
    chart.applyOptions({ width: window.innerWidth, height: window.innerHeight });
  });
</script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        originWhitelist={["*"]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, borderRadius: 14, overflow: "hidden", backgroundColor: "#111520" },
  webview: { flex: 1, backgroundColor: "transparent" },
});
