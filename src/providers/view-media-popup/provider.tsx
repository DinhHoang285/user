import { ViewPopupProvider } from './context';
import ViewMediaPopupChildren from './view-media-popup-children';

export default function ViewMediaPopupContainer({ children }: any) {
  return (
    <ViewPopupProvider>
      {children}
      <ViewMediaPopupChildren />
    </ViewPopupProvider>
  );
}
