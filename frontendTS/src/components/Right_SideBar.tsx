import MiniGamesStat from './profile/MiniGamesStat';
import RouteLink from './RouteLink';
import BarChart from './stats/BarChart';
import styles from '../styles/Right_SideBar.module.css';

export const Right_SideBar = () => {
  return (
    <>
      <div className={styles.rightSidebar}>
        <div
          style={{ border: '1px solid black' }}
          className={styles.donutContainer}
        >
          <RouteLink
            iconKey="bxs-circle-three-quarter"
            pathUrl="/stats"
            title="Stats"
            hovercolor="green"
          />
          {/*           <PieChart data={data} info={info} title="Game Played"></PieChart> */}
          <BarChart />
        </div>
        <MiniGamesStat />
      </div>
    </>
  );
};
