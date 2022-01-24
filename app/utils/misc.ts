import { format } from "date-fns";

export function classNames(...names: Array<string | undefined>) {
  const reduced = names.reduce(
    (acc, name) => (name ? `${acc} ${name}` : acc),
    ""
  );
  return reduced || "";
}

export function maxDate(...values: Array<Date>) {
  return values.reduce((max, val) => (val > max ? val : max));
}

export function isEmpty(obj: object) {
  return Object.keys(obj).length === 0;
}

export function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  return format(date, "MMM dd, yyyy h:mm:ss aaa");
}
