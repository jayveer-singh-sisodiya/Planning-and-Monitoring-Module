"use client";

import * as React from "react";
import { Button } from "@/app/Component/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/Component/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/Component/ui/accordion";

type Filters = {
  year: string | number;
  project: string;
  utility: string;
  circle: string;
  division: string;
  section: string;
  mru: string;
  deviceType: string;
};

interface PlanningRecord {
  Year: string | number;
  ProjectID: string;
  UtilityID: string;
  Circle: string;
  Division: string;
  Section: string;
  Mru: string;
  DeviceType: string;
  [key: string]: string | number | null;
}

export function Filter({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) {
  const { year, project, utility, circle, division, section, mru, deviceType } =
    filters;

  const [planningData, setPlanningData] = React.useState<PlanningRecord[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/read-excel");
        const data = await response.json();
        setPlanningData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Return early while loading
  if (loading) return <p className="p-4">Loading data...</p>;
  if (planningData.length === 0) return <p className="p-4">No data found.</p>;

  // 🔹 Reset filters
  const clearFilters = () => {
    setFilters({
      year: "",
      project: "",
      utility: "",
      circle: "",
      division: "",
      section: "",
      mru: "",
      deviceType: "",
    });
  };

  // 🔹 Dropdown options (dynamically derived)
  const years = [...new Set(planningData.map((l) => String(l.Year)))];
  const projects = [...new Set(planningData.map((l) => l.ProjectID))];
  const utilities = [
    ...new Set(
      planningData
        .filter(
          (l) =>
            (!project || l.ProjectID === project) &&
            (!year || String(l.Year) === String(year))
        )
        .map((l) => l.UtilityID)
    ),
  ];
  const circles = [
    ...new Set(
      planningData
        .filter(
          (l) =>
            (!utility || l.UtilityID === utility) &&
            (!project || l.ProjectID === project) &&
            (!year || String(l.Year) === String(year))
        )
        .map((l) => l.Circle)
    ),
  ];
  const divisions = [
    ...new Set(
      planningData
        .filter(
          (l) =>
            (!circle || l.Circle === circle) &&
            (!utility || l.UtilityID === utility) &&
            (!project || l.ProjectID === project) &&
            (!year || String(l.Year) === String(year))
        )
        .map((l) => l.Division)
    ),
  ];
  const sections = [
    ...new Set(
      planningData
        .filter(
          (l) =>
            (!division || l.Division === division) &&
            (!circle || l.Circle === circle) &&
            (!utility || l.UtilityID === utility) &&
            (!project || l.ProjectID === project) &&
            (!year || String(l.Year) === String(year))
        )
        .map((l) => l.Section)
    ),
  ];
  const mrus = [
    ...new Set(
      planningData
        .filter(
          (l) =>
            (!section || l.Section === section) &&
            (!division || l.Division === division) &&
            (!circle || l.Circle === circle) &&
            (!utility || l.UtilityID === utility) &&
            (!project || l.ProjectID === project) &&
            (!year || String(l.Year) === String(year))
        )
        .map((l) => l.Mru)
    ),
  ];
  const deviceTypes = [
    ...new Set(
      planningData
        .filter(
          (l) =>
            (!mru || l.Mru === mru) &&
            (!section || l.Section === section) &&
            (!division || l.Division === division) &&
            (!circle || l.Circle === circle) &&
            (!utility || l.UtilityID === utility) &&
            (!project || l.ProjectID === project) &&
            (!year || String(l.Year) === String(year))
        )
        .map((l) => l.DeviceType)
    ),
  ];

  // 🔹 Reusable dropdown
  const Dropdown = ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
    options: (string | number)[];
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value || `Select ${label}`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-72 overflow-y-auto">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => onChange(v === value ? "" : v)}
        >
          {options.map((opt) => (
            <DropdownMenuRadioItem key={opt} value={opt}>
              {opt}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Accordion
      type="single"
      collapsible
      className="p-4 w-full border border-rounded-md"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:no-under flex items-center gap-1">
          Filter
        </AccordionTrigger>
        <AccordionContent className="border-t">
          <div className="p-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Dropdown
              label="Year"
              value={year}
              onChange={(v) => setFilters((p) => ({ ...p, year: v }))}
              options={years}
            />
            <Dropdown
              label="Project"
              value={project}
              onChange={(v) => setFilters((p) => ({ ...p, project: v }))}
              options={projects}
            />
            <Dropdown
              label="Utility"
              value={utility}
              onChange={(v) => setFilters((p) => ({ ...p, utility: v }))}
              options={utilities}
            />
            <Dropdown
              label="Circle"
              value={circle}
              onChange={(v) => setFilters((p) => ({ ...p, circle: v }))}
              options={circles}
            />
          </div>

          <div className="p-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Dropdown
              label="Division"
              value={division}
              onChange={(v) => setFilters((p) => ({ ...p, division: v }))}
              options={divisions}
            />
            <Dropdown
              label="Section"
              value={section}
              onChange={(v) => setFilters((p) => ({ ...p, section: v }))}
              options={sections}
            />
            <Dropdown
              label="MRU"
              value={mru}
              onChange={(v) => setFilters((p) => ({ ...p, mru: v }))}
              options={mrus}
            />
            <Dropdown
              label="Device Type"
              value={deviceType}
              onChange={(v) => setFilters((p) => ({ ...p, deviceType: v }))}
              options={deviceTypes}
            />
          </div>
        </AccordionContent>
        {year ||
        project ||
        utility ||
        circle ||
        division ||
        section ||
        mru ||
        deviceType ? (
          <div className="px-4 mt-2 mb-4 border-t pt-4 flex justify-between items-center">
            <span
              className="truncate w-full text-sm"
              title={`Selected: ${year || "–"} → ${project || "–"} → ${
                utility || "–"
              } → ${circle || "–"} → ${division || "–"} → ${section || "–"} → ${
                mru || "–"
              } → ${deviceType || "–"}`}
            >
              <strong>Selected:</strong> {year || "–"} → {project || "–"} →{" "}
              {utility || "–"} → {circle || "–"} → {division || "–"} →{" "}
              {section || "–"} → {mru || "–"} → {deviceType || "–"}
            </span>

            <div className="p-4 flex justify-end">
              <Button variant="destructive" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </div>
        ) : null}
      </AccordionItem>
    </Accordion>
  );
}
