import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import { useNodesWithResettingOperations } from "./useNodes";

const RADIUS = 50;

export default function ForceBubbles({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const { nodes, add, remove } = useNodesWithResettingOperations();

  const ref = useRef<HTMLDivElement | null>(null);

  const ticked = () => {
    d3.select(ref.current)
      .select("svg > g#nodes")
      .selectAll(".node")
      .call((s) =>
        // @ts-ignore
        s.attr("x", (d) => d?.x ?? 0).attr("y", (d) => d?.y ?? 0)
      );
  };

  const f = useMemo(() => {
    return d3
      .forceSimulation()
      .force("charge", d3.forceManyBody().strength(1))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
      .force("collision", d3.forceCollide().radius(RADIUS))
      .velocityDecay(0.75)
      .alphaDecay(0.006)
      .on("tick", ticked);
  }, []);

  useEffect(() => {
    f.nodes(nodes).alpha(1).restart();
    return () => {
      f.stop();
    };
  }, [nodes]);

  return (
    <div ref={ref}>
      <button onClick={add}>Add</button>
      <button onClick={remove}>Remove</button>
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

  useEffect(() => {
    if (ref.current) {
      d3.select(ref.current).datum(data);
    }
  }, [data]);

  const color = `rgb(${data.x % 256}, ${data.y % 256}, ${data.i % 256})`;

  return (
    <foreignObject width={RADIUS} height={RADIUS} className="node" ref={ref}>
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
