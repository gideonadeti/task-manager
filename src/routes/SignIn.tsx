import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";

import { FormValues } from "../lib/types";
import { PasswordInput } from "../components/PasswordInput";
import axios from "../lib/axios-instance";

interface Error {
  message: string;
}

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Error[] | []>([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function onSubmit(formValues: FormValues) {
    try {
      setLoading(true);
      setMessage("");
      setErrs([]);

      const { data } = await axios.post("/auth/sign-in", formValues);

      const { message, accessToken, refreshToken } = data;

      setMessage(message);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setErrs([]);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);

      if (error instanceof AxiosError) {
        if (!error.response) {
          return setErrs([
            {
              message:
                "An error occurred during sign-in. Please try again later.",
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
              "An error occurred during sign-in. Please try again later.",
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
      <h2 className="text-center">Sign In</h2>
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
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="my-2 text-center">
        Don't have an account? <Link to="/auth/sign-up">Sign up</Link>
      </p>

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
