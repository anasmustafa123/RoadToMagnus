import { Chart as ChartJS, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

const PieChart = (props: {
  data: any[];
  title: string;
  info: { label: string; key: string; color: string }[];
}) => {
  ChartJS.register(...registerables);
  let labelTitle = 'labeltitle';
  return (
    <Pie
      options={{
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: props.title,
          },
          legend: {
            display: true,
            position: 'top',
          },
        },
      }}
      data={{
        labels: props.info.map((v) => v.label),
        datasets: [
          {
            label: labelTitle,
            data: props.info.map((v) => {
              return props.data.reduce((prev, current) => {
                if (current.vendor === v.key) {
                  return prev + 1;
                } else {
                  return prev;
                }
              },0);
            }),
            backgroundColor: props.info.map((v) => v.color),
          },
        ],
      }}
    />
  );
};
export default PieChart;
