import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useForm } from "react-hook-form";
import { ClickableElement } from "./ClickableElement";
import { useTaskGroupsStore } from "../stores/task-groups";
import { TaskGroup } from "../lib/types";

type TaskFormData = {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  group: string;
};

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

  const onSubmit = (data: TaskFormData) => {
    console.log("Task added:", data);
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        reset();
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
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
                {errors.dueDate && (
                  <p className="text-danger">{errors.dueDate.message}</p>
                )}
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
              {...register("group", { required: "Group is required" })}
            >
              {taskGroups?.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </Form.Select>
            {errors.group && (
              <p className="text-danger">{errors.group.message}</p>
            )}
          </Form.Group>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShow(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Task
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
