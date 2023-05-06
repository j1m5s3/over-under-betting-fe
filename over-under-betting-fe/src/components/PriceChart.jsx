import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { map_chart_record_data } from '../utils/chart_utils/chart_utils';
import { get_hourly_asset_price_data } from '../utils/api_calls/over_under_api_calls';

const PriceChart = ({ data, assetSymbol }) => {
  const chart_data = map_chart_record_data(data)

  const [error, setError] = useState(false);
  const chartInstance = useRef(null);
  const chartRef = useRef(null);
  const [price, setPrice] = useState(chart_data.price);
  const [time, setTime] = useState(chart_data.time);
  const [lastPrice, setLastPrice] = useState(chart_data.price[chart_data.price.length - 1]);

  async function getChart() {
    const hourly_data = await get_hourly_asset_price_data(assetSymbol, 24);
    const mapped_chart_data = map_chart_record_data(hourly_data);
    console.log("lastPrice: " + lastPrice);
    console.log("mapped_chart_data.price[mapped_chart_data.price.length - 1]: " + mapped_chart_data.price[mapped_chart_data.price.length - 1]);
    if (mapped_chart_data.price[mapped_chart_data.price.length - 1] !== lastPrice) {
      setPrice(prevPrice => [...prevPrice.slice(1), mapped_chart_data.price[mapped_chart_data.price.length - 1]]);
      setTime(prevTime => [...prevTime.slice(1), mapped_chart_data.time[mapped_chart_data.time.length - 1]]);
      setLastPrice(mapped_chart_data.price[mapped_chart_data.price.length - 1]);
    }
  }

  try {
    const price_chart_title = assetSymbol + " 24HR PRICE USD";
    let line_color = "rgba(255, 255, 255, 1)";

    if (assetSymbol == "BTC") {
      line_color = "rgba(255, 165, 0, 1)";
    }
    else {
      line_color = "rgba(0, 128, 0, 1)";
    }

    useEffect(() => {
      try {
        const updateChart = setInterval(() => {
          getChart();
        }, 35000);
        return () => clearInterval(updateChart);
      }
      catch (err) {
        console.log("error: " + err);
        setError(true);
      }
    }, []);

    useEffect(() => {
      try {
        if (chartInstance.current === null) {
          console.log("chartInstance.current === null");
          // Create chart instance
          const ctx = chartRef.current.getContext("2d");
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
        } else {
          // Update chart data
          chartInstance.current.data.labels = time;
          chartInstance.current.data.datasets[0].data = price;
          chartInstance.current.update();
        }
      }
      catch (err) {
        console.log("error: " + err);
        setError(true);
      }
    }, [price, time]);
  }
  catch (err) {
    console.log("error: " + err);
    setError(true);
  }
  
  if (error) {
    return (
      <div className="error">
        <h3>Something went wrong. Please try again.</h3>
      </div>
    );
  }

  return (
    <canvas ref={chartRef} width="550px" height="350px" />
  );
};

export default PriceChart;
