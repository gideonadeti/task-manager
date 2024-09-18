export interface FormValues extends User {
  password: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}
