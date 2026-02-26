"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface Props {
  value: string; // The string to encode (e.g. total mileage)
}

export default function ReceiptBarcode({ value }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: "CODE128",
        lineColor: "#000",
        background: "transparent",
        width: 1.5,
        height: 40,
        displayValue: false,
      });
    }
  }, [value]);

  return <svg ref={svgRef} className="w-full" />;
}
