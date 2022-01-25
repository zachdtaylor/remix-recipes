import { format } from "date-fns";
import React from "react";

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

export function useMounted() {
  const mounted = React.useRef(false);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted.current;
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
  const [formValues, setFormValues] = React.useState(initialValues);

  const setValue = (name: string, value: any) => {
    setFormValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const ifChanged = (name: string, callback: () => void) => {
    if (formValues[name] !== initialValues[name]) {
      callback();
    }
  };

  return { formValues, setValue, ifChanged };
}
