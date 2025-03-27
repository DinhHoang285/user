'use client';

import { RiVolumeMuteLine, RiVolumeUpLine } from 'react-icons/ri';

type Props = {
  muted: boolean;
  onClick: Function;
};

export default function MuteReelButton({
  muted,
  onClick
}: Props) {
  return (
    <button
      type="button"
      className={muted ? 'active' : ''}
      onClick={() => onClick()}
    >
      <span className="icon">
        {muted ? <RiVolumeMuteLine /> : <RiVolumeUpLine />}
      </span>
    </button>
  );
}
