"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Agent } from "@/lib/types";

// ─── 定数 ────────────────────────────────────────────────────────────────
type AgentKey = "ceo" | "accounting" | "dev" | "sales";

const SKIN = "#d4956a";

interface CharStyle {
  hair: string;
  hairStyle: "formal" | "bob" | "spiky" | "swept" | "cap";
  capColor?: string;
  shirt: string;
  pants: string;
  shoes: string;
  tie?: string;
  glasses?: boolean;
  headphones?: boolean;
  headphonesColor?: string;
  watch?: boolean;
  accentColor: string;
  screenColor: string;
}

const STYLES: Record<AgentKey, CharStyle> = {
  ceo: {
    hair: "#1a0f06", hairStyle: "formal",
    shirt: "#1e40af", pants: "#1e3a8a", shoes: "#1c1917",
    tie: "#7c3aed", watch: true,
    accentColor: "#f59e0b", screenColor: "#fbbf24",
  },
  accounting: {
    hair: "#3b1a08", hairStyle: "bob",
    shirt: "#f1f5f9", pants: "#334155", shoes: "#1c1917",
    glasses: true,
    accentColor: "#38bdf8", screenColor: "#38bdf8",
  },
  dev: {
    hair: "#0f0c06", hairStyle: "spiky",
    shirt: "#15803d", pants: "#1e3a5f", shoes: "#111",
    headphones: true, headphonesColor: "#34d399",
    accentColor: "#34d399", screenColor: "#34d399",
  },
  sales: {
    hair: "#7c3317", hairStyle: "cap", capColor: "#1e1b4b",
    shirt: "#7e22ce", pants: "#1f2937", shoes: "#1c1917",
    tie: "#4c1d95",
    accentColor: "#a78bfa", screenColor: "#a78bfa",
  },
};

const ROLE_LABEL: Record<AgentKey, string> = {
  ceo: "CEO", accounting: "経理", dev: "エンジニア", sales: "営業",
};

// ─── 髪型（頭のトップ y=2 をきちんと覆う） ────────────────────────────────
//  頭: <ellipse cx="36" cy="24" rx="22" ry="22" />  →  頂点 y=2, 両端 x=14..58

function Hair({ style, color, capColor }: {
  style: CharStyle["hairStyle"]; color: string; capColor?: string;
}) {
  if (style === "formal") return (
    <g>
      {/* 頭上をすべて覆うキャップ形 */}
      <ellipse cx="36" cy="11" rx="22" ry="11" fill={color} />
      {/* サイドバーン */}
      <rect x="12" y="16" width="9" height="14" rx="3" fill={color} />
      <rect x="51" y="16" width="9" height="14" rx="3" fill={color} />
    </g>
  );

  if (style === "bob") return (
    <g>
      <ellipse cx="36" cy="11" rx="22" ry="11" fill={color} />
      {/* ロングサイド */}
      <rect x="11" y="16" width="10" height="24" rx="4" fill={color} />
      <rect x="51" y="16" width="10" height="24" rx="4" fill={color} />
      {/* 下端 */}
      <rect x="13" y="36" width="46" height="6" rx="3" fill={color} />
    </g>
  );

  if (style === "spiky") return (
    <g>
      <ellipse cx="36" cy="11" rx="22" ry="11" fill={color} />
      {/* スパイク（頭頂より上） */}
      <polygon points="20,4 24,-10 28,4" fill={color} />
      <polygon points="30,2 34,-12 38,2" fill={color} />
      <polygon points="40,4 44,-8 48,4" fill={color} />
      {/* 短いサイド */}
      <rect x="12" y="16" width="8" height="10" rx="2" fill={color} />
      <rect x="52" y="16" width="8" height="10" rx="2" fill={color} />
    </g>
  );

  if (style === "swept") return (
    <g>
      {/* 頭上カバー（右に流れる） */}
      <ellipse cx="37" cy="11" rx="23" ry="11" fill={color} />
      {/* 流れるハイライト部 */}
      <ellipse cx="48" cy="8" rx="12" ry="7" fill={color} />
      {/* サイド */}
      <rect x="12" y="16" width="8" height="12" rx="3" fill={color} />
      <rect x="52" y="16" width="9" height="14" rx="3" fill={color} />
    </g>
  );

  if (style === "cap") return (
    <g>
      {/* キャップの下から見えるサイドの髪 */}
      <rect x="11" y="20" width="9" height="12" rx="3" fill={color} />
      <rect x="52" y="20" width="9" height="12" rx="3" fill={color} />
      {/* キャップ本体（頭頂を完全にカバー） */}
      <ellipse cx="36" cy="11" rx="23" ry="13" fill={capColor ?? "#1e1e2e"} />
      {/* ツバ */}
      <rect x="8" y="21" width="58" height="7" rx="3" fill={capColor ?? "#1e1e2e"} />
    </g>
  );

  return null;
}

