"use client";
import React, { useEffect, useState } from "react";

interface WeekInfo {
  year: number;
  week: number;
  startDate: string;
  endDate: string;
  startMonth: string;
  endMonth: string;
  startMonthNumber: number;
  endMonthNumber: number;
  startMonthDays: number;
  endMonthDays: number;
  ifPartial: boolean;
}

interface CalendarFuncProps {
  startDate: string;
  targetDate: string;
}

export const CalenderFunc: React.FC<CalendarFuncProps> = ({
  startDate,
  targetDate,
}: {
  startDate: string;
  targetDate: string;
}) => {
  console.log("Start Date:", startDate);
  console.log("Target Date:", targetDate);

  const [weeks, setWeeks] = useState<WeekInfo[]>([]);
  useEffect(() => {
    if (!startDate || !targetDate) return;

    const minYear = new Date(startDate).getFullYear();
    const maxYear = new Date(targetDate).getFullYear();

    const yearStart = new Date(minYear, 0, 1);
    const yearEnd = new Date(maxYear, 11, 31);
    console.log("date from", startDate, "to", targetDate);
    console.log("Calculating weeks from", yearStart, "to", yearEnd);

    const firstMonday = new Date(yearStart);
    firstMonday.setDate(
      firstMonday.getDate() - ((firstMonday.getDay() + 6) % 7)
    );

    const lastSaturday = new Date(yearEnd);
    lastSaturday.setDate(
      lastSaturday.getDate() + ((6 - lastSaturday.getDay() + 7) % 7)
    );

    const workingDays: Date[] = [];
    for (
      let d = new Date(firstMonday);
      d <= lastSaturday;
      d.setDate(d.getDate() + 1)
    ) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0) {
        workingDays.push(new Date(d));
      }
    }

    const weekData: WeekInfo[] = [];
    const weekTracker: Record<number, number> = {};

    for (let i = 0; i < workingDays.length; i += 6) {
      const weekDays = workingDays.slice(i, i + 6);
      const startDate = weekDays[0];
      const endDate = weekDays[weekDays.length - 1];

      const weekYear = new Date(
        startDate.getTime() + 3 * 24 * 60 * 60 * 1000
      ).getFullYear();

      const currentWeekCount = weekTracker[weekYear] || 0;
      const newWeekCount = currentWeekCount + 1;
      weekTracker[weekYear] = newWeekCount;

      const startMonthNumber = startDate.getMonth() + 1;
      const endMonthNumber = endDate.getMonth() + 1;
      const startMonthDays =
        startMonthNumber === endMonthNumber
          ? 6
          : new Date(startDate.getFullYear(), startMonthNumber, 0).getDate() -
            startDate.getDate() +
            1;
      const endMonthDays =
        startMonthNumber === endMonthNumber ? 0 : endDate.getDate();

      const ifPartial =
        startMonthNumber !== endMonthNumber && endDate.getDate() < 6;

      weekData.push({
        year: weekYear,
        week: newWeekCount,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        startMonth: startDate.toLocaleString("default", { month: "long" }),
        endMonth: endDate.toLocaleString("default", { month: "long" }),
        startMonthNumber,
        endMonthNumber,
        startMonthDays,
        endMonthDays,
        ifPartial,
      });
    }

    setWeeks(weekData);
  }, [startDate, targetDate]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">📅 Dynamic Week Calendar</h2>
      <table className="border text-sm w-full ">
        <thead>
          <tr>
            <th>Year</th>
            <th>Week</th>
            <th>Start</th>
            <th>End</th>
            <th>Start Month</th>
            <th>End Month</th>
            <th>Start Month Days</th>
            <th>End Month Days</th>
            <th>Partial</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {weeks.map((w, i) => (
            <tr key={i} className="border">
              <td className="border">{w.year}</td>
              <td className="border">{w.week}</td>
              <td className="border">{w.startDate}</td>
              <td className="border">{w.endDate}</td>
              <td className="border">{w.startMonth}</td>
              <td className="border">{w.endMonth}</td>
              <td className="border">{w.startMonthDays}</td>
              <td className="border">{w.endMonthDays}</td>
              <td className="border">{w.ifPartial ? "✅" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export function weeksInMonths({
  startDate,
  targetDate,
}: CalendarFuncProps): string[] {
  if (!startDate || !targetDate) return [];

  const startBound = new Date(startDate);
  const endBound = new Date(targetDate);

  // Determine years to generate across
  const minYear = new Date(startDate).getFullYear();
  const maxYear = new Date(targetDate).getFullYear();

  const yearStart = new Date(minYear, 0, 1);
  const yearEnd = new Date(maxYear, 11, 31);

  // Find first Monday before/at Jan 1
  const firstMonday = new Date(yearStart);
  firstMonday.setDate(firstMonday.getDate() - ((firstMonday.getDay() + 6) % 7));

  // Find last Saturday after/at Dec 31
  const lastSaturday = new Date(yearEnd);
  lastSaturday.setDate(
    lastSaturday.getDate() + ((6 - lastSaturday.getDay() + 7) % 7)
  );

  const workingDays: Date[] = [];
  for (
    let d = new Date(firstMonday);
    d <= lastSaturday;
    d.setDate(d.getDate() + 1)
  ) {
    if (d.getDay() !== 0) {
      workingDays.push(new Date(d));
    }
  }

  const weekRecords: {
    year: number;
    week: number;
    startDate: string;
    endDate: string;
  }[] = [];
  const weekTracker: Record<number, number> = {};

  for (let i = 0; i < workingDays.length; i += 6) {
    const weekDays = workingDays.slice(i, i + 6);
    if (weekDays.length === 0) continue;

    const wStart = weekDays[0];
    const wEnd = weekDays[weekDays.length - 1];

    // Determine the correct week year based on mid-week
    const weekYear = new Date(
      wStart.getTime() + 3 * 24 * 60 * 60 * 1000
    ).getFullYear();

    const currentWeekCount = weekTracker[weekYear] || 0;
    const newWeekCount = currentWeekCount + 1;
    weekTracker[weekYear] = newWeekCount;

    weekRecords.push({
      year: weekYear,
      week: newWeekCount,
      startDate: wStart.toISOString().split("T")[0],
      endDate: wEnd.toISOString().split("T")[0],
    });
  }

  const filtered = weekRecords.filter((w) => {
    const wStart = new Date(w.startDate);
    const wEnd = new Date(w.endDate);
    return wEnd >= startBound && wStart <= endBound;
  });

  // Include year in week name
  const weekNames = filtered.map((w) => `${w.year}_Week${w.week}`);

  const uniqueWeekNames = Array.from(new Set(weekNames));

  return uniqueWeekNames;
}
