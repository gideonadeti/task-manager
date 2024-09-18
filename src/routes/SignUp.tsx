import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import { SignUpFormValues } from "../lib/types";
import { PasswordInput } from "../components/PasswordInput";
import axios from "../lib/axios-instance";

interface Error {
  message: string;
}

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Error[] | []>([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function onSubmit(formValues: SignUpFormValues) {
    try {
      setLoading(true);
      setMessage("");
      setErrs([]);

      const { data } = await axios.post("/auth/sign-up", formValues);

      const { message, accessToken, refreshToken } = data;

      setMessage(message);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setErrs([]);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error(error);

      if (error instanceof AxiosError) {
        if (!error.response) {
          return setErrs([
            {
              message:
                "An error occurred during sign-up. Please try again later.",
            },
          ]);
        }

        const responseErrors = error.response.data.errors;
        setErrs(responseErrors);
        setMessage("");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } else {
        setErrs([
          {
            message:
              "An error occurred during sign-up. Please try again later.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="container mt-5 border p-3 rounded shadow-sm"
      style={{ maxWidth: "420px" }}
    >
      <h2 className="text-center">Sign Up</h2>
      {errs.length > 0 && (
        <div className="alert alert-danger">
          <ul>
            {errs.map((err, index) => (
              <li key={index}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {message && (
        <div className="alert alert-success">
          <ul>
            <li>{message}</li>
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-3 mb-3">
          <div className="col">
            <label htmlFor="firstName" className="form-label">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              {...register("firstName", { required: "First name is required" })}
              autoFocus
            />
            {errors.firstName && (
              <div className="invalid-feedback">{errors.firstName.message}</div>
            )}
          </div>
          <div className="col">
            <label htmlFor="lastName" className="form-label">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && (
              <div className="invalid-feedback">{errors.lastName.message}</div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <PasswordInput
            autoComplete="new-password"
            register={register}
            error={errors.password}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mb-3"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <div className="d-flex align-items-center mb-3">
        <hr className="flex-grow-1" />
        <span className="mx-2">or</span>
        <hr className="flex-grow-1" />
      </div>

      <button className="btn btn-light border w-100">
        <i className="bi bi-google me-2"></i> Continue with Google
      </button>
    </div>
  );
}
