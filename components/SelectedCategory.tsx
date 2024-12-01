"use client";

import { categoryItems } from "@/lib/categoryItems";
import { Card, CardHeader } from "./ui/card";
import Image from "next/image";
import { useState } from "react";

export function SelectedCategory() {
  const [SelectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-8 mt-10  mx-auto w-[90%] md:w-3/5 mb-36">
      <input
        type="hidden"
        name="categoryName"
        value={SelectedCategory as string}
      />

      {categoryItems.map((item) => {
        return (
          <div key={item.id} className="cursor-pointer">
            <Card
              className={SelectedCategory === item.name ? "border-primary" : ""}
              onClick={() => setSelectedCategory(item.name)}
            >
              <CardHeader>
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <h3 className="font-medium">{item.title}</h3>
              </CardHeader>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
