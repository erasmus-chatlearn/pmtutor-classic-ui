# Erasmus+ ChatLearn PMTutor classic UI application
This is a minimalistic UI for PMTutor served by a Node Express middleware.

## Features
- Easy install and run
- Uses IBM APP ID for authentication
- Uses IBM Web Chat for interaction

## Before Installation
- Copy .env.example and create a .env
- Provide required environment variables in .env
- Provide required IBM Webchat integration ID, region and service instance ID in public/index.html, please consult IBM documentation

## Installation
```bash
npm install
```

## Run the application locally
```bash
npm run start
```
Navigate to the local URL you specified in the .env, e.g., http://localhost:3000

## License
This project is licensed under the MIT License.
