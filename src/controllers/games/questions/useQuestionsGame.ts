import { useEffect, useState, useCallback } from "react";
import socketIOClient from "socket.io-client";
import { API_URL } from "../../../../client";
import { EVENTS } from "./settings";

export default function useQuestionsGame(handleActions:any) {
  const [socket, setSocket] = useState<any>(null);

  const triggerAction = useCallback((action) => {
    console.log('Action: ' + action.type, action.params);
    
    if (!socket) {
      console.log('socket error, socket: ' + socket);
      return
    }
    socket.emit(action.type, action.params)
  }, [socket]);

  useEffect(() => {
    const socketClient: any = socketIOClient(API_URL);
    setSocket(socketClient)

    socketClient.on("connect_error", (err: any) => {
      console.log(`connect_error due to ${err.message}`);
    });

    const events = Object.values(EVENTS)
    for (const event of events) {
      socketClient.on(event, (data: any) => {
        console.log('EVENT: ' + event);

        handleActions({
          type: event,
          params: data
        })
      })
    }
    return () => socketClient.disconnect();
  }, []);

  return triggerAction
}