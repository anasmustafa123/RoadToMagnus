import { Vendors } from '../../types/Api';
export const Header: React.FC<{ styles: CSSModuleClasses }> = ({ styles }) => {
  let data: { [x: string]: number } = { 'chess.com': 1200, lichess: 1500 };
  

  return (
    <div className={styles.header}>
      <span>
        <img
          className={styles.headerLogo}
          src="/logos/lichessdotcom.png"
          alt="profile_avatar"
          draggable={false}
        />
        <input
          type="file"
          name="avatar-input"
          id="avatarInput"
          accept="image/png, image/jpeg" // Enforces selection of PNG or JPEG images

        />
      </span>
      <div>
        <h1 className={styles.username}>AnasMostafa11</h1>
        {Vendors.map((v, i) => (
          <div key={i}>
            <img
              src={`/logos/${v}.png`}
              alt={`${v} avatar`}
              draggable={false}
            />
            <div>
              <div>{v}</div>
              <div>{data[v]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
