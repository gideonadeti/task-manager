import { useState } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

import { SignUpFormValues } from "../lib/types";

export function PasswordInput({
  autoComplete,
  register,
  error,
}: {
  autoComplete: "new-password" | "current-password";
  register: UseFormRegister<SignUpFormValues>;
  error?: FieldError;
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="input-group">
      <input
        type={passwordVisible ? "text" : "password"}
        id="password"
        className={`form-control ${error ? "is-invalid" : ""}`}
        autoComplete={autoComplete}
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
          pattern: {
            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/,
            message:
              "Password must include uppercase, lowercase, number, and special character",
          },
        })}
      />
      <button
        className="btn border rounded-end"
        type="button"
        onClick={togglePasswordVisibility}
      >
        <i className={passwordVisible ? "bi bi-eye-slash" : "bi bi-eye"}></i>
      </button>
      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
}
