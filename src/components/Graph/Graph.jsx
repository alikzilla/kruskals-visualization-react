import React, { useState } from "react";
import Graph from "react-graph-vis";
import styles from "./graph.module.css";

function GraphVisualization() {
  const [graph, setGraph] = useState(generateRandomGraph());

  const optionsGraph = {
    nodes: {
      borderWidth: 1,
    },
    layout: {
      hierarchical: false,
    },
    edges: {
      color: {
        color: "#000000",
      },
      font: {
        size: 14,
      },
      width: 2,
      arrows: {
        to: {
          enabled: false,
        },
      },
    },
    height: "500px",
  };

  const predefinedGraphs = [
    {
      nodes: [
        { id: 1, label: "1" },
        { id: 2, label: "2" },
        { id: 3, label: "3" },
        { id: 4, label: "4" },
        { id: 5, label: "5" },
      ],
      edges: [
        { from: 1, to: 2, label: "3" },
        { from: 1, to: 3, label: "4" },
        { from: 1, to: 4, label: "1" },
        { from: 1, to: 5, label: "5" },
        { from: 2, to: 3, label: "8" },
        { from: 2, to: 4, label: "6" },
        { from: 2, to: 5, label: "9" },
        { from: 3, to: 4, label: "10"},
        { from: 3, to: 5, label: "2" },
        { from: 4, to: 5, label: "13"},
      ],
    },
    {
      nodes: [
        { id: 1, label: "1", x: 0, y: 0 },
        { id: 2, label: "2", x: 1, y: 0 },
        { id: 3, label: "3", x: 2, y: 0 },
        { id: 4, label: "4", x: 0, y: 1 },
        { id: 5, label: "5", x: 1, y: 1 },
        { id: 6, label: "6", x: 2, y: 1 },
        { id: 7, label: "7", x: 1, y: 2 },
      ],
      edges: [
        { from: 1, to: 2, label: "3" },
        { from: 2, to: 3, label: "2" },
        { from: 1, to: 4, label: "1" },
        { from: 2, to: 5, label: "6" },
        { from: 3, to: 6, label: "7" },
        { from: 4, to: 5, label: "4" },
        { from: 5, to: 6, label: "9" },
        { from: 4, to: 7, label: "3" },
        { from: 5, to: 7, label: "10"},
        { from: 6, to: 7, label: "1" },
      ]
    }
  ];

  function generateRandomGraph() {
    const numNodes = Math.floor(Math.random() * 10) + 3;
    const nodes = [];
    for (let i = 1; i <= numNodes; i++) {
      nodes.push({ id: i, label: `${i}`, title: `node ${i} tooltip text` });
    }

    const edges = [];
    const visitedEdges = new Set();

    for (let i = 1; i <= numNodes; i++) {
      const from = i;
      let to;
      do {
        to = Math.floor(Math.random() * numNodes) + 1;
      } while (
        visitedEdges.has(`${from}-${to}`) || visitedEdges.has(`${to}-${from}`)
      );

      visitedEdges.add(`${from}-${to}`);
      visitedEdges.add(`${to}-${from}`);

      const weight = Math.floor(Math.random() * 10) + 1;
      edges.push({ from, to, label: `${weight}`, length: weight * 30 });
      edges.push({ from: to, to: from, label: `${weight}` });
    }

    return { nodes, edges };
  }

  function findMST() {
    computeMSTUsingKruskal(graph, setGraph);
  }

  function computeMSTUsingKruskal(graph, setGraph) {
    const sortedEdges = graph.edges.slice().sort((a, b) => {
      return parseInt(a.label) - parseInt(b.label);
    });

    console.log(sortedEdges.length);

    const mstEdges = [];
    const disjointSets = new Map();
    const processedEdges = new Set();

    for (let node of graph.nodes) {
      disjointSets.set(node.id, node.id);
    }

    function findSet(nodeId) {
      if (disjointSets.get(nodeId) === nodeId) {
        return nodeId;
      }
      return findSet(disjointSets.get(nodeId));
    }

    function union(u, v) {
      const rootU = findSet(u);
      const rootV = findSet(v);

      if (rootU !== rootV) {
        if (rootU < rootV) {
          disjointSets.set(rootV, rootU);
        } else {
          disjointSets.set(rootU, rootV);
        }
      }
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index >= sortedEdges.length) {
        clearInterval(interval);
        console.log("cleared");
        return;
      }

      const edge = sortedEdges[index];

      if (!processedEdges.has(`${edge.from}-${edge.to}`)) {
        setGraph((prevGraph) => ({
          ...prevGraph,
          edges: prevGraph.edges.map((e) => {
            if (e.from === edge.from && e.to === edge.to) {
              return { ...e, color: "blue" };
            }
            return e;
          }),
        }));

        const rootFrom = findSet(edge.from);
        const rootTo = findSet(edge.to);
        if (rootFrom !== rootTo) {
          mstEdges.push(edge);
          union(edge.from, edge.to);
          setTimeout(() => {
            setGraph((prevGraph) => ({
              ...prevGraph,
              edges: prevGraph.edges.map((e) => {
                if (e.from === edge.from && e.to === edge.to) {
                  return { ...e, color: "#00ff0d" };
                }
                return e;
              }),
            }));
          }, 500);
        }
        processedEdges.add(`${edge.from}-${edge.to}`);
        processedEdges.add(`${edge.to}-${edge.from}`);
      }

      console.log(index);
      index++;
    }, 1000);

    console.log(disjointSets);
  }

  function resetGraph() {
    const newGraph = generateRandomGraph();
    setGraph(newGraph);
  }

  function setPredefinedGraph(index) {
    setGraph(predefinedGraphs[index]);
  }

  return (
    <section className={styles.graphVisualization}>
      <div className={styles.wrapper}>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={resetGraph}>
            New Graph
          </button>
          <button className={styles.button} onClick={() => setPredefinedGraph(0)}>
            K5
          </button>
          <button className={styles.button} onClick={() => setPredefinedGraph(1)}>
            Tessellation
          </button>
        </div>
        <div className={styles.graphs}>
          <div className={styles.initialTree}>
            <h1>Initial Tree</h1>
            <section className={styles.graph}>
              <Graph
                graph={graph}
                className={styles.graph}
                options={optionsGraph}
                events={{
                  select: function (event) {
                    console.log("Node selected:", event.nodes);
                  },
                }}
              />
            </section>
          </div>
          <section className={styles.controls}>
            <button className={styles.button} onClick={findMST}>
              Find MST
            </button>
          </section>
        </div>
      </div>
      
      
    </section>
  );
}

export default GraphVisualization;