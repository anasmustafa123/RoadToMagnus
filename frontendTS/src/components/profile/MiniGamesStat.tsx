import styles from '../../styles/MiniGamesState.module.css';
import RouteLink from '../RouteLink';
const MiniGamesStat = ({}) => {
  let minigamesdata = [
    { name: 'Rapid', url: 'rapid', 'chess.com': 1200, lichess: 1300 },
    { name: 'Blitz', url: 'blitz', 'chess.com': 1200, lichess: 1300 },
    { name: 'Bullet', url: 'bullet', 'chess.com': 1200, lichess: 1300 },
    { name: 'Daily', url: 'daily', 'chess.com': 1200, lichess: 1300 },
  ];
  return (
    <div
      style={{ border: '1px solid black' }}
      className={styles.miniGamesContainer}
    >
      <RouteLink
        iconKey="bxs-circle-three-quarter"
        pathUrl="/stats"
        title="Stats"
        hovercolor="green"
      />

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
  );
};

export default MiniGamesStat;
