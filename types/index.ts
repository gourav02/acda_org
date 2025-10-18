// Common types for the application

export interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: string[];
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  medicalHistory?: string;
}

export interface FormData {
  [key: string]: string | number | boolean | Date | undefined;
}

export interface Event {
  id: string;
  title: string;
  year: number;
  description: string;
  images: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface Announcement {
  id: string;
  message: string;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

export interface DirectorMessage {
  name: string;
  position: string;
  message: string;
  image: string;
}
