import React, { useEffect, useRef, useState } from "react";
import { OrgChart } from "d3-org-chart";
import { getAllAdminUsers } from "../../api/getAllAdmins";

const slugify = (s?: string) =>
  (s || "unnamed").toString().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "").toLowerCase();

const Organizations: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAndBuild = async () => {
      try {
        const res = await getAllAdminUsers();
        // API might return { users: [...] } or just [...]
        const admins = (res && (res as any).users) ? (res as any).users : (res as any);
        console.log("raw admins:", admins);

        // filter out super-admin (DOTR is root)
        const filtered = admins.filter(
          (a: any) => a.status?.status === "activated" && a.role !== "super-admin"
        );

        // build coop -> operators -> drivers maps
        const coopMap = new Map<string, any>();

        // Ensure coop nodes exist even if operators/drivers are present but no coop admin
        filtered.forEach((a: any) => {
          const org = a.organization || "Unnamed Coop";
          if (!coopMap.has(org)) {
            coopMap.set(org, {
              organization: org,
              admins: [],
              operators: new Map<string, any>(),
            });
          }
        });

        // collect admins for coops
        filtered.forEach((a: any) => {
          const org = a.organization || "Unnamed Coop";
          const coopEntry = coopMap.get(org);

          if (a.role === "admin-transport-cooperative") {
            coopEntry.admins.push(a);
          }

          if (a.role === "admin-operator") {
            const opUnit = a.operatorUnit || "unnamed-operator";
            if (!coopEntry.operators.has(opUnit)) {
              coopEntry.operators.set(opUnit, { operatorUnit: opUnit, admins: [], drivers: [] });
            }
            coopEntry.operators.get(opUnit).admins.push(a);
          }

          if (a.role === "driver") {
            const opUnit = a.operatorUnit || "unnamed-operator";
            if (!coopEntry.operators.has(opUnit)) {
              coopEntry.operators.set(opUnit, { operatorUnit: opUnit, admins: [], drivers: [] });
            }
            coopEntry.operators.get(opUnit).drivers.push(a);
          }
        });

        // build flat array with parentId links (root -> coop -> operator -> driver)
        const data: any[] = [];
        data.push({
          id: "root",
          parentId: null,
          name: "DOTR",
          title: "Super Admin",
          orgRole: "super-admin",
        });

        coopMap.forEach((coopEntry: any, orgKey: string) => {
          const coopId = `coop-${slugify(orgKey)}`;
          const coopTitle =
            coopEntry.admins.length > 0
              ? coopEntry.admins.map((x: any) => `${x.lastName}, ${x.firstName}`).join(", ")
              : "Coop Admin";

          data.push({
            id: coopId,
            parentId: "root",
            name: coopEntry.organization,
            title: coopTitle,
            orgRole: "admin-transport-cooperative",
          });

          coopEntry.operators.forEach((opEntry: any, opKey: string) => {
            const opId = `op-${slugify(orgKey)}-${slugify(opKey)}`;
            const opTitle =
              opEntry.admins.length > 0
                ? opEntry.admins.map((x: any) => `${x.lastName}, ${x.firstName}`).join(", ")
                : "Operator Admin";

            data.push({
              id: opId,
              parentId: coopId,
              name: opEntry.operatorUnit,
              title: opTitle,
              orgRole: "admin-operator",
            });

            (opEntry.drivers || []).forEach((drv: any) => {
              data.push({
                id: `drv-${drv.uid}`,
                parentId: opId,
                name: `${drv.lastName}, ${drv.firstName}`,
                title: drv.operatorUnit+ "Bus Driver",
                orgRole: "driver",
              });
            });
          });
        });

        console.log("org chart flat data:", data);
        setChartData(data);
      } catch (err) {
        console.error("Failed to fetch admins for org chart:", err);
      }
    };

    fetchAndBuild();
  }, []);

  // render chart when chartData changes
  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (!chartData || chartData.length === 0) {
      // still show root if you want - but we only render when we have data
      // you can choose to always render root even if no admins
      return;
    }

    // clear previous render
    chartContainerRef.current.innerHTML = "";

    const chart = new OrgChart()
      .container(chartContainerRef.current)
      .data(chartData)
      .nodeHeight(() => 120)
      .nodeWidth(() => 260)
      .childrenMargin(() => 40)
      .compactMarginBetween(() => 12)
      .compactMarginPair(() => 60)
      .nodeContent((d: any) => {
        const isRoot = d.data.id === "root";
        return `
          <div style="padding:12px; background:${isRoot ? '#0A2A54' : 'white'}; color:${isRoot ? 'white' : 'black'}; border-radius:8px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); font-family: Inter, system-ui, sans-serif;">
            <div style="display:flex; align-items:center;">
              <div style="margin-right:12px;">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="${isRoot ? 'white' : 'black'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <div>
                <div style="font-weight:700; font-size:15px;">${d.data.name || ""}</div>
                <div style="font-size:12px; opacity:0.9;">${d.data.title || ""}</div>
                <div style="font-size:11px; opacity:0.7;">${d.data.orgRole || ""}</div>
              </div>
            </div>
          </div>
        `;
      })
      .render();

    chartInstanceRef.current = chart;

    // cleanup if component unmounts
    return () => {
      try {
        // remove svg/dom nodes
        if (chartContainerRef.current) chartContainerRef.current.innerHTML = "";
        chartInstanceRef.current = null;
      } catch (e) {
        // ignore
      }
    };
  }, [chartData]);

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
