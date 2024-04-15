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

  function generateRandomGraph() {
    const numNodes = Math.floor(Math.random() * 10) + 3; // Random number of nodes between 5 and 14
    const nodes = [];
    for (let i = 1; i <= numNodes; i++) {
      nodes.push({ id: i, label: `${i}`, title: `node ${i} tooltip text` });
    }

    const edges = [];
    const visitedEdges = new Set(); // Keep track of visited edges

    for (let i = 1; i <= numNodes; i++) {
      const from = i;
      let to;
      do {
        to = Math.floor(Math.random() * numNodes) + 1;
      } while (
        to === from ||
        visitedEdges.has(`${from}-${to}`) ||
        visitedEdges.has(`${to}-${from}`)
      );

      visitedEdges.add(`${from}-${to}`);
      visitedEdges.add(`${to}-${from}`);

      const weight = Math.floor(Math.random() * 10) + 1; // Random weight between 1 and 10
      edges.push({ from, to, label: `${weight}`, length: weight * 30 }); // Adding edge from A to B
      edges.push({ from: to, to: from, label: `${weight}` }); // Adding edge from B to A (undirected)
    }

    return { nodes, edges };
  }

  function findMST() {
    computeMSTUsingKruskal(graph, setGraph); // Pass setGraph
  }

  function computeMSTUsingKruskal(graph, setGraph) {
    const sortedEdges = graph.edges.slice().sort((a, b) => {
      return parseInt(a.label) - parseInt(b.label); // Sort edges by weight
    });

    console.log(sortedEdges.length)

    const mstEdges = [];
    const disjointSets = new Map();
    const processedEdges = new Set(); // Keep track of processed edges

    // Initialize disjoint sets
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
        console.log("cleared")
        return;
      }

      const edge = sortedEdges[index];

      // Check if the edge has been processed already
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

      console.log(index)
      index++;
    }, 1000);

  }

  function resetGraph() {
    const newGraph = generateRandomGraph();
    setGraph(newGraph);
  }

  return (
    <section className={styles.graphVisualization}>
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
      </div>
      <section className={styles.controls}>
        <button className={styles.button} onClick={resetGraph}>
          New Graph
        </button>
        <button className={styles.button} onClick={findMST}>
          Find MST
        </button>
      </section>
    </section>
  );
}

export default GraphVisualization;
