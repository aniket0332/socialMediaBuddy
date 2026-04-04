export const cognitoConfig = {
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  AuthFlow: "USER_PASSWORD_AUTH",
  region: process.env.REACT_APP_COGNITO_REGION
};