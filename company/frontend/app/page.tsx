"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Office2D } from "@/components/office/Office2D";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { useAgentSocket } from "@/hooks/useAgentSocket";
import { getAgentsStatus, triggerAgent } from "@/lib/api";
import type { Agent, ActivityEvent } from "@/lib/types";

const ACCENT: Record<string, string> = {
  ceo: "#f59e0b", accounting: "#38bdf8", dev: "#34d399", sales: "#a78bfa",
};

const STATUS_META = {
  idle:    { label: "待機中", dot: "#475569" },
  working: { label: "作業中", dot: "#34d399" },
  error:   { label: "エラー",  dot: "#f87171" },
} as const;

export default function Home() {
  const [initialAgents, setInitialAgents] = useState<Record<string, Agent>>({});
  const [initialActivity, setInitialActivity] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    getAgentsStatus()
      .then((d) => { setInitialAgents(d.agents); setInitialActivity(d.recent_activity); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const { agents, activity, connected } = useAgentSocket(initialAgents, initialActivity);
  const selected = selectedKey ? agents[selectedKey] : null;

  const handleSelect = (key: string) =>
    setSelectedKey((prev) => (prev === key ? null : key));

  const handleTrigger = async () => {
    if (!selectedKey) return;
    try { await triggerAgent(selectedKey); } catch (e) { console.error(e); }
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "#0e1525" }}>

      {/* ─── ヘッダー ─── */}
      <header
        className="shrink-0 flex items-center justify-between px-5 py-3 z-20"
        style={{
          background: "linear-gradient(180deg, #0a1020 0%, #0e1525 100%)",
          borderBottom: "1px solid #1e2a45",
          boxShadow: "0 1px 0 #0a1020, 0 4px 16px #00000044",
        }}
      >
        {/* ロゴ */}
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              boxShadow: "0 0 12px #3b82f644",
            }}
          >
            <span className="text-white">C</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 leading-none tracking-wide">Company HQ</h1>
            <p className="text-[10px] text-slate-500 mt-0.5 tracking-wider">AI AGENT OFFICE</p>
          </div>
        </div>

        {/* ステータスバッジ */}
        <div className="flex gap-2">
          {Object.entries(agents).map(([key, ag]) => {
            const meta = STATUS_META[ag.status as keyof typeof STATUS_META] ?? STATUS_META.idle;
            return (
              <motion.div
                key={key}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 cursor-pointer"
                style={{
                  background: "#141e32",
                  border: `1px solid ${selectedKey === key ? ACCENT[key] : "#1e2a45"}`,
                  boxShadow: selectedKey === key ? `0 0 8px ${ACCENT[key]}44` : "none",
                }}
                whileHover={{ scale: 1.04 }}
                onClick={() => handleSelect(key)}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: meta.dot }}
                  animate={ag.status === "working" ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
                <span className="text-[11px] font-medium text-slate-300">{ag.name}</span>
              </motion.div>
            );
          })}
        </div>
      </header>

      {/* ─── メインエリア ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* オフィスシーン */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
          ) : (
            <Office2D agents={agents} selectedKey={selectedKey} onSelect={handleSelect} />
          )}
        </div>

        {/* ─── 右サイドバー ─── */}
        <div
          className="w-64 shrink-0 flex flex-col gap-3 p-3 overflow-hidden"
          style={{ borderLeft: "1px solid #1e2a45", background: "#0c1422" }}
        >
          {/* エージェント詳細パネル */}
          <AnimatePresence mode="wait">
            {selected && selectedKey ? (
              <motion.div
                key={selectedKey}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "#111827",
                  border: `1px solid ${ACCENT[selectedKey]}44`,
                  boxShadow: `0 0 20px ${ACCENT[selectedKey]}18`,
                }}
              >
                {/* アクセントライン */}
                <div className="h-0.5" style={{
                  background: `linear-gradient(90deg, transparent, ${ACCENT[selectedKey]}, transparent)`,
                }} />

                <div className="p-4">
                  {/* 名前・役職 */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-sm font-bold text-slate-100">{selected.name}</h2>
                      <p className="text-[10px] text-slate-500 mt-0.5">{selected.role}</p>
                    </div>
                    <button
                      onClick={() => setSelectedKey(null)}
                      className="text-slate-600 hover:text-slate-300 transition-colors text-xs mt-0.5"
                    >✕</button>
                  </div>

                  {/* ステータス */}
                  <div className="flex items-center gap-2 mb-3 p-2 rounded-lg"
                    style={{ background: "#0e1525" }}>
                    <motion.div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: STATUS_META[selected.status as keyof typeof STATUS_META]?.dot ?? "#475569" }}
                      animate={selected.status === "working" ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    />
                    <span className="text-[11px] text-slate-400">
                      {STATUS_META[selected.status as keyof typeof STATUS_META]?.label ?? selected.status}
                    </span>
                    {selected.last_active && (
                      <span className="text-[10px] text-slate-600 ml-auto">
                        {new Date(selected.last_active).toLocaleTimeString("ja-JP", {
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                    )}
                  </div>

                  {/* 説明 */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {selected.description}
                  </p>

                  {/* 機能タグ */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {selected.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: `${ACCENT[selectedKey]}18`,
                          color: ACCENT[selectedKey],
                          border: `1px solid ${ACCENT[selectedKey]}33`,
                        }}
                      >
                        {cap}
                      </span>
                    ))}
                  </div>

                  {/* 実行ボタン */}
                  <button
                    onClick={handleTrigger}
                    disabled={selected.status === "working"}
                    className="w-full py-2 rounded-lg text-xs font-bold transition-all"
                    style={selected.status !== "working" ? {
                      background: `linear-gradient(135deg, ${ACCENT[selectedKey]}cc, ${ACCENT[selectedKey]}88)`,
                      color: "#fff",
                      boxShadow: `0 4px 14px ${ACCENT[selectedKey]}44`,
                    } : {
                      background: "#1a2235",
                      color: "#475569",
                      cursor: "not-allowed",
                    }}
                  >
                    {selected.status === "working" ? "⏳  作業中..." : "▶  タスクを実行"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl p-4 text-center"
                style={{ background: "#111827", border: "1px dashed #1e2a45" }}
              >
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  エージェントカードを<br />クリックして操作
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* アクティビティフィード */}
          <div className="flex-1 min-h-0">
            <ActivityFeed events={activity} connected={connected} />
          </div>
        </div>
      </div>
    </div>
  );
}
