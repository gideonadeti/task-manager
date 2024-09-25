import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useForm } from "react-hook-form";
import Alert from "react-bootstrap/Alert";
import { AxiosError } from "axios";

import { ClickableElement } from "./ClickableElement";
import { useTaskGroupsStore } from "../stores/task-groups";
import { TaskGroup } from "../lib/types";
import axios from "../lib/axios-instance";
import { redirectTo } from "../lib/redirect-to";

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  groupId: string;
}

interface Error {
  msg: string;
}

export function AddTaskButton({ className }: { className?: string }) {
  const [show, setShow] = useState(false);
  const { taskGroups } = useTaskGroupsStore();

  return (
    <>
      <ClickableElement className={className} onClick={() => setShow(true)}>
        <i className="bi-plus-circle-fill"></i>
        <p>Add task</p>
      </ClickableElement>
      <AddTaskModal show={show} setShow={setShow} taskGroups={taskGroups} />
    </>
  );
}

function AddTaskModal({
  show,
  setShow,
  taskGroups,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
  taskGroups: TaskGroup[] | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    defaultValues: {
      priority: "MEDIUM",
    },
  });

  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Error[] | []>([]);
  const [message, setMessage] = useState("");

  async function onSubmit(formValues: TaskFormData) {
    try {
      setLoading(true);
      setErrs([]);

      const { data } = await axios.post("/tasks", formValues);

      const { message } = data;

      reset();
      setMessage(message);

      const groupId = formValues.groupId;
      const groupName = taskGroups?.find((group) => group.id === groupId)?.name;
      let endPoint = "";
      if (groupName === "Inbox") {
        endPoint = "inbox";
      } else {
        endPoint = groupId;
      }

      setTimeout(() => {
        redirectTo(`/task-groups/${endPoint}`);
      }, 3000);
    } catch (error) {
      console.error(error);

      setMessage("");

      if (error instanceof AxiosError) {
        if (!error.response) {
          return setErrs([
            {
              msg: "An error occurred during task addition. Please try again later.",
            },
          ]);
        }

        const responseErrors = error.response.data.errors;
        setErrs(responseErrors);
      } else {
        setErrs([
          {
            msg: "An error occurred during task addition. Please try again later.",
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
        <Modal.Title>Add Task</Modal.Title>
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

          <FloatingLabel label="Title" className="mb-3">
            <Form.Control
              {...register("title", { required: "Title is required" })}
              placeholder="Buy groceries"
            />
            {errors.title && (
              <p className="text-danger">{errors.title.message}</p>
            )}
          </FloatingLabel>
          <FloatingLabel label="Description" className="mb-3">
            <Form.Control
              as="textarea"
              {...register("description")}
              placeholder="Milk, eggs, bread, and fruits"
              style={{ height: "128px" }}
            />
          </FloatingLabel>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Due date</Form.Label>
                <Form.Control type="date" {...register("dueDate")} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select {...register("priority", { required: true })}>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>Group</Form.Label>
            <Form.Select
              {...register("groupId", { required: "Group is required" })}
            >
              {taskGroups?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
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
