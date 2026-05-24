"use client";

import * as React from "react";
import Image from "next/image";
import type { CatalogItem } from "@/data/procurement-catalog";
import { procurementItemImagePath } from "@/data/procurement-catalog";
import { AddToRfqButton } from "./rfq/AddToRfqButton";

interface ProductListProps {
  items: CatalogItem[];
  color: string;
  categoryId: string;
  categoryTitleEs: string;
  categoryTitleEn: string;
}

export function ProductList({ items, color, categoryId, categoryTitleEs, categoryTitleEn }: ProductListProps) {
  return (
    <div className="flex flex-col gap-0 px-4 pb-4">
      {items.map((item) => (
        <ProductRow
          key={item.id}
          item={item}
          color={color}
          categoryId={categoryId}
          categoryTitleEs={categoryTitleEs}
          categoryTitleEn={categoryTitleEn}
        />
      ))}
    </div>
  );
}

function ProductRow({
  item,
  color,
  categoryId,
  categoryTitleEs,
  categoryTitleEn,
}: {
  item: CatalogItem;
  color: string;
  categoryId: string;
  categoryTitleEs: string;
  categoryTitleEn: string;
}) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const imageSrc = item.image ?? procurementItemImagePath(item);
  const showImage = !!imageSrc && !imgFailed;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-sm bg-navy/40 border border-cream/5 mb-1.5">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Thumbnail */}
        <div
          className="relative shrink-0 h-16 w-16 rounded-sm overflow-hidden border border-cream/10 bg-cream/5"
          style={{ borderColor: `${color}33` }}
        >
          {showImage ? (
            <Image
              src={imageSrc}
              alt={item.name}
              fill
              sizes="64px"
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-serif text-2xl select-none"
                style={{ color: `${color}80` }}
              >
                {item.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Color dot + name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="mt-[1px] h-1.5 w-1.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-[13px] text-cream/80 leading-snug">{item.name}</span>
        </div>
      </div>

      <AddToRfqButton
        item={item}
        categoryId={categoryId}
        categoryTitleEs={categoryTitleEs}
        categoryTitleEn={categoryTitleEn}
        color={color}
      />
    </div>
  );
}
