import { useRef } from 'react';

interface IProps {
  source: string;
}

export function PreviewAudioPlayer({
  source
}: IProps) {
  const audioRef = useRef(null);

  return (
    <div className="preview-audio-player">
      <audio ref={audioRef} controls>
        <source src={source} type="audio/mpeg" />
      </audio>
    </div>
  );
}
