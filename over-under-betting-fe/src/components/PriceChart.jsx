import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { map_chart_record_data } from '../utils/chart_utils/chart_utils';
import { get_hourly_asset_price_data } from '../utils/api_calls/over_under_api_calls';

const PriceChart = ({ data, assetSymbol }) => {
  const chart_data = map_chart_record_data(data);
  const price_chart_title = assetSymbol + " 24HR PRICE USD";
  let line_color = "rgba(255, 255, 255, 1)";

  if (assetSymbol == "BTC") {
    line_color = "rgba(255, 165, 0, 1)";
  }
  else {
    line_color = "rgba(0, 128, 0, 1)";
  }

  const [price, setPrice] = useState(chart_data.price);
  const [time, setTime] = useState(chart_data.time);

  const chartAssetSymbol = assetSymbol;
  const chartInstance = useRef(null);
  const chartRef = useRef(null);

  async function getChart() {
    const hourly_data = await get_hourly_asset_price_data(chartAssetSymbol, 24);
    const mapped_chart_data = map_chart_record_data(hourly_data);
    setPrice(mapped_chart_data.price);
    setTime(mapped_chart_data.time);
  }

  useEffect(() => {
    const updateChart = setInterval(() => {
      getChart()
    }, 35000);
    return () => clearInterval(updateChart);
  }, [price, time]);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart instance
    if (chartInstance.current !== null) {
      chartInstance.current.destroy();
    }

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: time,
        datasets: [{
          label: price_chart_title,
          data: price,
          fill: false,
          pointStyle: 'circle',
          borderColor: line_color,
          pointBackgroundColor: "rgba(255,255,0,1)",
          tension: 0.1,
          pointRadius: price.length - 1 === 0 ? 5 : Array(price.length - 1).fill(5).concat([10]),
          pointBorderColor: price.length - 1 === 0 ? "rgba(75,192,192,1)" : Array(price.length - 1).fill("rgba(75,192,192,1)").concat(["#ff0000"]),
          pointBorderWidth: 2
        }]
      },
      options: {
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear',
            from: 0.5,
            to: 0,
            loop: true
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'black',  
              boxHeight: 0,
            }
          }
        }
      }
    });

    chartInstance.current = chart;

    return () => chart.destroy();
  }, [price, time]);

  return (
    <canvas ref={chartRef} width={750} height={350} />
  );
};

export default PriceChart;