// ─── キャラクター SVG ─────────────────────────────────────────────────────

function Character({ charStyle, status, accentColor }: {
  charStyle: CharStyle; status: string; accentColor: string;
}) {
  const isWorking = status === "working";
  const isError   = status === "error";

  return (
    <svg viewBox="0 0 72 128" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* 影 */}
      <ellipse cx="36" cy="126" rx="22" ry="4"
        fill="#000" opacity={0.18} />

      {/* 靴 */}
      <rect x="16" y="108" width="15" height="9" rx="4" fill={charStyle.shoes} />
      <rect x="41" y="108" width="15" height="9" rx="4" fill={charStyle.shoes} />

      {/* 脚 */}
      <rect x="18" y="76" width="13" height="36" rx="5" fill={charStyle.pants} />
      <rect x="41" y="76" width="13" height="36" rx="5" fill={charStyle.pants} />

      {/* 胴体 */}
      <rect x="13" y="48" width="46" height="34" rx="9" fill={charStyle.shirt} />

      {/* ネクタイ */}
      {charStyle.tie && (
        <polygon points="36,53 33,65 36,69 39,65" fill={charStyle.tie} />
      )}

      {/* 左腕 */}
      <motion.g
        animate={isWorking
          ? { rotate: [-10, 5, -10], y: [0, -4, 0] }
          : { rotate: 0, y: 0 }}
        transition={{ repeat: Infinity, duration: 0.55, ease: "easeInOut" }}
        style={{ originX: "11px", originY: "52px" }}
      >
        <rect x="3" y="50" width="12" height="25" rx="5" fill={charStyle.shirt} />
        <circle cx="9" cy="79" r="6" fill={SKIN} />
        {charStyle.watch && (
          <rect x="5" y="72" width="8" height="5" rx="1.5" fill="#c8a84b" />
        )}
      </motion.g>

      {/* 右腕 */}
      <motion.g
        animate={isWorking
          ? { rotate: [10, -5, 10], y: [0, -4, 0] }
          : { rotate: 0, y: 0 }}
        transition={{ repeat: Infinity, duration: 0.55, ease: "easeInOut", delay: 0.28 }}
        style={{ originX: "61px", originY: "52px" }}
      >
        <rect x="57" y="50" width="12" height="25" rx="5" fill={charStyle.shirt} />
        <circle cx="63" cy="79" r="6" fill={SKIN} />
      </motion.g>

      {/* 首 */}
      <rect x="30" y="40" width="12" height="12" rx="5" fill={SKIN} />

      {/* 頭（先に描いて髪で上書き） */}
      <ellipse cx="36" cy="24" rx="22" ry="22" fill={SKIN} />

      {/* 白目 */}
      <ellipse cx="27" cy="24" rx="4" ry="4.5" fill="white" />
      <ellipse cx="45" cy="24" rx="4" ry="4.5" fill="white" />

      {/* 瞳 */}
      <circle cx={isWorking ? 28 : 27} cy="24.5" r="2.4" fill="#1a0e08" />
      <circle cx={isWorking ? 46 : 45} cy="24.5" r="2.4" fill="#1a0e08" />
      {/* ハイライト */}
      <circle cx={isWorking ? 29 : 28} cy="23" r="0.9" fill="white" opacity="0.9" />
      <circle cx={isWorking ? 47 : 46} cy="23" r="0.9" fill="white" opacity="0.9" />

      {/* 眉 */}
      <path
        d={isError ? "M22,15 Q27,18 32,15" : "M22,15 Q27,12 32,15"}
        stroke={charStyle.hair} strokeWidth="2.2" fill="none" strokeLinecap="round"
      />
      <path
        d={isError ? "M40,15 Q45,18 50,15" : "M40,15 Q45,12 50,15"}
        stroke={charStyle.hair} strokeWidth="2.2" fill="none" strokeLinecap="round"
      />

      {/* 口 */}
      <path
        d={isError
          ? "M28,34 Q36,30 44,34"
          : isWorking ? "M28,32 Q36,37 44,32"
          : "M29,32 Q36,36 43,32"}
        stroke="#b5613c" strokeWidth="2" fill="none" strokeLinecap="round"
      />

      {/* 頬 */}
      <ellipse cx="18" cy="29" rx="5" ry="3.5" fill="#e0735a" opacity="0.2" />
      <ellipse cx="54" cy="29" rx="5" ry="3.5" fill="#e0735a" opacity="0.2" />

      {/* メガネ */}
      {charStyle.glasses && (
        <g fill="none" stroke="#475569" strokeWidth="1.6">
          <rect x="19" y="19" width="14" height="11" rx="4" />
          <rect x="39" y="19" width="14" height="11" rx="4" />
          <line x1="33" y1="24" x2="39" y2="24" />
          <line x1="13" y1="24" x2="19" y2="24" />
          <line x1="53" y1="24" x2="59" y2="24" />
        </g>
      )}

      {/* ヘッドフォン（髪より前に描く → 後で上書きされないよう最後に） */}
      {charStyle.headphones && (
        <g>
          <path d="M13,24 Q13,1 36,1 Q59,1 59,24"
            fill="none" stroke={charStyle.headphonesColor} strokeWidth="4.5" strokeLinecap="round" />
          <rect x="9" y="18" width="9" height="13" rx="3.5" fill={charStyle.headphonesColor} />
          <rect x="54" y="18" width="9" height="13" rx="3.5" fill={charStyle.headphonesColor} />
        </g>
      )}

      {/* 髪（最後に描くことで頭皮を完全に覆う） */}
      <Hair style={charStyle.hairStyle} color={charStyle.hair} capColor={charStyle.capColor} />
    </svg>
  );
}

