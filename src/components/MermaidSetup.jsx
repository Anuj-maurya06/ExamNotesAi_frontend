 import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
});

const quoteMermaidLabel = (label) => {
  const trimmed = label.trim();
  if (/^(".*"|'.*')$/.test(trimmed)) return trimmed;

  const needsQuote = /\||\"|\<|\>|\[|\]|\{|\}|\(|\)|\:/.test(trimmed);
  if (!needsQuote) return trimmed;

  const escaped = trimmed
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\\"')
    .replace(/\|/g, "\\|");

  return `"${escaped}"`;
};

const wrapMermaidLabels = (diagram) => {
  let cleaned = diagram;

  cleaned = cleaned.replace(/([A-Za-z0-9_]+)\{([^}]*)\}/g, (_, id, label) => {
    return `${id}{${quoteMermaidLabel(label)}}`;
  });

  cleaned = cleaned.replace(/([A-Za-z0-9_]+)\[([^\]]*)\]/g, (_, id, label) => {
    return `${id}[${quoteMermaidLabel(label)}]`;
  });

  cleaned = cleaned.replace(/([A-Za-z0-9_]+)\(([^)]*)\)/g, (_, id, label) => {
    return `${id}(${quoteMermaidLabel(label)})`;
  });

  return cleaned;
};

const cleanMermaidDiagram = (diagram) => {
  if (!diagram) return "";

  let clean = diagram
    .replace(/\r\n/g, "\n")
    .trim();

  if (!clean.startsWith("graph")) {
    clean = `graph TD\n${clean}`;
  }

  clean = wrapMermaidLabels(clean);
  return clean;
};

const autoFixBadNodes = (diagram) => {
  let index = 0;

  return diagram.replace(/\[(.*?)\]/g, (_, label) => {
    index++;
    return `N${index}[${quoteMermaidLabel(label)}]`;
  });
};

function MermaidSetup({ diagram }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!diagram || !containerRef.current) return;

    const renderDiagram = async () => {
      try {
        containerRef.current.innerHTML = "";

        const uniqueId = `mermaid-${Math.random()
          .toString(36)
          .substring(2, 9)}`;

        const safeChart = cleanMermaidDiagram(diagram);

        const { svg } = await mermaid.render(
          uniqueId,
          safeChart
        );

        containerRef.current.innerHTML = svg;
      } catch (error) {
        console.error("Mermaid render failed:", error);

        // Try a more defensive cleanup if the first render fails
        try {
          const fallbackId = `mermaid-${Math.random()
            .toString(36)
            .substring(2, 9)}`;
          const fallbackChart = autoFixBadNodes(cleanMermaidDiagram(diagram));
          const { svg: fallbackSvg } = await mermaid.render(
            fallbackId,
            fallbackChart
          );
          containerRef.current.innerHTML = fallbackSvg;
        } catch (fallbackError) {
          console.error("Mermaid fallback render failed:", fallbackError);
          containerRef.current.innerHTML = `<pre class='text-xs text-red-600'>Unable to render diagram. Please try again.</pre>`;
        }
      }
    };

    renderDiagram();
  }, [diagram]);

  return (
    <div className="bg-white border rounded-lg p-4 overflow-x-auto">
      <div ref={containerRef}></div>
    </div>
  );
}

export default MermaidSetup;