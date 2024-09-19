import { TaskProps } from "./types";

export const tasks: TaskProps[] = [
  {
    title: "Buy groceries",
    description: "Milk, eggs, bread, and fruits",
    dueDate: new Date(2024, 8, 21), // September 21, 2024
    priority: "Medium",
    completed: false,
  },
  {
    title: "Complete project report",
    description: "Finish the monthly report and send it to the manager",
    dueDate: new Date(2024, 8, 22), // September 22, 2024
    priority: "High",
    completed: false,
  },
  {
    title: "Call plumber",
    description: "Fix the leak in the kitchen sink",
    dueDate: new Date(2024, 8, 25), // September 25, 2024
    priority: "Low",
    completed: false,
  },
  {
    title: "Workout",
    description: "Morning workout routine at the gym",
    dueDate: new Date(2024, 8, 19), // September 19, 2024
    priority: "Medium",
    completed: true,
  },
  {
    title: "Dentist appointment",
    description: "6-month teeth cleaning",
    dueDate: new Date(2024, 8, 24), // September 24, 2024
    priority: "High",
    completed: false,
  },
  {
    title: "Plan weekend trip",
    description: "Book hotel and prepare itinerary for the weekend trip",
    dueDate: new Date(2024, 8, 20), // September 20, 2024
    priority: "Medium",
    completed: false,
  },
  {
    title: "Update LinkedIn profile",
    description: "Add recent job achievements and update skills",
    dueDate: new Date(2024, 8, 26), // September 26, 2024
    priority: "Low",
    completed: true,
  },
  {
    title: "Submit tax documents",
    description: "Gather all receipts and submit tax filing",
    dueDate: new Date(2024, 9, 1), // October 1, 2024
    priority: "High",
    completed: false,
  },
  {
    title: "Attend webinar",
    description: "Join online marketing webinar at 3 PM",
    dueDate: new Date(2024, 8, 19), // September 19, 2024
    priority: "Low",
    completed: true,
  },
  {
    title: "Fix bike",
    description: "Repair flat tire and clean the chain",
    dueDate: new Date(2024, 8, 23), // September 23, 2024
    priority: "Medium",
    completed: false,
  },
];
