import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export default function useSignalRStatus() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const connect = async () => {
      try {
        const res = await fetch("https://azure-hackathon-fa.azurewebsites.net/api/negotiate", {
          method: "POST"
        });
        console.log("Response from negotiate:", res);

        const { url, accessToken } = await res.json();

        const connection = new signalR.HubConnectionBuilder()
          .withUrl(url, {
            accessTokenFactory: () => accessToken
          })
          .withAutomaticReconnect()
          .build();

        connection.on("statusMessage", (message) => {
          setStatus(message);
        });

        await connection.start();
        console.log("SignalR connected");
      } catch (err) {
        console.error("SignalR connection error:", err);
      }
    };

    connect();
  }, []);

  return status;
}
