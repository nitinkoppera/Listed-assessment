# Gmail Autoresponder
This project is a Node.js application that automatically responds to new email threads in Gmail. It identifies and isolates email threads in which no prior email has been sent by the user, and sends a response based on a predefined message template.

## Features
- Automatically responds to new email threads in Gmail
- Identifies and isolates threads with no prior user response
- Sends response based on predefined message template
- Uses Gmail API and OAuth 2.0 authentication
## Setup
1. **Clone the repository**
2. **Install dependencies using npm install**
3. **Create a project on the Google Cloud Console**
4. **Enable the Gmail API in the project and create OAuth 2.0 credentials**
5. **Configure Gmail API credentials:**
- Open the `index.js` file in the root directory of the project.
- Replace `'YOUR_CLIENT_ID'` with your Gmail API client ID.
- Replace `'YOUR_CLIENT_SECRET'` with your Gmail API client secret.
- Replace `'YOUR_REFRESH_TOKEN'` with your Gmail API refresh token.
*Note: If you don't have a refresh token, follow the instructions provided in the README to obtain it using the OAuth2 Playground.*

6. **Customize email message template:**
- Open the `config.json` file in the root directory of the project.
- Replace the placeholder values in the `messageTemplate` section with your desired email content.

7. **Run the application using npm start**
## Configuration
In index.js file, it should contains the following configuration options:
- `user`: The email address of the Gmail account
- `clientId`: The client ID of the OAuth 2.0 credentials
- `clientSecret`: The client secret of the OAuth 2.0 credentials
- `accessToken`: The access token for the Gmail API
- `refreshToken`: The refresh token for the Gmail API
- `message`: The message to send in response to new email threads
## Usage
Once the application is running, it will automatically respond to new email threads in Gmail that meet the criteria of having no prior response from the user. The response will be based on the message template specified in the config.json file.
