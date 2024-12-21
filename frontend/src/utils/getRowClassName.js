export default function getRowClassName(prt) {
  if (prt === "low") return "table-secondary";
  if (prt === "medium") return "table-info";
  if (prt === "high") return "table-warning";
  return "table-light";
}
