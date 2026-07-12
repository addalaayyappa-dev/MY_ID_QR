# MyID QR
_https://myidqr.netlify.app/_

MyID QR is a privacy-focused web app for generating and viewing personal identification information through QR codes. It offers two modes:

- Basic QR mode for quick offline sharing of non-sensitive data
- Secure QR mode with a 4-digit PIN and encrypted storage for more sensitive information

The app is built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Supabase. It uses the Supabase Data API to store and retrieve secure QR records, allowing the frontend to interact with data directly without a separate backend server.

## Features

- Generate QR codes for personal information forms
- Choose between a basic offline QR and a secure PIN-protected QR
- View decrypted information through a dedicated viewer screen
- Download generated QR images locally
- Use Supabase-backed secure storage for encrypted payloads

## Project Overview

This project is designed for convenience and demonstration of secure QR-based information handling. It is not a full identity management platform and should not be used as a replacement for official document storage or regulated identity systems.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase
- QRCode.js

## How the Data API is Used

The Supabase Data API is the bridge between the frontend and the database in this project. It allows the app to create, read, update, and manage records without building a traditional backend service. In this project, it is used to store secure QR metadata and retrieve encrypted records when a user opens a protected QR. This makes the application simpler to deploy because the frontend can talk to a managed database directly through Supabase. The Data API also helps keep the project lightweight by reducing the need for custom API routes and server infrastructure. It is especially useful for rapid development, prototypes, and apps that need database access with minimal setup. Because the API is managed by Supabase, common tasks such as authentication, querying, and data persistence are handled more efficiently. This approach makes the app easier to maintain while still supporting secure and scalable data operations. In short, the Data API is the core data layer that powers the app’s secure QR workflow.

## Security Notes

- Basic QR mode stores data in plain text and should only be used for non-sensitive information.
- Secure QR mode uses PIN-based protection and encryption for better confidentiality.
- Always handle personal data responsibly and avoid sharing sensitive identifiers unnecessarily.


