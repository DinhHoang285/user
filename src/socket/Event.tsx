'use client';

import { useContext, useEffect } from 'react';
import { SocketContext } from './SocketContext';

type IEventProps = {
  event: string;
  handler: Function;
}

function Event({
  event,
  handler
}: IEventProps) {
  if (typeof window === 'undefined') return null;

  const { getSocket, socketStatus, connected } = useContext(SocketContext);

  const handleOffSocket = () => {
    const socket = getSocket();
    socket?.off(event, handler);
  };

  useEffect(() => {
    if (!connected()) return handleOffSocket();
    const socket = getSocket();
    socket?.on(event, handler);

    return handleOffSocket;
  }, [socketStatus]);

  return null;
}

export default Event;
