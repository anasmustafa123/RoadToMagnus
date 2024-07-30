import { useState } from 'react';
import { Vendors } from '../../types/Api';
export const Header: React.FC<{ styles: CSSModuleClasses }> = ({ styles }) => {
  let data: string[] = ['john_do11', 'john_do11'];
  const [profileImg, setProfileImg] = useState<string>(
    '/logos/lichessdotcom.png',
  );
  const loadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : '';
    if (file) {
      console.log(URL.createObjectURL(file));
      setProfileImg(URL.createObjectURL(file));
    }
  };
  return (
    <div className={styles.header}>
      <span>
        <img
          className={styles.headerLogo}
          src={profileImg}
          alt="profile_avatar"
          draggable={false}
        />
        <div className={styles.imageText}>
          <div>change</div>
          <i className="bx bx-image-add"></i>
        </div>
        <input
          type="file"
          name="avatar-input"
          id="avatarInput"
          accept="image/png, image/jpeg"
          onChange={loadImg}
        />
      </span>
      <div>
        {Vendors.map((v, i) => (
          <div className={styles.tooltip}>
            <img
              src={`/logos/${v}.png`}
              alt={`${v} avatar`}
              draggable={false}
            />
            <div className={styles.tooltiptext}>{v}</div>
            <div>
              <h1 className={styles.username}>{data[i]}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
