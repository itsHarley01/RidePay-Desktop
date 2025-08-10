import React, { useEffect, useRef, useState } from "react";
import { OrgChart } from "d3-org-chart";
import { UserCircle } from "lucide-react";

const staticData = [
  {
    id: "root",
    name: "DOTR SuperAdmin",
    title: "DOTR Root",
    orgRole: "SuperAdmin",
    uid: "dotr-root",
    parentId: null,
  },
  {
    id: "coop-1",
    name: "Alice Admin",
    title: "admin-transport-cooperative",
    orgRole: "Coop Manager",
    uid: "a1",
    parentId: "root",
    organization: "Alpha Coop",
  },
  {
    id: "coop-2",
    name: "Arnold Ace",
    title: "admin-transport-cooperative",
    orgRole: "Coop Manager",
    uid: "a2",
    parentId: "root",
    organization: "Beta Coop",
  },
  {
    id: "op-1",
    name: "Olivia Operator",
    title: "admin-operator",
    orgRole: "Operator",
    uid: "o1",
    parentId: "coop-1",
    organization: "Alpha Coop",
  },
  {
    id: "op-2",
    name: "Oscar Opal",
    title: "admin-operator",
    orgRole: "Operator",
    uid: "o2",
    parentId: "coop-2",
    organization: "Beta Coop",
  },
  {
    id: "dr-1",
    name: "Derek Drive",
    title: "driver",
    orgRole: "Driver",
    uid: "d1",
    parentId: "op-1",
    organization: "Alpha Coop",
  },
  {
    id: "dr-2",
    name: "Dana Dash",
    title: "driver",
    orgRole: "Driver",
    uid: "d2",
    parentId: "op-2",
    organization: "Beta Coop",
  },
];

const Organizations = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = new OrgChart();

      chart
        .container(chartContainerRef.current)
        .data(staticData)
        .nodeHeight(() => 130)
        .nodeWidth(() => 270)
        .childrenMargin(() => 40)
        .compactMarginBetween(() => 15)
        .compactMarginPair(() => 80)
        .nodeContent((d: any) => {
          const isRoot = d.data.id === "root";
          return `
            <div style="padding:15px; background:${isRoot ? '#0077cc' : 'white'}; color:${isRoot ? 'white' : 'black'}; border-radius:8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); font-family:sans-serif;">
              <div style="display:flex; align-items:center;">
                <div style="margin-right:12px;">
                  ${UserCircleIconSvg(36)}
                </div>
                <div>
                  ${
                    d.data.title === "admin-transport-cooperative"
                      ? `
                          <div style="font-weight:bold; font-size:16px;">${d.data.organization || "Unnamed Coop"}</div>
                          <div style="font-size:12px;">${d.data.name}</div>
                          <div style="font-size:11px;">${d.data.orgRole || ""}</div>
                        `
                      : `
                          <div style="font-weight:bold; font-size:16px;">${d.data.name}</div>
                          <div style="font-size:12px;">${d.data.title}</div>
                          <div style="font-size:11px;">${d.data.orgRole || ""}</div>
                        `
                  }
                </div>
              </div>
            </div>
          `;
        })
        .render();

      chartInstanceRef.current = chart;
    }
  }, []);

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => chartInstanceRef.current?.expandAll().render()}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            🔽 Expand All
          </button>
          <button
            onClick={() => chartInstanceRef.current?.collapseAll().render()}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            🔼 Collapse All
          </button>
        </div>
      </div>

      <div ref={chartContainerRef} style={{ height: "600px", width: "100%" }} />
    </div>
  );
};

export default Organizations;

// Lucide Icon Helper
function UserCircleIconSvg(size: number = 24) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-circle">
      <path d="M18 20a6 6 0 0 0-12 0" />
      <circle cx="12" cy="10" r="4" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  `;
}
