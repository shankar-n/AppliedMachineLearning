import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom"; // ✅ Import Zoom Plugin

Chart.register(zoomPlugin); // ✅ Register Plugin

interface Props {
  labels: string[];
  values: number[];
}

const PieChart: React.FC<Props> = ({ labels, values }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }

      // ✅ Generate vibrant but slightly darker shades
      const vibrantColors = [
        "#D92B2B", // Dark red
        "#D97F2B", // Deep orange
        "#D9C12B", // Golden yellow
        "#72D92B", // Strong green
        "#2BAAD9", // Bold blue
      ];

      // ✅ Assign colors dynamically
      const pieColors = labels.map(
        (_, index) => vibrantColors[index % vibrantColors.length]
      );

      // ✅ Calculate total sum
      const total = values.reduce((acc, val) => acc + val, 0);

      const displayLabels = [...labels];
      const displayValues = [...values];

      // ✅ Add "Other" if sum < 1
      if (total < 1) {
        displayLabels.push("Other");
        displayValues.push(1 - total);
        pieColors.push("#666666"); // Dark grey for "Other"
      }

      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "pie",
        data: {
          labels: displayLabels,
          datasets: [
            {
              data: displayValues,
              backgroundColor: pieColors,
              borderColor: "#ffffff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            zoom: {
              zoom: {
                wheel: { enabled: true }, // ✅ Scroll to zoom
                pinch: { enabled: true }, // ✅ Pinch to zoom (mobile)
                mode: "xy", // ✅ Zoom in both axes
              },
              pan: {
                enabled: true, // ✅ Allow panning
                mode: "xy", // ✅ Pan in both axes
              },
            },
            legend: {
              labels: {
                font: { size: 12, weight: "bold", family: "Arial, sans-serif" },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [labels, values]);

  return <canvas ref={chartRef}></canvas>;
};

export default PieChart;
