import cuid from "cuid";
import * as d3 from "d3";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";

let index = 0;

function fetchNodes(n = 5) {
  return d3.range(n).map(() => ({
    id: cuid(),
    i: index++,
    x: 0,
    y: 0,
  }));
}

const RADIUS = 50;

export default function ForceBubblesAlternate({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const forceUpdate = useReducer((c) => c + 1, 0)[1];
  const [nodes, setNodes] = useState(fetchNodes);

  const force = useMemo(() => {
    return d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(1))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
      .force("collision", d3.forceCollide().radius(RADIUS))
      .on("tick", forceUpdate);
  }, [nodes, forceUpdate]);

  useEffect(() => {
    force.alpha(1).restart();
    return () => {
      force.stop();
    };
  }, [force]);

  return (
    <div ref={ref}>
      <button
        onClick={() => {
          setNodes((n) => [...n, { id: cuid(), i: index++, x: 0, y: 0 }]);
        }}
      >
        Add
      </button>
      <button
        onClick={() => {
          setNodes((n) => (n.splice(0, 1), n.slice()));
        }}
      >
        Remove
      </button>
      <svg width={width} height={height}>
        <g id="nodes">
          {nodes.map((n) => (
            <Node key={n.id} data={n} />
          ))}
        </g>
      </svg>
    </div>
  );
}

function Node({
  data,
}: {
  data: { id: string; x: number; y: number; i: number };
}) {
  const ref = useRef<SVGForeignObjectElement | null>(null);

  const color = `rgb(${data.x % 256}, ${data.y % 256}, ${data.i % 256})`;

  return (
    <foreignObject
      id={data.id}
      width={RADIUS}
      height={RADIUS}
      className="node"
      ref={ref}
      x={data.x}
      y={data.y}
    >
      <div
        style={{
          height: "100%",
          borderRadius: "50%",
          backgroundColor: color,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <p>{data.i}</p>
      </div>
    </foreignObject>
  );
}
