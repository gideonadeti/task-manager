import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

import { FormValues } from "../lib/types";
import { PasswordInput } from "../components/PasswordInput";
import axios from "../lib/axios-instance";
import { redirectTo } from "../lib/redirect-to";
import { useUserStore } from "../stores/user";

interface Error {
  message: string;
}

export default function SignUp() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  // Redirect if the user is already signed in
  useEffect(() => {
    if (user) {
      navigate("/task-groups/today");
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Error[] | []>([]);
  const [message, setMessage] = useState("");

  async function onSubmit(formValues: FormValues) {
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
        redirectTo("/task-groups/today");
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

  if (user) {
    return null;
  }

  return (
    <div
      className="container mt-3 border p-3 rounded shadow-sm"
      style={{ maxWidth: "420px" }}
    >
      <h2 className="text-center">Sign Up</h2>
      {errs.length > 0 && (
        <div className="alert alert-danger my-2">
          <ul>
            {errs.map((err, index) => (
              <li key={index}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {message && (
        <div className="alert alert-success my-2">
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

      <p className="my-2 text-center">
        Already have an account? <Link to="/auth/sign-in">Sign in</Link>
      </p>

      <div className="d-flex align-items-center mb-3">
        <hr className="flex-grow-1" />
        <span className="mx-2">or</span>
        <hr className="flex-grow-1" />
      </div>

      <button
        className="btn btn-light border w-100"
        onClick={() => redirectTo("http://localhost:3000/api/auth/google")}
      >
        <i className="bi bi-google me-2"></i> Continue with Google
      </button>
    </div>
  );
}
