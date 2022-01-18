import { classNames } from "~/utils/misc";

type TextInputProps = {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
};
export function TextInput({
  name,
  placeholder,
  defaultValue,
  className,
}: TextInputProps) {
  return (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      autoComplete="off"
      className={classNames(
        "outline-none border-b-2 border-b-white focus:border-b-primary",
        className
      )}
    />
  );
}
