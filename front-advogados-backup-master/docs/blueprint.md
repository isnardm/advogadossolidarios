# **App Name**: advogados solidarios

## Core Features:

- User Registration: Allow users to register with their name, email, password, and role (USUARIO). Endpoint: POST http://localhost:8080/usuarios.
- Lawyer Registration: Enable lawyers to register with their name, email, password, OAB number, and role (ADVOGADO). Endpoint: POST http://localhost:8080/advogados.

- User Login: Authenticate users and lawyers, generating a token upon successful login. Endpoint: POST http://localhost:8080/login with email and password.
- Case Submission: Case Submission (Usuario): Allow authenticated users to submit a new legal case with a title and description. Requires Authorization header with Bearer token. Endpoint: POST http://localhost:8080/causas
- Case Listing: Case Listing (Advogado): Enable lawyers to view a list of all submitted cases. Requires Authorization header with Bearer token. Endpoint: GET http://localhost:8080/causas. Displayed in a panel.
- Responsive Dashboard: Responsive Dashboard: Present key information on a mobile-first dashboard, providing a clear overview for both users and lawyers.


## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey trust, professionalism, and reliability.
- Background color: Very light blue (#F0F2FA), offering a clean and calm backdrop.
- Accent color: Purple (#8E24AA), providing a modern and distinct contrast for calls to action.
- Body and headline font: 'PT Sans', a humanist sans-serif, to combine a modern look with warmth and readability.
- Mobile-first design approach, ensuring the platform is accessible and user-friendly on smaller screens.
- Simple, professional icons to represent different sections and actions within the platform.
- Subtle transitions and animations to enhance user experience, like loading indicators and feedback for interactions.