"use client";

import React, { useState } from "react";
import { RoleGraphData, GraphNode, GraphEdge } from "@/types/career";

interface EvidenceGraphViewProps {
  graphData: RoleGraphData;
}

export function EvidenceGraphView({ graphData }: EvidenceGraphViewProps) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const { nodes, edges } = graphData;

  const getNodeColor = (node: GraphNode) => {
    if (node.type === "role") return "bg-blue-600 text-white border-blue-700 shadow-xs";
    if (node.type === "category") return "bg-slate-100 text-slate-800 border-slate-300";
    if (node.evidence_status === "strong_evidence") return "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs";
    if (node.evidence_status === "developing") return "bg-amber-50 text-amber-900 border-amber-300 shadow-xs";
    if (node.evidence_status === "critical_gap") return "bg-rose-50 text-rose-900 border-rose-300 shadow-xs";
    return "bg-white text-slate-800 border-slate-200 shadow-xs";
  };

  const getStatusBadge = (status?: string) => {
    if (status === "strong_evidence") return <span className="text-[10px] text-emerald-800 font-bold">Strong Evidence ✓</span>;
    if (status === "developing") return <span className="text-[10px] text-amber-800 font-bold">Developing Tier ⏳</span>;
    if (status === "critical_gap") return <span className="text-[10px] text-rose-700 font-bold">Critical Deficit ⚠️</span>;
    return <span className="text-[10px] text-slate-500 font-medium">Target Standard</span>;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-700 mb-2">
            Skill &amp; Evidence Knowledge Graph
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Role DNA &amp; Evidence Network
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Visualizes prerequisites, cross-skill synergies, and real job-market co-occurrence edges (15,841 jobs).
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex-wrap shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-700 font-medium">Strong</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-700 font-medium">Developing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-700 font-medium">Critical Gap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-slate-700 font-medium">Target Role</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Network Visual Container */}
        <div className="lg:col-span-2 bg-slate-50/70 border border-slate-200 rounded-xl p-5 min-h-[360px] flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="text-center pb-3 border-b border-slate-200">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                Graph Representation: {nodes.length} Nodes • {edges.length} Directed Relationships
              </span>
            </div>

            {/* Structured Interactive Node Clusters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nodes.map((n) => {
                const isSelected = selectedNode?.id === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNode(n)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${getNodeColor(n)} ${
                      isSelected ? "ring-2 ring-blue-500 scale-[1.02] shadow-md" : "hover:scale-[1.01]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider opacity-75 font-semibold">
                        {n.type}
                      </span>
                      {getStatusBadge(n.evidence_status)}
                    </div>
                    <div className="font-bold text-xs truncate">{n.label}</div>
                    {n.confidence !== undefined && n.confidence > 0 && (
                      <div className="text-[10px] opacity-75 mt-1 font-mono font-medium">
                        Conf: {(n.confidence * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between flex-wrap gap-2">
            <span>Click any node to inspect relationship edges and target standards.</span>
            <span className="font-mono text-blue-700 font-semibold">{graphData.provenance}</span>
          </div>
        </div>

        {/* Selected Node Inspector Drawer */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Node Inspector
          </h4>

          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <span className="text-base font-extrabold text-slate-900 block">
                  {selectedNode.label}
                </span>
                <span className="text-xs text-blue-700 font-mono font-medium">
                  Type: {selectedNode.type}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 text-xs shadow-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Evidence Status:</span>
                  <div className="mt-0.5">{getStatusBadge(selectedNode.evidence_status)}</div>
                </div>

                {selectedNode.evidence_tier && (
                  <div>
                    <span className="text-slate-500 block text-[11px]">Detected Tier:</span>
                    <span className="font-mono text-slate-800 text-[11px] uppercase font-bold">
                      {selectedNode.evidence_tier}
                    </span>
                  </div>
                )}

                {selectedNode.confidence !== undefined && (
                  <div>
                    <span className="text-slate-500 block text-[11px]">Aggregated Confidence:</span>
                    <span className="font-mono text-blue-700 text-[11px] font-bold">
                      {(selectedNode.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Connected Relationships */}
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-600 block mb-2">
                  Connected Graph Edges
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {edges
                    .filter(
                      (e) =>
                        e.source === selectedNode.id ||
                        e.target === selectedNode.id ||
                        e.source.includes(selectedNode.label.toLowerCase()) ||
                        e.target.includes(selectedNode.label.toLowerCase())
                    )
                    .map((e, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 shadow-xs"
                      >
                        <span className="font-mono font-bold text-blue-700">{e.relationship}</span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {e.source.replace("skill_", "").replace("cat_", "").replace("role_", "")} → {e.target.replace("skill_", "").replace("cat_", "")}
                          {e.weight && ` (Weight: ${e.weight})`}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              <p>Select any node in the graph above to view connected edges, prerequisites, and artifact expectations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
