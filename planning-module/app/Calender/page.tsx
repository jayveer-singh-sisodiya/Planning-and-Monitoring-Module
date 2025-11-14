"use client";

import React, { useEffect, useState } from "react";
import {CalenderFunc} from "./calenderFunc";

interface PlanningRecord {
  Year: string | number;
  ProjectID: string;
  UtilityID: string;
  Circle: string;
  Division: string;
  Section: string;
  Mru: string;
  DeviceType: string;
  StartDate: string;
  TargetDate: string;
  [key: string]: string | number | null;
}

export default function Calender() {
  const [planningData, setPlanningData] = useState<PlanningRecord[]>([]);
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/read-excel");
        if (!response.ok) throw new Error("Failed to fetch data");

        const json = await response.json();
        setPlanningData(json.rows ?? json); // handle both array or object with rows
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Compute min & max dates once data is fetched
  useEffect(() => {
    if (planningData.length === 0) return;

    const startDates = planningData.map((item) => new Date(item.StartDate));
    const targetDates = planningData.map((item) => new Date(item.TargetDate));

    const minStartDate = new Date(
      Math.min(...startDates.map((d) => d.getTime()))
    );
    const maxTargetDate = new Date(
      Math.max(...targetDates.map((d) => d.getTime()))
    );

    const formattedStart = minStartDate.toISOString().split("T")[0];
    const formattedEnd = maxTargetDate.toISOString().split("T")[0];

    console.log("📅 Auto extracted:", { formattedStart, formattedEnd });

    setStart(formattedStart);
    setEnd(formattedEnd);
  }, [planningData]);

  // Wait until both dates are available
  if (!start || !end) {
    return <p>Loading calendar...</p>;
  }

  return <CalenderFunc startDate={start} targetDate={end} />;
}

