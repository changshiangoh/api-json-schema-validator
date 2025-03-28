# API Request Body JSON Schema Validator
 
## Description
This app allows users to generate JSON schemas from Java controller and relevant object class files (or directly supply JSON schema file), and validate API JSON Request Body objects against these schemas. It consists of two pages:
1. **Import Schema**: Users provide Java controller and relevant object class files or JSON schema file, along with the URL and HTTP request method to generate the schema for the JSON body of a potential HTTP request.
Given the URL and request type, the app will check it against the supplied controller file, to check if this is a valid request.
2. **Validate Request**: Users paste a JSON object and validate it against the generated schema, receiving feedback on whether the data is valid or invalid, along with error messages.
 
## Innovation and Originality
### Introduction
The app addresses the need for a simple and efficient way to generate and validate JSON schemas, which is crucial for API development and data validation.
### Innovation
- **Schema Generation**: Automatically generates JSON schemas from Java controller and relevant object class files or JSON schema files.
- **Validation**: Provides validation feedback, including specific error messages.
### Features
- Generate JSON schemas from various inputs.
- Validate JSON objects against generated schemas.
- User-friendly interface with step-by-step guidance.
- Error checking at every step of the process
 
## Technical Execution
### Architecture
The app is built using React for the frontend and Zustand for state management. It interacts with a concurrently running Python service for schema generation and validation.
### Implementation
- **Frontend**: React components for the Import Schema and Validate Request pages.
- **Backend**: Axios for API requests to the Python service.
 
## Use of Open-Source Tools
### Open-Source Tools and Libraries the project is heavily relying on
- **jsonschema**: Utilized for its robust validation capabilities. [jsonschema GitHub](https://github.com/python-jsonschema/jsonschema)
- **javalang**: Leveraged for parsing Java files to extract necessary information for schema generation. [javalang GitHub](https://github.com/c2nes/javalang)
- **React**: For building the user interface. [React GitHub](https://github.com/facebook/react)
- **Zustand**: For state management. [Zustand GitHub](https://github.com/pmndrs/zustand)
- **Axios**: For making HTTP requests. [Axios GitHub](https://github.com/axios/axios)
- **Material-UI**: For UI components. [Material-UI GitHub](https://github.com/mui/material-ui)
 
### Integration
Seamless integration of open-source tools to ensure smooth functionality and user experience.
 
## Design
### User Experience
The design is focused on providing a clear and intuitive user experience, guiding users through the schema generation and validation process.
 
### Accessibility
Ensuring accessibility by using standard UI components and providing clear error messages.
 
## Installation and Usage
### Installation
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Ensure `Python` and `pip` are installed (`Python 3.9` was used when creating the project).
4. Install Python dependencies using `pip install -r requirements.txt`.
5. Start the React development server using `npm start`.
6. Run the Python server in parallel to handle schema generation and validation.
 
### Usage
1. Navigate to the Import Schema page.
2. Upload the Controller and Relevant Files as `.java` files or Controller (`.java`) and Schema (`.json`) and provide the URL and HTTP request method.
3. Generate the schema.
4. Navigate to the Validate Request page.
5. Paste the JSON object and validate it.
 
## Feedback and Support
### Feedback
All users are encouraged to provide feedback through GitHub issues or discussions.
 