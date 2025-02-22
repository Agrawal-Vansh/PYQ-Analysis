import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// Register required components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Graph = () => {
  // Sample Data
  const dataValues = [12, 19, 7, 15, 10, 22];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const backgroundColors = [
    "rgba(255, 99, 132, 0.8)", 
    "rgba(54, 162, 235, 0.8)", 
    "rgba(255, 206, 86, 0.8)", 
    "rgba(75, 192, 192, 0.8)", 
    "rgba(153, 102, 255, 0.8)", 
    "rgba(255, 159, 64, 0.8)"
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Monthly Sales",
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: "rgba(255, 255, 255, 0.2)", // Light border for dark theme
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend box and label
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#ffffff", // White labels for dark theme
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Subtle white grid lines
        },
      },
      x: {
        ticks: {
          color: "#ffffff", // White labels for dark theme
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Subtle white grid lines
        },
      },
    },
  };

  return (
    <div className="bg-[#2A2A3A] p-6 my-6 w-full max-w-lg shadow-lg rounded-lg border border-[#3B3B4F]">
      <h2 className="text-xl font-bold text-center text-gray-200 mb-4">📊 Sales Data</h2>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Graph;
