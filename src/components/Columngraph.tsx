'use client';

import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ColumnGraphProps {
  id: string;
  rate: number[];
  name: string;
}

interface ChartState {
  series: { name: string; data: number[] }[];
  options: ApexCharts.ApexOptions;
}

const ColumnGraph: React.FC<ColumnGraphProps> = ({ id, rate, name }) => {
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
        formatter: (val: number) => val.toLocaleString(),
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
        y: { formatter: (val: number) => `$ ${val.toLocaleString()} thousands` },
      },
    },
  });

  return (
    <div id={id}>
      <ReactApexChart options={columnChartState.options} series={columnChartState.series} type="bar" height={350} />
    </div>
  );
};

export default ColumnGraph;
