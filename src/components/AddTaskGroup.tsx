import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useForm } from "react-hook-form";
import Alert from "react-bootstrap/Alert";
import { AxiosError } from "axios";

import { ClickableElement } from "./ClickableElement";
import { redirectTo } from "../lib/redirect-to";
import axios from "../lib/axios-instance";

interface TaskGroupFormData {
  name: string;
}

interface Error {
  msg: string;
}

export function AddTaskGroup() {
  const [show, setShow] = useState(false);

  return (
    <div className="d-flex align-items-center justify-content-between">
      <h5>My Task Groups</h5>
      <ClickableElement onClick={() => setShow(true)}>
        <i className="bi-plus"></i>
      </ClickableElement>
      <AddTaskGroupModal show={show} setShow={setShow} />
    </div>
  );
}

function AddTaskGroupModal({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskGroupFormData>();

  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Error[] | []>([]);
  const [message, setMessage] = useState("");

  async function onSubmit(formValues: TaskGroupFormData) {
    try {
      setLoading(true);
      setErrs([]);

      const { data } = await axios.post("/task-groups", formValues);

      const { message, groupId } = data;

      reset();
      setMessage(message);

      setTimeout(() => {
        redirectTo(`/task-groups/${groupId}`);
      }, 3000);
    } catch (error) {
      console.error(error);

      setMessage("");

      if (error instanceof AxiosError) {
        if (!error.response) {
          return setErrs([
            {
              msg: "An error occurred during task group addition. Please try again later.",
            },
          ]);
        }

        const responseErrors = error.response.data.errors;
        setErrs(responseErrors);
      } else {
        setErrs([
          {
            msg: "An error occurred during task group addition. Please try again later.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        reset();
        setMessage("");
        setErrs([]);
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Task Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {errs.length > 0 && (
            <div className="alert alert-danger my-3">
              <ul>
                {errs.map((err, index) => (
                  <li key={index}>{err.msg}</li>
                ))}
              </ul>
            </div>
          )}

          {message && <SuccessAlert message={message} />}

          <FloatingLabel label="Name" className="mb-3">
            <Form.Control
              {...register("name", { required: "Name is required" })}
              placeholder="Work"
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </FloatingLabel>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShow(false);
            reset();
            setMessage("");
            setErrs([]);
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function SuccessAlert({ message }: { message: string }) {
  return (
    <Alert variant="success">
      <p>{message}</p>
    </Alert>
  );
}
