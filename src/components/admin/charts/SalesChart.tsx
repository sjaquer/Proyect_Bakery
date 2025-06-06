import React from 'react';
import { useStore } from '../../../store/useStore'; // Corregida la importación
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SalesData } from '../../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  salesData: SalesData;
  period: 'daily' | 'weekly' | 'monthly';
}

const SalesChart: React.FC<SalesChartProps> = ({ salesData, period }) => {
  let data;
  let options: ChartOptions<'line'>;
  
  switch (period) {
    case 'daily':
      data = {
        labels: salesData.daily.map((item) => item.date),
        datasets: [
          {
            label: 'Ventas (S/)',
            data: salesData.daily.map((item) => item.sales),
            borderColor: '#8B4513',
            backgroundColor: 'rgba(139, 69, 19, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Pedidos',
            data: salesData.daily.map((item) => item.orders),
            borderColor: '#FFD700',
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            tension: 0.4,
          },
        ],
      };
      options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Ventas diarias (últimos 30 días)',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Ventas (S/)',
            },
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: 'Pedidos',
            },
          },
        },
      };
      break;
      
    case 'weekly':
      data = {
        labels: salesData.weekly.map((item) => item.week),
        datasets: [
          {
            label: 'Ventas (S/)',
            data: salesData.weekly.map((item) => item.sales),
            borderColor: '#8B4513',
            backgroundColor: 'rgba(139, 69, 19, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Pedidos',
            data: salesData.weekly.map((item) => item.orders),
            borderColor: '#FFD700',
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            tension: 0.4,
          },
        ],
      };
      options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Ventas semanales (últimas 12 semanas)',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Ventas (S/)',
            },
          },
        },
      };
      break;
      
    case 'monthly':
      data = {
        labels: salesData.monthly.map((item) => item.month),
        datasets: [
          {
            label: 'Ventas (S/)',
            data: salesData.monthly.map((item) => item.sales),
            borderColor: '#8B4513',
            backgroundColor: 'rgba(139, 69, 19, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Pedidos',
            data: salesData.monthly.map((item) => item.orders),
            borderColor: '#FFD700',
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            tension: 0.4,
          },
        ],
      };
      options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Ventas mensuales (últimos 6 meses)',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Ventas (S/)',
            },
          },
        },
      };
      break;
      
    default:
      data = {
        labels: [],
        datasets: [],
      };
      options = {
        responsive: true,
      };
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesChart;