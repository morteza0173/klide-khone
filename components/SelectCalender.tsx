"use client";

import React, { useEffect, useState } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import highlightWeekends from "react-multi-date-picker/plugins/highlight_weekends";

export default function SelectCalender({
  resevation,
}: {
  resevation:
    | {
        startDate: Date;
        endDate: Date;
      }[]
    | undefined;
}) {
  const [reserved, setReserved] = useState<string[][]>();

  useEffect(() => {
    if (resevation) {
      const formattedDates = resevation.map((res) => [
        new DateObject({
          date: res.startDate,
          calendar: persian,
          locale: persian_fa,
        }).format(),
        new DateObject({
          date: res.endDate,
          calendar: persian,
          locale: persian_fa,
        }).format(),
      ]);

      // حالا آرایه‌ها را درون آرایه‌ای دیگر قرار می‌دهیم
      const nestedFormattedDates = formattedDates.map((dateRange) => [
        dateRange[0],
        dateRange[1],
      ]);

      setReserved(nestedFormattedDates);
      console.log(nestedFormattedDates);
    }
  }, [resevation]);

  let initialValue: DateObject[] = [];
  if (reserved) {
    initialValue = reserved.flatMap(([startDate, endDate]) => [
      new DateObject({
        date: startDate,
        calendar: persian,
        locale: persian_fa,
      }),
      new DateObject({
        date: endDate,
        calendar: persian,
        locale: persian_fa,
      }),
    ]);
  }
  function isReserved(strDate: string) {
    return reserved?.some(
      ([startDate, endDate]) => strDate >= startDate && strDate <= endDate
    );
  }

  const [values, setValues] = useState<DateObject[]>(initialValue);

  const startDate =
    values && values[0]
      ? new Date(values[0].toDate().getTime()).toISOString()
      : "";
  const endDate =
    values && values[1]
      ? new Date(values[1].toDate().getTime()).toISOString()
      : "";

  console.log(values);

  function isDateInRange(start: string, end: string) {
    // بررسی می‌کنیم که آیا تاریخ شروع یا پایان انتخابی در تاریخ‌های رزرو شده قرار دارد یا خیر
    return reserved?.some(
      ([reservedStart, reservedEnd]) =>
        (start >= reservedStart && start <= reservedEnd) ||
        (end >= reservedStart && end <= reservedEnd) ||
        (start <= reservedStart && end >= reservedEnd)
    );
  }

  return (
    <div className="flex items-center justify-center">
      <input type="hidden" name="startDate" value={startDate as string} />
      <input type="hidden" name="endDate" value={endDate as string} />
      <Calendar
        className="red"
        calendar={persian}
        locale={persian_fa}
        multiple={false}
        minDate={Date.now()}
        range={true}
        value={values}
        onChange={(ranges) => {
          if (Array.isArray(ranges) && ranges.length === 2) {
            const [start, end] = ranges;

            const isRangeReserved = isDateInRange(start.format(), end.format());

            if (!isRangeReserved) {
              setValues(ranges);
            } else {
              setValues([]);
            }
          }
        }}
        mapDays={({ date }) => {
          let className = "";
          const strDate = date.format();

          // بررسی اینکه تاریخ در لیست رزرو شده باشد
          if (isReserved(strDate)) className = "reserved";

          return {
            className,
            disabled: isReserved(strDate), // غیرفعال کردن تاریخ‌های رزرو شده
          };
        }}
        plugins={[
          <DatePanel
            key={1}
            position={"left"}
            sort="date"
            eachDaysInRange={true}
            removeButton={false}
          />,
          highlightWeekends(),
        ]}
      />
    </div>
  );
}
