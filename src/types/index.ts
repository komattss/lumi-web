export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface UserProfile {
  name: string;
  email: string;
  location: string;
  joinDate: string;
  bio: string;
  avatar?: string;
}

export interface Location {
  id: number;
  position: [number, number];
  name: string;
  description?: string;
}
