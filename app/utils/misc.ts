import { format } from "date-fns";
import React from "react";
import { useMatches } from "remix";

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

let hydrating = true;
export function useHydrated() {
  const [hydrated, setHydrated] = React.useState(() => !hydrating);

  React.useEffect(() => {
    hydrating = false;
    setHydrated(true);
  }, []);

  return hydrated;
}

export function randomImage() {
  const images = [
    "/images/alfredo-pasta.jpeg",
    "/images/generic-food-pic.jpeg",
    "/images/cookies.jpeg",
    "/images/pancakes.jpeg",
    "/images/chocolate-chili.jpeg",
  ];
  const index = Math.floor(Math.random() * images.length);
  return images[index];
}

export function useFocusOnce(condition: boolean) {
  const ref = React.useRef<HTMLInputElement>(null);
  const [focusCalled, setFocusCalled] = React.useState(false);

  React.useEffect(() => {
    if (condition && !focusCalled) {
      ref.current?.focus();
      setFocusCalled(true);
    }
  }, [ref.current, focusCalled]);

  return ref;
}

export function useForm(initialValues: { [key: string]: any }) {
  const [values, setValues] = React.useState(initialValues);

  const setValue = (name: string, value: any) => {
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const ifChanged = (name: string, callback: () => void) => {
    if (values[name] !== initialValues[name]) {
      callback();
    }
  };

  const reset = () => setValues(initialValues);

  return { values, setValue, ifChanged, reset };
}

export function useShouldHydrate() {
  const matches = useMatches();
  return !matches.some((match) => match.handle?.hydrate === false);
}

type OptimisticItem = {
  id: string;
  name: string;
};
export function useOptimisticItems<T extends OptimisticItem>(
  items: Array<T>,
  sort?: (a: T, b: T) => number
) {
  const [optimisticItems, setOptimisticItems] = React.useState<Array<T>>([]);

  const renderedItems: Array<T> = [...items];
  const savedIds = new Set(items.map((item) => item.id));
  for (let item of optimisticItems) {
    if (!savedIds.has(item.id)) {
      renderedItems.push(item);
    }
  }
  if (typeof sort !== "undefined") {
    renderedItems.sort(sort);
  }

  const optimisticIds = new Set(optimisticItems.map((item) => item.id));
  let intersection = new Set([...savedIds].filter((x) => optimisticIds.has(x)));
  if (intersection.size) {
    setOptimisticItems(
      optimisticItems.filter((item) => !intersection.has(item.id))
    );
  }

  const addItem = (item: T) => {
    setOptimisticItems((items) => [...items, item]);
  };

  return { renderedItems, addItem };
}

export function useRouteData<T>(routeId: string) {
  const matches = useMatches();
  const matched = matches.find((match) => match.id === routeId);
  if (typeof matched === "undefined") {
    return null;
  }
  return matched.data as T;
}

export function daysOfTheWeek() {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
}

export function getToday() {
  const date = new Date();
  return daysOfTheWeek()[date.getDay()];
}

export function capitalize(value: string) {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}
