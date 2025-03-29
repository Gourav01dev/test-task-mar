"use client";
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

type BookingGraphProps = {
  id: string;
  rate: number;
  totalProfit?: number;
};

const BookingGraph: React.FC<BookingGraphProps> = ({ id, rate, totalProfit }) => {
  const [state, setState] = useState({
    series: [rate], // Represents progress percentage
    options: {
      chart: {
        type: "radialBar" as const,
        offsetY: -10,
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#CAE0EB",
            strokeWidth: "30%",
            margin: 5,
          },
          hollow: {
            size: "75%",
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              offsetY: -2,
              fontSize: "40px",
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif",
              color: "#F8A334",
              formatter: (val: number) => `${val}%`,
            },
          },
        },
      },
      fill: {
        type: "solid" as const,
        colors: ["#F8A334"],
      },
      stroke: {
        lineCap: "round" as const,
      },
      labels: ["Expense Ratio"],
    },
  });

  // Update chart when rate changes
  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      series: [rate]
    }));
  }, [rate]);

  return (
    <div id={id} className='flex flex-col justify-center'>
      <ReactApexChart options={state.options} series={state.series} type="radialBar" height={250} />
      <p className='text-center text-base font-semibold font-2xl'>
        Total Profit: ${totalProfit?.toLocaleString() || '0'}
      </p>
    </div>
  );
};

export default BookingGraph;