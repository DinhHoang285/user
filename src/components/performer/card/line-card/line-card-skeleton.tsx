import style from './style.module.scss';

export default function PerformerLineCardSkeleton() {
  return (
    <div className={`${style['model-card']} skeleton-loading`} />
  );
}
