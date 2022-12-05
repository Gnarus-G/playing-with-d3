import * as d3 from "d3";
import cuid from "cuid";
import { useState } from "react";

let index = 0;
function fetchNodes(n = 5) {
  return d3.range(n).map(() => ({
    id: cuid(),
    i: index++,
    x: 0,
    y: 0,
  }));
}

export default function useNodes() {
  const [nodes, setNodes] = useState(fetchNodes);

  const add = () => {
    setNodes((n) => [...n, { id: cuid(), i: index++, x: 0, y: 0 }]);
  };

  const remove = () => {
    setNodes((n) => (n.splice(0, 1), n.slice()));
  };

  return {
    nodes,
    add,
    remove,
  };
}

export function useNodesWithResettingOperations() {
  const [nodes, setNodes] = useState(fetchNodes);

  const add = () => {
    return setNodes((n) => fetchNodes(n.length + 1));
  };

  const remove = () => {
    return setNodes((n) => fetchNodes(n.length - 1));
  };

  return {
    nodes,
    add,
    remove,
  };
}
