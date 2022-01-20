import { classNames } from "~/utils/misc";

type InputProps = {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
};
export function Input({
  name,
  placeholder,
  defaultValue,
  className,
  type,
}: InputProps & { type: string }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      autoComplete="off"
      className={classNames("outline-none", className)}
    />
  );
}

export function TextInput({ className, ...props }: InputProps) {
  return (
    <Input
      {...props}
      type="text"
      className={classNames(
        "border-b-2 border-b-white focus:border-b-primary",
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
