import React from "react";
import { classNames } from "~/utils/misc";

type InputProps = {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  onChanged?: (e: React.FocusEvent<HTMLInputElement>) => any;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => any;
  inputKey?: any;
  error?: string;
};
export function Input({
  name,
  placeholder,
  defaultValue,
  className,
  type,
  required,
  value,
  onChange,
  onChanged,
  inputKey,
  onBlur,
}: InputProps & { type: string }) {
  return (
    <input
      key={inputKey}
      onBlur={(e) => {
        onBlur?.(e);
        if (e.target.value !== defaultValue) {
          onChanged?.(e);
        }
      }}
      type={type}
      required={required}
      name={name}
      value={value}
      onChange={onChange}
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
  error,
  ...props
}: InputProps & { showBorder?: boolean }) {
  return (
    <Input
      {...props}
      type="text"
      className={classNames(
        "border-b-2 focus:border-b-primary",
        error
          ? "border-b-red-500"
          : showBorder
          ? "border-b-gray-200"
          : "border-b-white",
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

type TextAreaProps = {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  onChanged?: (e: React.FocusEvent<HTMLTextAreaElement>) => any;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => any;
  className?: string;
  error?: string;
};
export function TextArea({
  error,
  onBlur,
  onChanged,
  ...props
}: TextAreaProps) {
  return (
    <textarea
      {...props}
      onBlur={(e) => {
        onBlur?.(e);
        if (e.target.value !== props.defaultValue) {
          onChanged?.(e);
        }
      }}
      className={classNames(
        "w-full h-56 outline-none rounded-md",
        "border-2 focus:border-primary",
        "focus:p-3 transition-all duration-300 border-white",
        error ? "border-red-500 p-3" : "border-white"
      )}
    />
  );
}

type DynamicTextAreaProps = {
  defaultValue?: string;
  placeholder?: string;
};
export function DynamicTextArea({
  defaultValue,
  placeholder,
}: DynamicTextAreaProps) {
  return (
    <div
      role="textbox"
      contentEditable
      className={classNames(
        "w-full outline-none rounded-md",
        "border-2 border-white focus:border-primary",
        "focus:p-3 transition-all duration-300"
      )}
      dangerouslySetInnerHTML={{
        __html: defaultValue || placeholder || "",
      }}
    />
  );
}
