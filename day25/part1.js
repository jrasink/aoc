const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const parseLine = (s) => {
  const [id, ss] = s.split(': ');
  const connections = ss.split(' ');
  return { id, connections };
};

const parseInput = (s) => {
  const lines = s.split('\n');
  const links = lines.map(parseLine);

  const nodeMap = {};

  const assert = (nodeId) => {
    if (!(nodeId in nodeMap)) {
      const node = { id: nodeId, edges: [] };
      nodeMap[nodeId] = node;
    }
    return nodeMap[nodeId];
  };

  const createEdge = (node1, node2) => ({ id: [node1.id, node2.id].sort().join('-'), to: node2 });

  const edgeExists = (edge, node) => node.edges.reduce((exists, existingEdge) => exists || existingEdge.id === edge.id, false);

  const connect = (node1, node2) => {
    const edge =  createEdge(node1, node2);
    if (!edgeExists(edge, node1)) {
      nodeMap[node1.id].edges.push(edge);
    }
    return edge;
  }

  for (const { id, connections } of links) {
    for (const connectedNodeId of connections) {
      const node1 = assert(id);
      const node2 = assert(connectedNodeId);
      connect(node1, node2);
      connect(node2, node1);
    }
  }

  const nodes = Object.values(nodeMap);

  // const nodes = {
  //   id: 'abc',
  //   edges: [
  //     {
  //       id: 'abc-def',
  //       to: {} // reference node 'def'
  //     }
  //   ]
  // }

  return { nodes, nodeMap };
};

const dumpEdge = (edge) => `| Edge[${edge.id}] to Node[${edge.to.id}]`;
const dumpNode = (node) => `Node[${node.id}]\n${node.edges.map(dumpEdge).join('\n')}`;
const dumpNodes = (nodes) => nodes.map(dumpNode).join('\n\n');

const { nodes, nodeMap } = parseInput(input);

// console.log(dumpNodes(nodes));

// Node[jqt]
// | Edge[jqt-rhn] to Node[rhn]
// | Edge[jqt-xhk] to Node[xhk]
// | Edge[jqt-nvd] to Node[nvd]
// | Edge[jqt-ntq] to Node[ntq]

// Node[rhn]
// | Edge[jqt-rhn] to Node[jqt]
// | Edge[rhn-xhk] to Node[xhk]
// | Edge[bvb-rhn] to Node[bvb]
// | Edge[hfx-rhn] to Node[hfx]

// ...

const findPath = (n, m, exclude = []) => {
  const visitMap = nodes.reduce((map, node) => ({ ...map, [node.id]: { id: node.id, visited: false } }), {});

  let d = 0;
  let ws = [n];

  visitMap[n.id].visited = true;
  visitMap[n.id].distance = 0;
  visitMap[n.id].from = null;

  while (true) {
    // console.log('wave', d);
    // console.log(JSON.stringify(visitMap, null, 4));

    let o = {};

    d += 1;

    for (const w of ws) {
      const validEdges = w.edges.filter((edge) => !exclude.includes(edge.id));
      const unvisitedNeighbourEdges = validEdges.filter((edge) => visitMap[edge.to.id].visited === false);

      for (const edge of unvisitedNeighbourEdges) {
        if (edge.to.id in o) {
          // an earlier edge at this stage already links to the node
        } else {
          o[edge.to.id] = edge.to;
          visitMap[edge.to.id].visited = true;
          visitMap[edge.to.id].distance = d;
          visitMap[edge.to.id].from = w.id;
          visitMap[edge.to.id].through = edge.id;
        }

        if (edge.to === m) {
          // console.log(JSON.stringify(visitMap, null, 4));

          // we have a path from neighbour == m back to n, trace through visitMap "from" links
          let p = m.id;
          const path = [];

          while(true) {
            if (visitMap[p].distance === 0) {
              return path.reverse();
            }
            path.push(visitMap[p].through);
            p = visitMap[p].from;
          }
        }
      };
    }

    ws = Object.values(o);

    if (!ws.length) {
      // no more unvisited neighbours, but no path
      return null;
    }
  }
};

const findDistinctPaths = (n, m) => {
  const exclude = [];
  const paths = [];

  while(true) {
    const path = findPath(n, m, exclude);
    if (!path) {
      return paths;
    }
    paths.push(path);
    exclude.push(...path);
  }
}

const [n, ...ms] = nodes;

let i = 0;

let same = 1; // n itself
let other = 0;

for (const m of ms) {
  i += 1;

  console.log(`checking ${i} of ${ms.length}`);

  const paths = findDistinctPaths(n, m);

  if (paths.length < 3) {
    throw new Error(`!!! ${i}: ${n.id} to ${m.id}, ${paths.length} paths found`);
  }

  if (paths.length === 3) {
    other += 1;
  }

  if (paths.length > 3) {
    same += 1;
  }
}

console.log(`${same} nodes are on the same side as ${n.id}`);
console.log(`${other} nodes are on the opposite side from ${n.id}`);

console.log(same * other);

// 746 nodes are on the same side as ncx
// 781 nodes are on the opposite side from ncx
// 582626
