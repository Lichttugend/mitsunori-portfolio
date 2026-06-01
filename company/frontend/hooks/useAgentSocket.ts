"use client";

import { useEffect, useRef, useState } from "react";
import { WS_URL } from "@/lib/api";
import type { Agent, ActivityEvent, WsInitMessage } from "@/lib/types";

export function useAgentSocket(initialAgents: Record<string, Agent>, initialActivity: ActivityEvent[]) {
  const [agents, setAgents] = useState<Record<string, Agent>>(initialAgents);
  const [activity, setActivity] = useState<ActivityEvent[]>(initialActivity);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        // 2秒後に再接続
        setTimeout(connect, 2000);
      };

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.type === "init") {
          const msg = data as WsInitMessage;
          setAgents(msg.agents);
          setActivity(msg.recent_activity);
          return;
        }

        // アクティビティイベント
        const event = data as ActivityEvent;
        setActivity((prev) => [...prev.slice(-49), event]);

        // エージェントのステータスを更新
        setAgents((prev) => {
          if (!prev[event.agent]) return prev;
          const status =
            event.kind === "start" || event.kind === "info"
              ? "working"
              : event.kind === "error"
              ? "error"
              : "idle";
          return {
            ...prev,
            [event.agent]: {
              ...prev[event.agent],
              status,
              last_active: event.timestamp,
            },
          };
        });
      };
    };

    connect();
    return () => wsRef.current?.close();
  }, []);

  return { agents, activity, connected };
}
