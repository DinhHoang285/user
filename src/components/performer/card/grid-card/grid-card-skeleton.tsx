import style from './style.module.scss';

export default function PerformerGridCardSkeleton() {
  return (
    <div
      className={`${style['grid-card']} skeleton-loading`}
    />
  );
}
