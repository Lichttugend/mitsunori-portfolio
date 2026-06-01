"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ActivityEvent } from "@/lib/types";

const KIND_ICON: Record<string, string> = {
  start:    "🚀",
  info:     "💬",
  success:  "✅",
  complete: "🎉",
  error:    "❌",
};

const KIND_COLOR: Record<string, string> = {
  start:    "text-blue-400",
  info:     "text-slate-400",
  success:  "text-emerald-400",
  complete: "text-amber-400",
  error:    "text-red-400",
};

interface ActivityFeedProps {
  events: ActivityEvent[];
  connected: boolean;
}

export function ActivityFeed({ events, connected }: ActivityFeedProps) {
  const sorted = [...events].reverse();

  return (
    <div className="flex flex-col h-full rounded-xl p-3 overflow-hidden"
      style={{ background: "#111827", border: "1px solid #1e2a45" }}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-2 pb-2"
        style={{ borderBottom: "1px solid #1e2a45" }}>
        <h2 className="text-[11px] font-semibold tracking-wider uppercase text-slate-500">Activity</h2>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-red-500"}`} />
          <span className="text-[10px] text-slate-600">{connected ? "LIVE" : "OFF"}</span>
        </div>
      </div>

      {/* フィード */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-0.5">
        <AnimatePresence initial={false}>
          {sorted.length === 0 && (
            <p className="text-[11px] text-slate-600 text-center mt-6">アクティビティなし</p>
          )}
          {sorted.map((ev, i) => (
            <motion.div
              key={`${ev.timestamp}-${i}`}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex gap-2 items-start text-[11px] rounded-lg px-2 py-1.5"
              style={{ background: "#0e1525" }}
            >
              <span className="shrink-0 mt-0.5 text-[10px]">{KIND_ICON[ev.kind] ?? "·"}</span>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-slate-300">{ev.agent_name} </span>
                <span className={KIND_COLOR[ev.kind] ?? "text-slate-500"}>{ev.message}</span>
              </div>
              <span className="shrink-0 text-[10px] text-slate-600 mt-0.5">
                {new Date(ev.timestamp).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
