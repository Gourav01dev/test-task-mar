import React, { ChangeEvent, FocusEvent } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

interface InputFieldProps {
  name: string;
  label?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  error?: boolean;
  helperText?: any;
  handleBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  handleClickShowPassword?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete = "",
  error = false,
  helperText = "",
  handleBlur,
  showPassword,
  handleClickShowPassword,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* Label with Required Asterisk */}
      {label && (
        <label className="text-sm font-medium text-black mb-1">
          {label} {required && <span className="text-orange-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Input Field */}
        <input
          name={name}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`flex-grow !w-full px-4 py-3 text-gray-700 border rounded-md focus:outline-none focus:ring-2 
            ${type === "password" ? "pr-[45px] pl-4" : ""}
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-gray-500"
            } placeholder-gray-400`}
          inputMode={type === "number" || type === "otp" ? "numeric" : "text"}
          maxLength={type === "otp" ? 6 : undefined}
          onBlur={handleBlur}
        />

        {/* Password Toggle Button */}
        {type === "password" && handleClickShowPassword && (
          <IconButton
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={handleClickShowPassword}
            size="small"
            sx={{ position: "absolute" }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        )}
      </div>

      {/* Error Message */}
      {error && helperText && (
        <p className="text-sm text-red-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default InputField;
