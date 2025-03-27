'use client';

import {
  useMemo, useEffect, createElement, ReactNode, useState
} from 'react';
import {
  IntlProvider, IntlConfig
} from 'react-intl';
import { isLocale } from 'src/lib/utils';
import { languageService } from '@services/language.service';
import { supportedLocales } from 'src/constants';
import { useParams } from 'next/navigation';

interface P
  extends Omit<
    IntlConfig,
    | 'locale'
    | 'messages'
    | 'formats'
    | 'timeZone'
    | 'textComponent'
    | 'defaultFormats'
    | 'onError'
  > {
  children: ReactNode;
  locale: string;
}

function I18nextProvider({
  locale,
  children
}: P) {
  // const checkedGeo = useRef(false);
  const [messages, setMessages] = useState({});
  const params = useParams();
  const detected = isLocale(params.locale || locale) && (params.locale || locale) as string;

  useEffect(() => {
    if (detected && supportedLocales.includes(detected)) {
      const loadMessage = async () => {
        try {
          const resp = await languageService.search({ locale: detected });
          const translatedMessages = {};
          (resp.data.data || []).forEach((d) => {
            translatedMessages[d.key] = d.value;
          });
          setMessages(translatedMessages);
        } catch {
          setMessages({});
        }
      };
      loadMessage();
    }
  }, [detected]);

  const props: any = useMemo(
    () => ({
      locale,
      messages,
      onError: () => { }
    }),
    [locale, messages]
  );

  return createElement(
    IntlProvider,
    {
      ...props
    },
    children
  );
}

export default I18nextProvider;
