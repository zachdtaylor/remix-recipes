import { classNames } from "~/utils/misc";

type InputProps = {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
};
export function Input({
  name,
  placeholder,
  defaultValue,
  className,
  type,
  required,
}: InputProps & { type: string }) {
  return (
    <input
      type={type}
      required={required}
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      autoComplete="off"
      className={classNames("outline-none", className)}
    />
  );
}

export function TextInput({
  className,
  showBorder,
  ...props
}: InputProps & { showBorder?: boolean }) {
  return (
    <Input
      {...props}
      type="text"
      className={classNames(
        "border-b-2 focus:border-b-primary",
        showBorder ? "border-b-gray-200" : "border-b-white",
        className
      )}
    />
  );
}

export function EmailInput({ className, ...props }: InputProps) {
  return (
    <Input
      {...props}
      type="email"
      className={classNames(
        "border-2 border-gray-200 focus:border-primary rounded-md p-2",
        className
      )}
    />
  );
}