// ─── モニター SVG ──────────────────────────────────────────────────────────

function Monitor({ accentColor }: { accentColor: string }) {
  return (
    <svg viewBox="0 0 120 80" width="100%">
      {/* スタンドベース */}
      <rect x="48" y="73" width="24" height="5" rx="2.5" fill="#374151" />
      {/* スタンド支柱 */}
      <rect x="57" y="60" width="6" height="16" rx="2" fill="#374151" />
      {/* 本体 */}
      <rect x="8" y="8" width="104" height="56" rx="6" fill="#1e2535" />
      {/* ベゼル内側 */}
      <rect x="12" y="12" width="96" height="48" rx="4" fill="#111827" />
      {/* 画面発光 */}
      <rect x="14" y="14" width="92" height="44" rx="3" fill={accentColor} opacity="0.12" />
      {/* UI要素（コード/グラフ風の線） */}
      {[18, 24, 30].map((y, i) => (
        <rect key={i} x="18" y={y} width={[60, 80, 45][i]} height="3" rx="1.5"
          fill={accentColor} opacity={[0.5, 0.3, 0.4][i]} />
      ))}
      <rect x="18" y="38" width="92" height="1" fill={accentColor} opacity="0.2" />
      {[18, 30, 46, 62, 78].map((x, i) => (
        <rect key={i} x={x} y="42" width="8" height={[10, 15, 8, 12, 6][i]} rx="1"
          fill={accentColor} opacity="0.4" />
      ))}
      {/* 電源ランプ */}
      <circle cx="60" cy="70" r="2" fill={accentColor} opacity="0.8" />
    </svg>
  );
}

// ─── デスクカード ─────────────────────────────────────────────────────────

