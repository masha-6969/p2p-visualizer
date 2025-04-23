// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";

let nodeIdCounter = 1;

function generatePeerId() {
  return Math.random().toString(36).substring(2, 8);
}

export default function P2PVisualizer() {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    drawGraph();
  }, [nodes, links]);

  const addNode = () => {
    const newNode = {
      id: nodeIdCounter++,
      peerId: generatePeerId(),
      x: Math.random() * 600,
      y: Math.random() * 400,
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const connectNodes = () => {
    if (nodes.length < 2) return;
    const a = nodes[Math.floor(Math.random() * nodes.length)];
    let b = a;
    while (b.id === a.id) {
      b = nodes[Math.floor(Math.random() * nodes.length)];
    }
    const newLink = { source: a.id, target: b.id };
    setLinks((prev) => [...prev, newLink]);
  };

  const sendMessage = () => {
    if (links.length === 0) return;
    const msgLink = links[Math.floor(Math.random() * links.length)];
    const svg = d3.select(svgRef.current);

    const src = nodes.find((n) => n.id === msgLink.source);
    const tgt = nodes.find((n) => n.id === msgLink.target);

    svg
      .append("circle")
      .attr("r", 5)
      .attr("fill", "red")
      .attr("cx", src.x)
      .attr("cy", src.y)
      .transition()
      .duration(1000)
      .attr("cx", tgt.x)
      .attr("cy", tgt.y)
      .remove();
  };

  const drawGraph = () => {
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", 800)
      .attr("height", 500);

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(400, 250))
      .on("tick", ticked);

    const link = svg
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    const node = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 20)
      .attr("fill", "#4f46e5")
      .call(
        d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    const label = svg
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.peerId)
      .attr("font-size", "12px")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em");

    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      label.attr("x", (d) => d.x).attr("y", (d) => d.y);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">P2P Network Visualizer</h1>
      <div className="flex gap-2 mb-4">
        <Button onClick={addNode}>Add Node</Button>
        <Button onClick={connectNodes}>Connect Nodes</Button>
        <Button onClick={sendMessage}>Send Message</Button>
      </div>
      <svg ref={svgRef} className="border rounded-lg shadow-lg" />
    </div>
  );
}