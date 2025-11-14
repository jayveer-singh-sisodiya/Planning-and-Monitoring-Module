"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { weeksInMonths } from "@/components/Calender/calenderFunc";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Period = "Month" | "Week" | "Quarter";

export default function PlanningTable({ filters }: { filters: Filters }) {
  // =================== STATES ===================
  const [planningData, setPlanningData] = useState<PlanningRecord[]>([]);
  const [originalData, setOriginalData] = useState<PlanningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<Period>("Month");
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  const [editablePeriods, setEditablePeriods] = useState<EditablePeriods>({
    editableMonths: [],
    startDate: "",
    targetDate: "",
  });
  const [weeks, setWeeks] = useState<string[]>([]);

  // =================== UPDATE HISTORY ===================
  const [updateHistory, setUpdateHistory] = useState<
    {
      UniqueKey: string | number | null;
      key: string;
      oldValue: string | number | null;
      newValue: string | number | null;
      baselineCount: number;
      timestamp: string;
    }[]
  >([]);
  const [updatedFields, setUpdatedFields] = useState<
    { UniqueKey: string | number | null; key: string; isUpdated: boolean }[]
  >([]);

  const [latestUpdates, setLatestUpdates] = useState<
    {
      UniqueKey: string | number | null;
      key: string;
      oldValue: string | number | null;
      newValue: string | number | null;
      baselineCount: number;
      timestamp: string;
    }[]
  >([]);

  // =================== FETCH DATA ===================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/read-excel");
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();
        setPlanningData(json.rows ?? json);
        setOriginalData(json.rows ?? json);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =================== EDITABLE PERIOD CALC ===================
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const nextMonth = (currentMonth % 12) + 1;

    const editableMonths: string[] = [];
    for (let i = 0; i < 4; i++) {
      const monthNum = ((nextMonth + i - 1) % 12) + 1;
      const yearOffset = Math.floor((nextMonth + i - 1) / 12);
      const year = currentYear + yearOffset;
      editableMonths.push(`${year}_Month${monthNum}`);
    }

    const firstMonthNum = nextMonth;
    const lastMonthNum = ((nextMonth + 3 - 1) % 12) + 1;

    const firstMonthYear =
      firstMonthNum >= currentMonth ? currentYear : currentYear + 1;
    const lastMonthYear =
      lastMonthNum >= nextMonth ? firstMonthYear : firstMonthYear + 1;

    const startDateObj = new Date(firstMonthYear, firstMonthNum - 1, 1);
    const targetDateObj = new Date(lastMonthYear, lastMonthNum, 0);

    const localYMD = (d: Date) => d.toISOString().split("T")[0];
    const startDate = localYMD(startDateObj);
    const targetDate = localYMD(targetDateObj);

    setEditablePeriods({ editableMonths, startDate, targetDate });
  }, []);

  // =================== CALCULATE WEEKS ===================
  useEffect(() => {
    if (editablePeriods.startDate && editablePeriods.targetDate) {
      const weekList = weeksInMonths({
        startDate: editablePeriods.startDate,
        targetDate: editablePeriods.targetDate,
      });
      setWeeks(weekList);
    }
  }, [editablePeriods.startDate, editablePeriods.targetDate]);

  // =================== HANDLE UPDATES ===================

  const handleUpdate = () => {
    if (updatedFields.length === 0) {
      console.log("No updates detected.");
      return;
    }

    const newHistoryEntries: typeof updateHistory = [];

    updatedFields.forEach(({ UniqueKey, key }) => {
      const updatedRow = planningData.find((r) => r.UniqueKey === UniqueKey);
      const originalRow = originalData.find((r) => r.UniqueKey === UniqueKey);

      if (!updatedRow || !originalRow) return;

      const oldValue = originalRow[key];
      const newValue = updatedRow[key];
      if (oldValue === newValue) return;

      const prevUpdates = updateHistory.filter(
        (h) => h.UniqueKey === UniqueKey && h.key === key
      );

      const baselineCount = prevUpdates.length + 1;

      if (baselineCount > 4) {
        console.warn(
          `⛔ Cannot update more than 4 times → UniqueKey: ${UniqueKey}, Field: ${key}`
        );
        return;
      }

      // push into list
      newHistoryEntries.push({
        UniqueKey,
        key,
        oldValue,
        newValue,
        baselineCount,
        timestamp: new Date().toLocaleString(),
      });
    });

    setLatestUpdates((prev) => {
      const filtered = prev.filter(
        (item) =>
          !newHistoryEntries.some(
            (h) => h.UniqueKey === item.UniqueKey && h.key === item.key
          )
      );

      const updated = [...filtered, ...newHistoryEntries];
      console.table(updated);
      return updated;
    });

    if (newHistoryEntries.length > 0) {
      setUpdateHistory((prev) => [...prev, ...newHistoryEntries]);
      console.table(newHistoryEntries);
    } else {
      console.log("No new changes found.");
    }

    setUpdatedFields([]);
  };

  const handelRemainingValues = useCallback(
    (UniqueKey: string | number | null) => {
      const updatedRow = planningData.find((r) => r.UniqueKey === UniqueKey);
      const totalCount = updatedRow ? Number(updatedRow.Count) : 0;

      const totalChanges = latestUpdates
        .filter((h) => h.UniqueKey === UniqueKey)
        .reduce((sum, h) => sum + Number(h.newValue || 0), 0);

      const remainingCount = totalCount - totalChanges;

      console.log(
        `Total Changes: ${totalChanges} for UniqueKey: ${UniqueKey}, totalCount: ${totalCount}, remainingCount: ${remainingCount}`
      );
    },
    [planningData, latestUpdates]
  );

  useEffect(() => {
    if (latestUpdates.length === 0) return;
    const uniqueKeys = [...new Set(latestUpdates.map((u) => u.UniqueKey))];
    uniqueKeys.forEach((key) => handelRemainingValues(key));
  }, [latestUpdates, handelRemainingValues]);

  // =================== FILTERS ===================
  const handleChange = (
    uniqueKey: string | number | null,
    key: string,
    newValue: string | number
  ) => {
    setPlanningData((prev) =>
      prev.map((row) =>
        row.UniqueKey === uniqueKey ? { ...row, [key]: newValue } : row
      )
    );
  };
   const recordUpdatedField = (
    uniqueKey: string | number | null,
    key: string
  ) => {
    setUpdatedFields((prev) => {
      // avoid duplicates
      const alreadyExists = prev.some(
        (f) => f.UniqueKey === uniqueKey && f.key === key
      );
      if (alreadyExists) return prev;

      return [...prev, { UniqueKey: uniqueKey, key, isUpdated: true }];
    });
  };

  const filteredByFilters = planningData.filter((row) => {
    return (
      (!filters.year || String(row.Year) === filters.year) &&
      (!filters.project || row.ProjectID === filters.project) &&
      (!filters.utility || row.UtilityID === filters.utility) &&
      (!filters.circle || row.Circle === filters.circle) &&
      (!filters.division || row.Division === filters.division) &&
      (!filters.section || row.Section === filters.section) &&
      (!filters.mru || row.Mru === filters.mru) &&
      (!filters.deviceType || row.DeviceType === filters.deviceType)
    );
  });

  const filteredData = filteredByFilters.map((row) => {
    const filteredRow: Record<string, string | number | null> = {};
    META_COLUMNS.forEach((col) => (filteredRow[col] = row[col]));

    Object.keys(row).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (
        (view === "Month" && lowerKey.startsWith("month")) ||
        (view === "Week" && lowerKey.startsWith("week")) ||
        (view === "Quarter" && lowerKey.startsWith("quarter"))
      ) {
        filteredRow[key] = row[key];
      }
    });
    return filteredRow;
  });

  const displayData = filteredData.filter(
    (row) =>
      String(row.Circle ?? "")
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      String(row.SubDivision ?? "")
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      String(row.Mru ?? "")
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      String(row.GAA7 ?? "")
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      String(row.Year ?? "")
        .toLowerCase()
        .includes(filterText.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(displayData.length / rowsPerPage);
  const paginatedData = displayData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (loading) {
    return <p className="text-center text-gray-500">Loading data...</p>;
  }

  // =================== RENDER ===================
  return (
    <div className="flex flex-col gap-4">
      {/* Search & View Switch */}
      <div className="flex justify-between items-center mx-4 mt-4">
        <div className="mr-4 relative w-full">
          <Input
            placeholder="Search for Year or Circle/SubDivision/Mru/GAA lvl7..."
            value={filterText}
            name="Search"
            id="Search"
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
            className="pr-10"
          />
          {filterText && (
            <button
              onClick={() => setFilterText("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex gap-6 items-center">
          {(["Month", "Week", "Quarter"] as Period[]).map((v) => (
            <label key={v} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="view"
                value={v}
                checked={view === v}
                onChange={() => setView(v)}
                className="accent-blue-500"
              />
              {v}
            </label>
          ))}
        </div>
      </div>

      {/* Editable Period Info */}
      <div className="border mx-4 p-3 rounded-md text-sm">
        <p>
          <strong>Editable Months:</strong>{" "}
          {editablePeriods.editableMonths.join(", ")}
        </p>
        <p>
          <strong>Weeks in Range:</strong> {weeks.join(", ")}
        </p>
        <p>
          <strong>Start Date:</strong> {editablePeriods.startDate} |{" "}
          <strong>Target Date:</strong> {editablePeriods.targetDate}
        </p>
      </div>

      {/* Data Table */}
      <div className="overflow-auto max-h-[75vh] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Object.keys(paginatedData[0] ?? {})
                .filter(
                  (key) =>
                    key !== "UniqueKey" &&
                    key !== "MonthsLeft" &&
                    key !== "WeeksLeft"
                )
                .map((key) => (
                  <TableHead className="text-center border p-4" key={key}>
                    <strong className="text-md">{key}</strong>
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow key={row.UniqueKey}>
                  {Object.entries(row)
                    .filter(
                      ([key]) =>
                        key !== "UniqueKey" &&
                        key !== "MonthsLeft" &&
                        key !== "WeeksLeft"
                    )
                    .map(([key, value]) => {
                      const lowerKey = key.toLowerCase();
                      const rowYear = String(row.Year);
                      let isEditable = false;

                      if (key === "Year") {
                        isEditable = false;
                      } else if (
                        view === "Month" &&
                        lowerKey.startsWith("month")
                      ) {
                        const fullKey = `${rowYear}_${key}`;
                        isEditable =
                          editablePeriods.editableMonths.includes(fullKey);
                      } else if (
                        view === "Week" &&
                        lowerKey.startsWith("week")
                      ) {
                        const fullKey = `${rowYear}_${key}`;
                        isEditable = weeks.includes(fullKey);
                      } else if (
                        view === "Quarter" &&
                        lowerKey.startsWith("quarter")
                      ) {
                        const fullKey = `${rowYear}_${key}`;
                        isEditable =
                          editablePeriods.editableMonths.includes(fullKey);
                      }

                      return (
                        <TableCell
                          key={key}
                          className="border text-center hover:bg-gray-900"
                        >
                          {isEditable ? (
                            <input
                              type="text"
                              className="w-full border rounded px-1 dark:text-blue-300 text-blue-600 focus:ring-blue-300 text-center p-1"
                              value={value ?? ""}
                              id={`input-${row.UniqueKey}-${key}`}
                              name={`input-${row.UniqueKey}-${key}`}
                              onChange={(e) => {
                                handleChange(
                                  row.UniqueKey,
                                  key,
                                  e.target.value
                                );
                                recordUpdatedField(row.UniqueKey, key);
                              }}
                            />
                          ) : (
                            <span className="fontColor dark:text-gray-100 text-gray-700">
                              {value ?? ""}
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={Object.keys(filteredData[0] ?? {}).length}
                  className="text-center py-4"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-end">
          <Button variant="outline" onClick={handleUpdate}>
            Update
          </Button>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-2 mx-4">
        <p className="text-sm">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Update History Table */}
      <div className="table">
        <h2 className="text-lg font-semibold mb-2">Update History</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">UniqueKey</th>
              <th className="border p-2">Field</th>
              <th className="border p-2">Old Value</th>
              <th className="border p-2">New Value</th>
              <th className="border p-2">Baseline Count</th>
              <th className="border p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {updateHistory.map((entry, index) => (
              <tr key={index}>
                <td className="border p-2">{entry.UniqueKey}</td>
                <td className="border p-2">{entry.key}</td>
                <td className="border p-2">{entry.oldValue}</td>
                <td className="border p-2">{entry.newValue}</td>
                <td className="border p-2">{entry.baselineCount}</td>
                <td className="border p-2">{entry.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const META_COLUMNS = [
  "Circle",
  "Division",
  "SubDivision",
  "Section",
  "Mru",
  "GAA6",
  "GAA7",
  "StartDate",
  "TargetDate",
  "Count",
  "UniqueKey",
  "Year",
] as const;

type Filters = {
  year?: string | number;
  project?: string;
  utility?: string;
  circle?: string;
  division?: string;
  section?: string;
  mru?: string;
  deviceType?: string;
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
  StartDate: string;
  TargetDate: string;
  UniqueKey: string | number | null;
  [key: string]: string | number | null;
}

interface EditablePeriods {
  editableMonths: string[];
  startDate: string;
  targetDate: string;
}