function DeskCard({ charStyle, agent, label, isSelected, onSelect, agentKey }: {
  charStyle: CharStyle;
  agent: Agent;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  agentKey: string;
}) {
  const { accentColor } = charStyle;
  const isWorking = agent.status === "working";
  const isError   = agent.status === "error";

  const statusColor = isWorking ? "#34d399" : isError ? "#f87171" : "#475569";
  const statusLabel = isWorking ? "作業中" : isError ? "エラー" : "待機中";

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="relative cursor-pointer flex flex-col rounded-2xl overflow-hidden select-none"
      style={{
        background: "linear-gradient(160deg, #1e2740 0%, #1a2236 100%)",
        border: isSelected
          ? `1.5px solid ${accentColor}`
          : "1.5px solid #2a3555",
        boxShadow: isSelected
          ? `0 0 0 1px ${accentColor}33, 0 8px 32px ${accentColor}22, 0 2px 8px #00000044`
          : "0 2px 12px #00000033",
      }}
    >
      {/* 天井からの間接光（アクセントカラー） */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}88, transparent)` }}
      />

      {/* モニター */}
      <div className="px-4 pt-4 pb-1">
        <Monitor accentColor={accentColor} />
      </div>

      {/* デスク天板 */}
      <div
        className="mx-3 mb-0 rounded-t-lg"
        style={{
          height: 10,
          background: "linear-gradient(180deg, #2d3a52 0%, #243044 100%)",
          boxShadow: `0 -2px 12px ${accentColor}18`,
        }}
      />

      {/* キーボード */}
      <div className="mx-5 mb-1">
        <div
          className="h-2 rounded"
          style={{ background: "#1a2235", border: "1px solid #2a3555" }}
        />
      </div>

      {/* キャラクター */}
      <div className="flex justify-center pb-1" style={{ marginTop: "-4px" }}>
        <motion.div
          className="w-16 h-[88px]"
          animate={isWorking
            ? { y: [0, -3, 0] }
            : isError
            ? { rotate: [-2, 2, -2] }
            : { y: [0, -2, 0] }}
          transition={{
            repeat: Infinity,
            duration: isWorking ? 0.55 : 3,
            ease: "easeInOut",
          }}
        >
          <Character charStyle={charStyle} status={agent.status} accentColor={accentColor} />
        </motion.div>
      </div>

      {/* 下部情報バー */}
      <div
        className="flex items-center justify-between px-3 py-2 mt-auto"
        style={{ background: "#141c2e", borderTop: "1px solid #2a3555" }}
      >
        <span className="text-xs font-bold text-slate-200">{label}</span>
        <div className="flex items-center gap-1.5">
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: statusColor }}
            animate={isWorking ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <span className="text-[10px] font-medium" style={{ color: statusColor }}>
            {statusLabel}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── フロアライン装飾 ─────────────────────────────────────────────────────

function OfficeSectionLabel({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3">
      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${accent}44)` }} />
      <span className="text-[11px] font-semibold tracking-widest uppercase"
        style={{ color: accent, textShadow: `0 0 12px ${accent}88` }}>
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${accent}44, transparent)` }} />
    </div>
  );
}

// ─── メインコンポーネント ─────────────────────────────────────────────────

export function Office2D({
  agents,
  selectedKey,
  onSelect,
}: {
  agents: Record<string, Agent>;
  selectedKey: string | null;
  onSelect: (key: string) => void;
}) {
  const agentOrder = ["ceo", "accounting", "dev", "sales"] as AgentKey[];

  return (
    <div className="w-full h-full flex flex-col overflow-auto"
      style={{ background: "linear-gradient(180deg, #0e1525 0%, #111827 60%, #0e1525 100%)" }}>

      {/* 天井の間接照明帯 */}
      <div className="shrink-0 h-1.5 w-full"
        style={{ background: "linear-gradient(90deg, #f59e0b22, #38bdf833, #a78bfa22, #34d39922, #f59e0b22)" }} />

      {/* 壁面（間接照明グロー） */}
      <div className="relative shrink-0 flex items-center justify-center"
        style={{ height: 64, background: "linear-gradient(180deg, #141e35 0%, transparent 100%)" }}>
        {/* 左右の壁照明 */}
        <div className="absolute left-0 top-0 w-2 h-full"
          style={{ background: "linear-gradient(90deg, #f59e0b18, transparent)" }} />
        <div className="absolute right-0 top-0 w-2 h-full"
          style={{ background: "linear-gradient(270deg, #a78bfa18, transparent)" }} />
        {/* 中央にオフィス名 */}
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-slate-500">Virtual Office</p>
        </div>
      </div>

      {/* セクションラベル */}
      <OfficeSectionLabel label="Agent Floor" accent="#38bdf8" />

      {/* エージェントグリッド */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-5 px-6 pb-6 pt-2">
        {agentOrder.map((key) =>
          agents[key] ? (
            <DeskCard
              key={key}
              agentKey={key}
              charStyle={STYLES[key]}
              agent={agents[key]}
              label={ROLE_LABEL[key]}
              isSelected={selectedKey === key}
              onSelect={() => onSelect(key)}
            />
          ) : null
        )}
      </div>

      {/* フロアライン */}
      <div className="shrink-0 h-px mx-6 mb-4"
        style={{ background: "linear-gradient(90deg, transparent, #2a3555, transparent)" }} />
    </div>
  );
}
