'use client';

import {
  useContext,
  useMemo,
  createContext,
  useReducer,
  useCallback,
  ReactNode
} from 'react';

interface IViewPopupContext {
  showPopup: ({ content, index }: { content: any; index: number; }) => void;
  closePopup: () => void;
  show: boolean;
  content: any[];
  index: number;
}

interface MainProps {
  children: ReactNode;
}

const ViewPopupContext = createContext<IViewPopupContext>({
  showPopup: () => { },
  closePopup: () => { },
  show: false,
  content: [],
  index: 0
});

interface Action {
  type: string;
  payload?: any;
}

const initializer = {
  show: false,
  content: [] as any,
  index: 0
};

const reducers = (state: typeof initializer, action: Action) => {
  switch (action.type) {
    case 'VIEW_POPUP':
      return {
        ...state,
        show: true,
        ...action.payload
      };
    case 'CLOSE_POPUP':
      return {
        ...state,
        show: false,
        content: [],
        index: 0
      };
    default:
      return { ...state };
  }
};

export const useViewPopup = () => useContext(ViewPopupContext);

export function ViewPopupProvider({ children }: MainProps) {
  const [state, dispatch] = useReducer(reducers, initializer) as any;

  const showPopup = useCallback(
    (data) => dispatch({ type: 'VIEW_POPUP', payload: { content: data.content, index: data.index } }),
    [dispatch]
  );

  const closePopup = useCallback(() => {
    dispatch({ type: 'CLOSE_POPUP' });
  }, [dispatch]);

  const value = useMemo(() => ({ ...state, showPopup, closePopup }), [state]);

  return (
    <ViewPopupContext.Provider value={value}>
      {children}
    </ViewPopupContext.Provider>
  );
}
