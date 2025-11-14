"use client";

import React, { useState } from "react";
import { Filter } from "./Filter";
import { useMenuStore } from "../../store/toggel-menu";
import PlanningTable from "./Grid";

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

export default function Layout() {
  const { isOpen } = useMenuStore();

  // Filter state
  const [filters, setFilters] = useState<Filters>({
    year: "",
    project: "",
    utility: "",
    circle: "",
    division: "",
    section: "",
    mru: "",
    deviceType: "",
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Filters */}
      <Filter filters={filters} setFilters={setFilters}  />

      {/* Table wrapper */}
      <div
        style={{ width: isOpen ? "93vw" : "85vw" }}
        className="border rounded transition-all duration-300 "
      >
        <PlanningTable filters={filters} />
      </div>
    </div>
  );
}
