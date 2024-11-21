<p align="center">
  <img loading="lazy" alt="Benevolence App" src="https://github.com/user-attachments/assets/ef388283-4b4d-41a5-83fb-079928fe3e06" />
</p>

# Benevolence App Client
The frontend for the Benevolence App, built with Vite + React and Redux in TypeScript. The Benevolence App is a solution that integrates with Planning Center to provide meals, services, and item donations to those in need. It was developed in response to the lack of a built-in solution within Planning Center. This repository provides a responsive user interface for interacting with the Benevolence App API.

View the app here: [https://app.benevolenceapp.com/](https://app.benevolenceapp.com)

View videos of the app in action here: [https://github.com/hdlane/benevolence-app-demo](https://github.com/hdlane/benevolence-app-demo)

## Features
- Responsive design for mobile and desktop.
- Authentication using login links.
- Dashboard for managing requests and resources.

## Getting Started
1. Clone this repository:
   ```bash
   git clone https://github.com/hdlane/benevolence-app-client.git
2. Navigate to the directory:
   ```bash
   cd benevolence-app-client
3. Install dependencies:
   ```bash
   npm install
4. Start the development server:
   ```bash
   npm run dev
5. Access the app at `http://localhost:5173`

## Dependencies
- React 18.x
- React DOM Router 18.x
- Redux 7.x
- TypeScript
- Tailwind CSS
- shadcn for components

## Usage
- Ensure the [Benevolence App API](https://github.com/hdlane/benevolence-app-api) is running.
- Update the .env file with the API URL:
   ```bash
   VITE_API_BASE_URL=http://localhost:3000

## License
This project is licensed under the MIT License.
