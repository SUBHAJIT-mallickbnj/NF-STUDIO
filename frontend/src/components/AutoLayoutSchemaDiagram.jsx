import React, { useMemo } from "react";
import dagre from "dagre";

export default function AutoLayoutSchemaDiagram({ tables = [], relationships = [] }) {
  const { nodes, edges, graphWidth, graphHeight } = useMemo(() => {
    const g = new dagre.graphlib.Graph();
    // Using a vertical Top-to-Bottom layout or crisp Left-to-Right layout safely bounded
    g.setGraph({ rankdir: "LR", nodesep: 40, ranksep: 80 });
    g.setDefaultEdgeLabel(() => ({}));

    tables.forEach((table) => {
      g.setNode(table.name, { label: table.name, width: 120, height: 60 });
    });

    relationships.forEach((rel) => {
      g.setEdge(rel.from, rel.to);
    });

    dagre.layout(g);

    // Capture the maximum absolute graph dimensions calculated by dagre
    const graphInfo = g.graph();

    return {
      nodes: g.nodes().map((v) => ({ ...g.node(v), id: v })),
      edges: g.edges().map((e) => ({ from: e.v, to: e.w })),
      graphWidth: graphInfo.width || 500,
      graphHeight: graphInfo.height || 400,
    };
  }, [tables, relationships]);

  return (
    <section className="py-10 sm:py-16 bg-gray-50 w-full overflow-hidden">
      <div className="container mx-auto px-4">
        
        <motion.h2
          className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Schema Diagram
        </motion.h2>

        {/* Swipe indicator helper token displayed only on mobile viewports */}
        <p className="text-center text-[11px] text-gray-400 mb-4 sm:hidden flex items-center justify-center gap-1">
          <i className="fas fa-arrows-alt-h animate-pulse"></i> Swipe or pan horizontally to explore schema relations
        </p>

        {/* Parent viewport window container with native mobile touch momentum scrolling */}
        <div className="relative bg-white border border-gray-200 rounded-xl shadow-md p-3 sm:p-6 overflow-auto touch-pan-x touch-pan-y" style={{ height: "450px" }}>
          
          {/* Inner Explicit Canvas Box sized perfectly to match total Dagre output graph dimensions */}
          <div 
            className="relative"
            style={{ 
              width: `${graphWidth + 60}px`, 
              height: `${graphHeight + 60}px`,
              minWidth: "100%" 
            }}
          >
            {/* Nodes layer container */}
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                className="absolute bg-blue-50 border border-blue-300 rounded-xl px-3 py-2 text-xs font-bold text-blue-800 text-center shadow-sm flex items-center justify-center z-20 select-none"
                style={{
                  // Offset coordinate centers precisely based on node radiuses
                  left: `${node.x - node.width / 2 + 20}px`,
                  top: `${node.y - node.height / 2 + 20}px`,
                  width: `${node.width}px`,
                  height: `${node.height}px`,
                }}
                whileHover={{ scale: 1.04 }}
              >
                <div className="truncate w-full">
                  <i className="fas fa-table mr-1 text-[10px] text-blue-400"></i>
                  {node.label}
                </div>
              </motion.div>
            ))}

            {/* SVG Relationship Vector Layer (Matches explicit inner canvas dimension map boundaries) */}
            <svg 
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
              style={{
                width: `${graphWidth + 60}px`,
                height: `${graphHeight + 60}px`
              }}
            >
              {edges.map((edge, i) => {
                const fromNode = nodes.find((n) => n.id === edge.from);
                const toNode = nodes.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                return (
                  <line
                    key={i}
                    x1={fromNode.x + 20}
                    y1={fromNode.y + 20}
                    x2={toNode.x + 20}
                    y2={toNode.y + 20}
                    stroke="#4B5563"
                    strokeWidth="1.5"
                    markerEnd="url(#schema-arrowhead)"
                  />
                );
              })}
              <defs>
                <marker
                  id="schema-arrowhead"
                  markerWidth="8"
                  markerHeight="8"
                  refX="14" // Push marker back slightly to clear the node corner radii boundaries smoothly
                  refY="2.5"
                  orient="auto"
                >
                  <path d="M0,0 L5,2.5 L0,5 Z" fill="#4B5563" />
                </marker>
              </defs>
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
}