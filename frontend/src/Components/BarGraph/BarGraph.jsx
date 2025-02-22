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
    "rgba(255, 99, 132, 0.6)", 
    "rgba(54, 162, 235, 0.6)", 
    "rgba(255, 206, 86, 0.6)", 
    "rgba(75, 192, 192, 0.6)", 
    "rgba(153, 102, 255, 0.6)", 
    "rgba(255, 159, 64, 0.6)"
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Monthly Sales",
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: "rgba(0, 0, 0, 0.1)",
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
      },
    },
  };

  return (
    <div className="bg-white p-6 my-6 w-full max-w-lg shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-center mb-4">Sales Data</h2>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Graph;
