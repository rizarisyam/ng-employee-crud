export interface EmployeeType {
  first: number;
  prev: any;
  next: number;
  last: number;
  pages: number;
  items: number;
  data: Employee[];
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  status: boolean;
  birthdate: string;
  group: string;
  description: string;
}
