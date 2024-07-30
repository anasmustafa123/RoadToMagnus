import styles from '../styles/Profile.module.css';
import { Header } from '../components/profile/Header';
import { DonutChart } from '../components/stats/DonutChart';
import PieChart from '../components/stats/PieChart';
const Profile = () => {
  let classifications = [
    { name: 'good', chess: 20, lichess: 30 },
    { name: 'great', chess: 150, lichess: 90 },
    { name: 'brilliant', chess: 20, lichess: 150 },
    { name: 'mistake', chess: 80, lichess: 30 },
    { name: 'inacuracy', chess: 120, lichess: 500 },
    { name: 'blunder', chess: 200, lichess: 300 },
    { name: 'botezgambit', chess: 20, lichess: 30 },
    { name: 'forced', chess: 50, lichess: 30 },
    { name: 'missed', chess: 80, lichess: 30 },
    { name: 'botezgambit', chess: 190, lichess: 310 },
  ];
  let info = [
    { label: 'Chess.com', key: 'chess.com', color: 'chartreuse' },
    { label: 'Lichess.org', key: 'lichess', color: 'aquamarine' },
  ];
  let vendors = ['chess.com', 'chess.com', 'lichess', 'lichess'];
  let res = [1, -1, 0, 1];
  let data = new Array(1000).fill({ vendor: '', result: 1 }).map((gameRes) => {
    let gameRescopy = { ...gameRes };
    let index1 = Math.round(Math.random() * 3);
    let index2 = Math.round(Math.random() * 3);
    gameRescopy.vendor = vendors[index1];
    gameRescopy.result = res[index2];
    return gameRescopy;
  });

  let minigamesdata = [
    { name: 'Rapid', url: 'rapid', 'chess.com': 1200, lichess: 1300 },
    { name: 'Blitz', url: 'blitz', 'chess.com': 1200, lichess: 1300 },
    { name: 'Bullet', url: 'bullet', 'chess.com': 1200, lichess: 1300 },
    { name: 'Daily', url: 'daily', 'chess.com': 1200, lichess: 1300 },
  ];

  return (
    <>
      <div className={styles.gridcontainer}>
        <div className={styles.profile}>
          <Header styles={styles}></Header>
          {/* mini stats component */}
          <div className={styles.classificationBlocksContainer}>
            <div className={styles.pagelinkContainer}>
              <i className="bx bxs-circle-three-quarter"></i>
              <a href="#" className={styles.pagelink}>
                Stats
              </a>
              <i className="bx bxs-chevron-down"></i>
            </div>
            {classifications.map((classi, i) => (
              <div key={i} className={styles.classificationBlock}>
                <img
                  src={`/classification/${classi.name}.png`}
                  alt={`${classi} move image`}
                  draggable={false}
                />
                <div>
                  <img
                    src="/logos/chess.com.png"
                    alt="chess.com logo"
                    draggable={false}
                  />
                  <div>{classi.chess}</div>
                </div>
                <div>
                  <img
                    src="/logos/lichess.png"
                    alt="lichess.org image"
                    draggable={false}
                  />
                  <div>{classi.chess}</div>
                </div>
                <div>
                  <img
                    src="/logos/lichessdotcom.png"
                    alt="mywebsite image"
                    draggable={false}
                  />
                  <div>{classi.lichess}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.donutContainer}>
          <div className={styles.pagelinkContainer}>
            <i className="bx bxs-circle-three-quarter"></i>
            <a href="#" className={styles.pagelink}>
              Stats
            </a>
            <i className="bx bxs-chevron-down"></i>
          </div>
          <PieChart data={data} info={info} title="Game Played"></PieChart>
        </div>
        <div className={styles.miniGamesContainer}>
          <div className={styles.pagelinkContainer}>
            <i className="bx bxs-circle-three-quarter"></i>
            <a href="#" className={styles.pagelink}>
              Stats
            </a>
            <i className="bx bxs-chevron-down"></i>
          </div>
          {minigamesdata.map((game, i) => {
            return (
              <>
                <div key={i} className={styles.singleGameContainer}>
                  <img
                    src={`/timeControl/${game.url}.svg`}
                    alt={`${game.name} icon`}
                    draggable={false}
                  />
                  <div>{game.name}</div>
                  <div className={styles.verticalflex}>
                    <img
                      src="/logos/chess.com.png"
                      alt="chess.com logo"
                      draggable={false}
                    />
                    <img
                      src="/logos/lichess.png"
                      alt="lichess.org logo"
                      draggable={false}
                    />
                  </div>
                  <div className={styles.valuesContainer}>
                    <div>{game['chess.com']}</div>
                    <div>{game.lichess}</div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Profile;
