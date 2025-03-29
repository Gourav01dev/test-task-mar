'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactApexChart with no SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ColumnGraphProps {
  id: string;
  rate: number[];
  name: string;
}

interface ChartState {
  series: { name: string; data: number[] }[];
  options: any; // Use 'any' instead of ApexCharts.ApexOptions to avoid SSR issues
}

const ColumnGraph: React.FC<ColumnGraphProps> = ({ id, rate, name }) => {
  const [mounted, setMounted] = useState(false);
  const [columnChartState, setColumnChartState] = useState<ChartState>({
    series: [{ name, data: rate }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          columnWidth: '22%',
          borderRadius: 6,
          borderRadiusApplication: 'end',
          dataLabels: { position: 'top' },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `$${val.toLocaleString()}`,
        offsetY: -20,
        style: { fontSize: '12px', fontWeight: 600, colors: ['#304758'] },
      },
      colors: ['#F8A334'],
      xaxis: {
        categories: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        position: 'bottom',
        labels: { style: { colors: '#ACACAC', fontSize: '13px' }, offsetY: 5 },
        axisBorder: { show: true, color: '#CAE0EB', width: '100%', offsetX: 10 },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          align: 'left',
          offsetX: 10,
          style: { colors: '#ACACAC', fontSize: '13px' },
          formatter: (val: number) => `$${val.toLocaleString()}`,
        },
        title: {
          text: name,
          offsetX: -15,
          style: { fontSize: '14px', fontWeight: 400, color: '#212121', lineHeight: '20px' },
        },
        axisBorder: { offsetX: -45, show: true, color: '#CAE0EB' },
      },
      grid: { show: false },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        markers: { fillColors: ['#F8A334'] },
        labels: { colors: '#212121', useSeriesColors: false },
      },
      tooltip: {
        y: { formatter: (val: number) => `$${val.toLocaleString()}` },
      },
    },
  });

  // Use effect to indicate when component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update the chart when the rate prop changes
  useEffect(() => {
    setColumnChartState(prevState => ({
      ...prevState,
      series: [{ name, data: rate }]
    }));
  }, [rate, name]);

  // Show a placeholder before the component mounts on the client
  if (!mounted) {
    return <div className="h-[350px] w-full flex items-center justify-center bg-gray-100 rounded-md">
      <p className="text-gray-500">Loading chart...</p>
    </div>;
  }

  return (
    <div id={id}>
      <ReactApexChart options={columnChartState.options} series={columnChartState.series} type="bar" height={350} />
    </div>
  );
};

export default ColumnGraph;