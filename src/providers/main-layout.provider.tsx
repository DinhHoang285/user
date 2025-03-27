'use client';

import Popup18Warning from '@components/common/base/popup-18-warning';
import { IPerformer } from '@interfaces/performer';
import { ISettings } from '@interfaces/setting';

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer
} from 'react';

const uniq = require('lodash/uniq');

interface IMainLayoutContext {
  // SignIn/SignUp popup
  setLoginModal: ({ openForm }: { openForm: string }) => void;
  openForm: string;
  settings: ISettings;
  // Video volume
  volume: number;
  setVolume: ({ volume }: { volume: number }) => void;
  // Follow management
  resetFollowIds: () => void;
  updateFollowIds: (data: { id: string; type?: 'add' | 'remove' }) => void;
  followedIds: string[];
  // Locales
  supportedLocales: string[];
  // Subscription popup
  setSubscriptionModal: ({ action }: any) => void;
  setAutoPlayVideo: ({ action }: any) => void;
  subcriptionModal: {
    open: boolean;
    performer: IPerformer;
    subscriptionType: string;
  },
  autoPlayVideo: {
    autoPlayBtn: string;
    currentIdRunning: string
  }
}

interface MainProps {
  children: ReactNode;
  settings: ISettings;
}

const MainLayoutContext = createContext<IMainLayoutContext>({
  // SignIn/SignUp popup
  setLoginModal: () => { },
  openForm: '',
  settings: {} as ISettings,
  // Video volume
  volume: 1,
  setVolume: () => { },
  // Follow management
  resetFollowIds: () => { },
  updateFollowIds: () => { },
  followedIds: [],
  // Locales
  supportedLocales: [],
  // Subscription popup
  setSubscriptionModal: () => { },
  setAutoPlayVideo: () => { },
  subcriptionModal: {
    open: false,
    performer: null,
    subscriptionType: 'monthly'
  },
  autoPlayVideo: {
    autoPlayBtn: 'off',
    currentIdRunning: ''
  }
});

interface Action {
  type: string;
  payload?: any;
}

const initializer = {
  // SignIn/SignUp popup
  openForm: '',
  // Follow management
  followedIds: [] as string[],
  // Video volume
  volume: 0,
  // Subscription popup
  subcriptionModal: {
    open: false,
    performer: null,
    subscriptionType: 'monthly'
  },
  // auto play video page feed
  autoPlayVideo: {
    autoPlayBtn: 'off',
    currentIdRunning: ''
  }
};
const reducers = (state: typeof initializer, action: Action) => {
  switch (action.type) {
    case 'setLoginModal': {
      return {
        ...state,
        openForm: action.payload.openForm
      };
    }
    case 'setVolume': {
      return {
        ...state,
        volume: action.payload.volume
      };
    }
    case 'updateFollowIds': {
      const { id, type = 'add' } = action.payload;
      if (type === 'add' && state.followedIds.includes(id)) return state;
      return {
        ...state,
        followedIds:
          type === 'add'
            ? uniq([...state.followedIds, id])
            : uniq(state.followedIds.filter((i) => i !== id))
      };
    }
    case 'resetFollowIds': {
      return {
        ...state,
        followedIds: []
      };
    }
    case 'setSubscriptionModal': {
      return {
        ...state,
        subcriptionModal: {
          ...state.subcriptionModal,
          open: action.payload.open,
          performer: action.payload.performer,
          subscriptionType: action.payload.subscriptionType
        }
      };
    }
    case 'setAutoPlayVideo': {
      const nextState = { ...state };
      action.payload.autoPlayBtn ? nextState.autoPlayVideo.autoPlayBtn = action.payload?.autoPlayBtn : null;
      action.payload.currentIdRunning ? nextState.autoPlayVideo.currentIdRunning = action.payload?.currentIdRunning : null;
      return nextState;
    }
    default: {
      return state;
    }
  }
};

export default function MainLayoutProvider({ children, settings }: MainProps) {
  const [state, dispatch] = useReducer(reducers, initializer) as any;

  const setLoginModal = useCallback((data) => dispatch({ type: 'setLoginModal', payload: data }), [dispatch]);
  const setVolume = useCallback((data) => dispatch({ type: 'setVolume', payload: data }), [dispatch]);
  const updateFollowIds = useCallback((data) => dispatch({ type: 'updateFollowIds', payload: data }), [dispatch]);
  const resetFollowIds = useCallback((data) => dispatch({ type: 'resetFollowIds', payload: data }), [dispatch]);
  const setSubscriptionModal = useCallback((data) => dispatch({ type: 'setSubscriptionModal', payload: data }), [dispatch]);
  const setAutoPlayVideo = useCallback((data) => dispatch({ type: 'setAutoPlayVideo', payload: data }), [dispatch]);

  const themeValue = useMemo<IMainLayoutContext>(
    () => ({
      settings,
      setVolume,
      setLoginModal,
      updateFollowIds,
      resetFollowIds,
      setSubscriptionModal,
      setAutoPlayVideo,
      supportedLocales: [],
      ...state
    }),
    [
      setLoginModal,
      setVolume,
      updateFollowIds,
      resetFollowIds,
      setSubscriptionModal,
      setAutoPlayVideo,
      state
    ]
  );

  return (
    <MainLayoutContext.Provider value={themeValue}>
      {children}
      {settings.enable18Popup && (
        <Popup18Warning
          content18Popup={settings.content18Popup}
          logo={settings.logoUrl}
          darkmodeLogo={settings.darkmodeLogoUrl}
        />
      )}
    </MainLayoutContext.Provider>
  );
}

export const useMainThemeLayout = () => useContext(MainLayoutContext);
