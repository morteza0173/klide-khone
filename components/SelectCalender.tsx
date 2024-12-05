"use client";

import React, { useEffect, useState } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import highlightWeekends from "react-multi-date-picker/plugins/highlight_weekends";
import { ResevetionSubmiteButton } from "./SubmiteButton";
import { Button } from "./ui/button";
import Link from "next/link";
import { CalendarRange, CalendarRangeIcon, CreditCard } from "lucide-react";

export default function SelectCalender({
  resevation,
  price,
  userId,
}: {
  resevation:
    | {
        startDate: Date;
        endDate: Date;
      }[]
    | undefined;
  price: number;
  userId: string | undefined;
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
  const [days, setDays] = useState(0);

  useEffect(() => {
    if (values && values[0] && values[1]) {
      const startDate = new Date(values[0].toDate());
      const endDate = new Date(values[1].toDate());

      // محاسبه تعداد روزها
      const differenceInTime = endDate.getTime() - startDate.getTime();
      const totalDays = differenceInTime / (1000 * 60 * 60 * 24); // تبدیل میلی‌ثانیه به روز
      setDays(totalDays + 1);
    } else {
      setDays(0); // اگر تاریخ ناقص بود، تعداد روزها را صفر کنید
    }
  }, [values]);

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
    <div>
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

              const isRangeReserved = isDateInRange(
                start.format(),
                end.format()
              );

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
      <div className="mt-4">
        <div className="flex items-center">
          <CreditCard className="w-4 h-4 ml-2" />
          <p>
            {price.toLocaleString("Fa")} تومان{" "}
            <span className="text-xs text-muted-foreground">به ازای هر شب</span>
          </p>
        </div>
        <div>
          {values.length === 0 ? (
            <div className="text-sm flex">
              <CalendarRange className="w-4 h-4 ml-2" />
              <p>یک بازه زمانی برای رزو خانه انتخاب کنید</p>
            </div>
          ) : (
            <div>
              <div className="text-sm flex">
                <CalendarRangeIcon className="w-4 h-4 ml-2" />
                <p>{days} شب انتخاب شد</p>
              </div>
              <div>
                <p>
                  هزینه {days} شب برای این خانه{" "}
                  {(price * days).toLocaleString("fa")} تومان میشود
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {userId ? (
        <div>
          <ResevetionSubmiteButton values={values} />
        </div>
      ) : (
        <Button className="w-full mt-4" asChild>
          <Link href="/api/auth/login">برای رزرو کردن وارد شوید</Link>
        </Button>
      )}
    </div>
  );
}
