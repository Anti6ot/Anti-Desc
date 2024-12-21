import { useState } from "react";

export default function useExpandedRow() {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  return { expandedRow, toggleRow };
}
