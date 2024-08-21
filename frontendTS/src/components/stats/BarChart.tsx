import { Chart as ChartJS, InteractionMode, registerables } from 'chart.js';
import { INFINITY } from 'chart.js/helpers';
import { Bar } from 'react-chartjs-2';
const BarChart = () => {
  ChartJS.register(...registerables);

  let gamesdraw = [
    { key: 'time', name: 'Time Out', count: 0, result: 1 },
    { key: 'check', name: 'Checkmate', count: 0 },
    { key: 'res', name: 'Resigned', count: 0 },
    { key: 'agree', name: 'Agree', count: 100 },
    { key: 'stall', name: 'Stallmate', count: 90 },
    { key: 'rep', name: '3 Repetetion', count: 120 },
    { key: 'ins', name: 'insuffecient', count: 80 },
    { key: 'timeinsuf', name: 'TimeInsufficient', count: 100 },
    { key: 'fifty', name: '50 Move Rule', count: 100 },
  ];
  let gameswon = [
    { key: 'time', name: 'Time Out', count: 700, result: 1 },
    { key: 'check', name: 'Checkmate', count: 390 },
    { key: 'res', name: 'Resigned', count: 550 },
    { key: 'agree', name: 'Agree', count: 0 },
    { key: 'stall', name: 'Stallmate', count: 0 },
    { key: 'rep', name: '3 Repetetion', count: 0 },
    { key: 'ins', name: 'insuffecient', count: 0 },
    { key: 'timeinsuf', name: 'TimeInsufficient', count: 0 },
    { key: 'fifty', name: '50 Move Rule', count: 0 },
  ];
  let gameslost = [
    { key: 'time', name: 'Time Out', count: 600 },
    { key: 'check', name: 'Checkmate', count: 500 },
    { key: 'res', name: 'Resigned', count: 400 },
    { key: 'agree', name: 'Agree', count: 0 },
    { key: 'stall', name: 'Stallmate', count: 0 },
    { key: 'rep', name: '3 Repetetion', count: 0 },
    { key: 'ins', name: 'insuffecient', count: 0 },
    { key: 'timeinsuf', name: 'TimeInsufficient', count: 0 },
    { key: 'fifty', name: '50 Move Rule', count: 0 },
  ];
  const greenVariants = [
    '#00FF00',
    '#32CD32',
    '#98FB98',
    '#00FA9A',
    '#7CFC00',
    '#00FF7F',
    '#2E8B57',
    '#3CB371',
    '#66CDAA',
  ];

  const redVariants = [
    '#FF0000',
    '#FF6347',
    '#FF4500',
    '#DC143C',
    '#B22222',
    '#CD5C5C',
    '#FA8072',
    '#E9967A',
    '#F08080',
  ];

  const greyVariants = [
    '#808080',
    '#A9A9A9',
    '#C0C0C0',
    '#D3D3D3',
    '#DCDCDC',
    '#E0E0E0',
    '#E8E8E8',
    '#F5F5F5',
    '#F8F8FF',
  ];

  const colorObject = {
    time: [greenVariants[0], redVariants[0], greyVariants[0]],
    check: [greenVariants[1], redVariants[1], greyVariants[1]],
    res: [greenVariants[2], redVariants[2], greyVariants[2]],
    agree: [greenVariants[3], redVariants[3], greyVariants[3]],
    stall: [greenVariants[4], redVariants[4], greyVariants[4]],
    rep: [greenVariants[5], redVariants[5], greyVariants[5]],
    ins: [greenVariants[6], redVariants[6], greyVariants[6]],
    timeinsuf: [greenVariants[7], redVariants[7], greyVariants[7]],
    fifty: [greenVariants[8], redVariants[8], greyVariants[8]],
  };
  const labels = ['won', 'lose', 'draw'];
  const data = {
    labels: labels,
    datasets: gamesdraw.map((label) => {
      return {
        label: label.name,
        data: [
          // @ts-ignore
          gameswon.find((g) => {
            return g.key == label.key;
          }).count, // @ts-ignore
          gameslost.find((g) => {
            return g.key == label.key;
          }).count,
          10,
        ], // @ts-ignore
        backgroundColor: colorObject[label.key],
      };
    }),
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          // forces step size to be 50 units
          stepSize: 50
        }
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Rating for the last month',
        color: 'white',
      },
    },
  };
  return <Bar data={data} options={options} />;
};

export default BarChart;
