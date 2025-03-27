'use client';

import { IConversation } from '@interfaces/message';
import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useReducer,
  useCallback
} from 'react';

interface IMessageContext {
  activeConversation: IConversation;
  contentLockerTotal: number;
  activeContentLocker: boolean;
  setActiveConversation: (c: IConversation) => void;
  setContentLockerTotal: (c: any) => void;
  setActiveContentLockerToggle: () => void;
}

interface MainProps {
  children: ReactNode;
}

const MessageContext = createContext<IMessageContext>({
  activeConversation: null,
  contentLockerTotal: 0,
  activeContentLocker: false,
  setActiveConversation: () => { },
  setContentLockerTotal: () => { },
  setActiveContentLockerToggle: () => { }
});

interface Action {
  type: string;
  payload?: any;
}

const initializer = {
  activeConversation: null,
  openMassModal: false,
  contentLockerTotal: 0,
  activeContentLocker: false
};

const reducers = (state: typeof initializer, action: Action) => {
  switch (action.type) {
    case 'setActiveConversation': {
      return {
        ...state,
        activeConversation: action.payload
      };
    }
    case 'setContentLockerTotal': {
      return {
        ...state,
        contentLockerTotal: action.payload
      };
    }
    case 'setActiveContentLockerToggle': {
      return {
        ...state,
        activeContentLocker: !state.activeContentLocker,
        activeConversation: null
      };
    }
    default: {
      return state;
    }
  }
};

export default function MessageProvider({ children }: MainProps) {
  const [state, dispatch] = useReducer(reducers, initializer) as any;

  const setActiveConversation = useCallback((data) => dispatch({ type: 'setActiveConversation', payload: data }), [dispatch]);
  const setContentLockerTotal = useCallback((data) => dispatch({ type: 'setContentLockerTotal', payload: data }), [dispatch]);
  const setActiveContentLockerToggle = useCallback((data) => dispatch({ type: 'setActiveContentLockerToggle', payload: data }), [dispatch]);

  const themeValue = useMemo(
    () => ({
      setActiveConversation,
      setContentLockerTotal,
      setActiveContentLockerToggle,
      ...state
    }),
    [setActiveConversation,
      setContentLockerTotal,
      setActiveContentLockerToggle,
      state]
  );

  return (
    <MessageContext.Provider value={themeValue}>
      {children}
    </MessageContext.Provider>
  );
}

export const useMessage = () => useContext(MessageContext);
