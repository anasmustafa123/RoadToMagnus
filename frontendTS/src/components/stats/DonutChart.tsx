import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, plugins, registerables } from 'chart.js';
import styles from '../../styles/Profile.module.css';
import { useState } from 'react';
export const DonutChart = (props: {
  data: any[];
  title: string;
  info: { label: string; key: string; color: string }[];
}) => {
  const [customLegendPlugin, setCustomLegendPlugin] = useState<boolean>(false);
  ChartJS.register(...registerables, plugins);
  let labelTitle = 'htmlLegend';
  let containerId = 'legend-container';
  const getOrCreateLegendList = (chart: any, id: string) => {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer
      ? legendContainer.querySelector('ul')
      : null;

    if (!listContainer) {
      listContainer = document.createElement('ul');
      listContainer.style.display = 'flex';
      listContainer.style.flexDirection = 'row';
      listContainer.style.margin = '0';
      listContainer.style.padding = '0';

      if (legendContainer) legendContainer.appendChild(listContainer);
    }

    return listContainer;
  };
  const htmlLegendPlugins = {
    id: labelTitle,
    afterUpdate(chart: any, args: any, options: any) {
      const ul = getOrCreateLegendList(chart, options.containerID);

      // Remove old legend items
      while (ul.firstChild) {
        ul.firstChild.remove();
      }

      // Reuse the built-in legendItems generator
      // @ts-ignore
      const items = chart.options.plugins.legend.labels.generateLabels(chart);

      items.forEach((item: any) => {
        const li = document.createElement('li');
        li.style.alignItems = 'center';
        li.style.cursor = 'pointer';
        li.style.display = 'flex';
        li.style.flexDirection = 'row';
        li.style.marginLeft = '10px';

        li.onclick = () => {
          const { type } = chart.config;
          if (type === 'pie' || type === 'doughnut') {
            // Pie and doughnut charts only have a single dataset and visibility is per item
            chart.toggleDataVisibility(item.index);
          } else {
            chart.setDatasetVisibility(
              item.datasetIndex,
              !chart.isDatasetVisible(item.datasetIndex),
            );
          }
          chart.update();
        };

        // Color box
        const boxSpan = document.createElement('span');
        boxSpan.style.background = item.fillStyle;
        boxSpan.style.borderColor = item.strokeStyle;
        boxSpan.style.borderWidth = item.lineWidth + 'px';
        boxSpan.style.display = 'inline-block';
        boxSpan.style.flexShrink = '0';
        boxSpan.style.height = '20px';
        boxSpan.style.marginRight = '10px';
        boxSpan.style.width = '20px';

        // Text
        const textContainer = document.createElement('p');
        textContainer.style.color = item.fontColor;
        textContainer.style.margin = '0';
        textContainer.style.padding = '0';
        textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

        const text = document.createTextNode(item.text);
        textContainer.appendChild(text);

        li.appendChild(boxSpan);
        li.appendChild(textContainer);
        ul.appendChild(li);
      });
    },
  };
  return (
    <>
      <Doughnut
        options={{
          responsive: true,
          plugins: {
            // @ts-ignore
            htmlLegend: {
              // ID of the container to put the legend in
              containerID: customLegendPlugin ? 'legend-container' : '',
            },
            legend: {
              display: customLegendPlugin ? false : true,
              position: 'bottom',
            },
            title: {
              display: props.title ? true : false,
              text: props.title,
            },
          },
        }}
        data={{
          labels: props.info.map((v) => v.label),
          datasets: [
            {
              label: 'Games Played',
              data: props.info.map((v) => {
                return props.data.reduce((prev, current) => {
                  if (current.vendor === v.key) {
                    return prev + 1;
                  } else {
                    return prev;
                  }
                }, 0);
              }),
              backgroundColor: props.info.map((v) => v.color),
            },
          ],
        }}
        {...{ plugins: [htmlLegendPlugins] }}
      />
      {customLegendPlugin && (
        <div id="legend-container">
          <ul className={styles.legendContainer}></ul>
          <ul className={styles.listStyles}>
            <div style={{ '--header-color': 'chartreuse' }}>
              <div></div>
              <li>Chess.com</li>
            </div>
            <div style={{ '--header-color': 'aquamarine' }}>
              <div></div>
              <li>Lichess.org</li>
            </div>
          </ul>
        </div>
      )}
    </>
  );
};
