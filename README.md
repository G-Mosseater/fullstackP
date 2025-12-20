# Fullstack React & Express App 🚀

A fullstack web application built **from scratch**, using **React (Vite)** on the frontend and **Node.js** / **Express.js** on the backend

This project focuses on understanding how a real-world fullstack app works end-to-end — from secure authentication to state management, image uploads, and API communication.
It prioritizes functionality and learning over visual polish, with most effort going into the fullstack logic rather than detailed styling.

The app is deployed on **Render**, which may take a minute to start on the first load (free tier).

---

## 🧩 What this app does

Users can sign up, log in, create and manage content, upload images, and view locations on a map 
The frontend talks to a custom REST API connected to a MongoDB database

No UI libraries were used — all components and logic were built manually

---

## 💡 Why I built it

- Learn how frontend and backend work together
- Implement secure authentication from scratch
- Practice REST APIs with Express and MongoDB
- Handle complex state in React in a clean way
- Build and deploy a real fullstack application

---

## 🛠 Backend

- Node.js & Express
- MongoDB with **Mongoose**
- Secure JWT authentication
- Protected routes and middleware
- Image uploads with **Cloudinary**

Authentication and data handling are fully custom and secured.

---

## 🎨 Frontend

- React + Vite
- React Router with lazy loading
- Custom UI components (modals, cards, backdrops, spinners, navigation, inputs)
- Google Maps API integration

State and logic:
- Custom **authentication hook** with `useContext`
- Custom **HTTP hook** for handling requests, loading states, and errors
- Form and UI state managed with **`useReducer`**
- Custom `useForm` hook for validation and control
  

---

## ✨ Key idea

This project was built to go beyond “making it work”
Everything — backend logic, authentication, state management, and UI components — was written from scratch to truly understand how and why it works
