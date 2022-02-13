import React from "react";
import { Form, Link, useSearchParams, useTransition } from "remix";
import { classNames } from "~/utils/misc";
import { CheckIcon, LoadingIcon, SearchIcon } from "./icons";

type InputProps = {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
  value?: any;
  form?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  onChanged?: (e: React.FocusEvent<HTMLInputElement>) => any;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => any;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => any;
  inputKey?: any;
  error?: string;
  disabled?: boolean;
  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
};
export function Input({
  className,
  onChanged,
  onBlur,
  onEnter,
  inputKey,
  inputRef,
  defaultValue,
  ...props
}: InputProps & { type: string }) {
  return (
    <input
      {...props}
      ref={inputRef}
      key={inputKey}
      onBlur={(e) => {
        onBlur?.(e);
        if (e.target.value !== defaultValue) {
          onChanged?.(e);
        }
      }}
      defaultValue={defaultValue}
      autoComplete="off"
      className={classNames("outline-none", className)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onEnter?.(e);
        }
      }}
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
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => any;
  onChanged?: (e: React.FocusEvent<HTMLTextAreaElement>) => any;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => any;
  className?: string;
  error?: string;
  form?: string;
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

type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  type?: "submit" | "button" | "reset";
  name?: string;
  value?: string;
  disabled?: boolean;
  form?: string;
};
function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames("px-3 py-2 rounded-md text-center", className)}
    >
      {children}
    </button>
  );
}

export function DeleteButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={classNames(
        "border-2 border-red-600",
        "hover:bg-red-600 hover:text-white",
        props.disabled ? "bg-red-600 text-white" : "text-red-600",
        className
      )}
    >
      {children}
    </Button>
  );
}

export function PrimaryButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={classNames(
        "text-white bg-primary hover:bg-primary-light",
        props.disabled ? "bg-primary-light" : "",
        className
      )}
    >
      {children}
    </Button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      {...props}
      className={classNames(
        "border-2 border-primary text-primary px-3 py-2 cursor-pointer",
        "hover:bg-primary hover:text-white rounded-md"
      )}
    >
      {children}
    </Button>
  );
}

export function LinkButton({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link to={to} className="bg-primary text-white px-3 py-2 rounded-md">
      {children}
    </Link>
  );
}

export function CheckButton(props: ButtonProps) {
  return (
    <Button {...props} className={classNames("rounded-full")}>
      <CheckIcon />
    </Button>
  );
}

export function SearchBar({
  action,
  placeholder,
}: {
  action?: string;
  placeholder: string;
}) {
  const [searchParams] = useSearchParams();
  const transition = useTransition();
  const isSearchSubmitting = transition.submission?.formData.has("q");
  return (
    <Form
      className="flex border-2 border-gray-300 rounded-md"
      action={action || ""}
    >
      <button className="pl-3 pr-2 mr-1">
        {isSearchSubmitting ? <LoadingIcon /> : <SearchIcon />}
      </button>
      <input
        className="w-full py-3 px-2 rounded-md"
        type="text"
        name="q"
        placeholder={placeholder}
        defaultValue={searchParams.get("q") || ""}
        autoComplete="off"
      />
    </Form>
  );
}
