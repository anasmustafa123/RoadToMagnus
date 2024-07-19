import { Chart as ChartJS, InteractionMode, registerables } from 'chart.js';
import { INFINITY } from 'chart.js/helpers';
import { Line } from 'react-chartjs-2';

const Stats = () => {

// {labels: string[], ratings: number[] }

  let set = [
    { name: 'chess.com', borderColor: 'lightgreen', bgColor: '#90ee909c' },
    { name: 'lichess', borderColor: 'lightblue', bgColor: '#bbd8e5ab' },
  ];

  let ratings = new Array(30)
    .fill(Math.floor(500 * Math.random() * 10))
    .map((v, i) => Math.min(2000, v + Math.ceil(i * 50)));

  function getMaxXaxis(ratings: number[]): number {
    let maxRating = ratings.reduce((p, n) => {
      return p > n ? p : n;
    }, -INFINITY);
    for (let i = 1; i <= 4000; ) {
      if (i > maxRating) {
        return i;
      }
      i += 500;
    }
    return 4000;
  }

  ChartJS.register(...registerables);

  const data = {
    labels: new Array(30).fill(10).map((v, i) => (i + 1).toString()),
    datasets: set.map((v) => ({
      label: v.name,
      data: ratings,
      backgroundColor: v.bgColor,
      borderColor: v.borderColor,
      borderWidth: 2,
      fill: true,
      radius: 0,
    })),
  };
  const tooltipMode: InteractionMode = 'nearest';
  const options = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: tooltipMode,
    },
    tooltip: {
      enabled: true,
    },
    plugins: {
      title: {
        display: true,
        text: 'Rating for the last month',
        color: 'white',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: true,
        suggestedMin: 0,
        suggestedMax: getMaxXaxis(ratings),
      },
    },
  };

  return (
    <div
      style={{
        width: '500px',
        height: 'auto',
        backgroundColor: '#373333',
        borderRadius: '5px',
        padding: '20px 10px 20px 10px',
        color: 'white',
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};
export default Stats;
