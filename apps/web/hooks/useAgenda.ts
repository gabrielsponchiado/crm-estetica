"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export type AgendaView = "month" | "week" | "day";

export function useAgenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<AgendaView>("month");

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    const calendarStart = startOfWeek(monthStart, {
      weekStartsOn: 1,
    });

    const calendarEnd = endOfWeek(monthEnd, {
      weekStartsOn: 1,
    });

    const days: Date[] = [];

    let current = calendarStart;

    while (current <= calendarEnd) {
      days.push(current);
      current = addDays(current, 1);
    }

    return days;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, {
      weekStartsOn: 1,
    });

    return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  }, [currentDate]);

  const periodLabel = useMemo(() => {
    if (viewMode === "month") {
      return format(currentDate, "MMMM 'de' yyyy", {
        locale: ptBR,
      });
    }

    if (viewMode === "week") {
      const start = startOfWeek(currentDate, {
        weekStartsOn: 1,
      });

      const end = endOfWeek(currentDate, {
        weekStartsOn: 1,
      });

      if (start.getMonth() === end.getMonth()) {
        return `${format(start, "d")}–${format(end, "d 'de' MMMM 'de' yyyy", {
          locale: ptBR,
        })}`;
      }

      return `${format(start, "d MMM", {
        locale: ptBR,
      })} – ${format(end, "d MMM yyyy", {
        locale: ptBR,
      })}`;
    }

    return format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
  }, [currentDate, viewMode]);

  const goToPrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
      return;
    }

    if (viewMode === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
      return;
    }

    setCurrentDate(subDays(currentDate, 1));
  };

  const goToNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
      return;
    }

    if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
      return;
    }

    setCurrentDate(addDays(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const selectDate = (date: Date) => {
    setCurrentDate(date);
  };

  const isToday = (date: Date) => isSameDay(date, new Date());

  const isCurrentMonth = (date: Date) => isSameMonth(date, currentDate);

  return {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    monthDays,
    weekDays,
    periodLabel,
    goToPrevious,
    goToNext,
    goToToday,
    selectDate,
    isToday,
    isCurrentMonth,
  };
}
