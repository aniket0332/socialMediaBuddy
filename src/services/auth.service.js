import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { clearTokens, setTokens } from "../utils/tokenStorage";
import { cognitoConfig } from './../config/cognitoConfig';

const client = new CognitoIdentityProviderClient({
  region: cognitoConfig.region
});

export const login = async (email, password) => {
  const command = new InitiateAuthCommand({
    AuthFlow: cognitoConfig.AuthFlow,
    ClientId: cognitoConfig.ClientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  });

  try {
    const response = await client.send(command);
    setTokens({
      accessToken: response.AuthenticationResult.AccessToken,
      idToken: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken
    })
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const signUp = async (email, userName, password, setShowConfirmation) => {

  const command = new SignUpCommand({
    ClientId: cognitoConfig.ClientId,
    Username: userName,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email
      }
    ]
  });

  try {
    const response = await client.send(command);
    setShowConfirmation(true);
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const confirmSignUp = async (email, code) => {
  const command = new ConfirmSignUpCommand({
    ClientId: cognitoConfig.ClientId,
    Username: email,
    ConfirmationCode: code
  });

  try {
    const response = await client.send(command);
    // return response;
    console.log(response);
  } catch (error) {
    console.error("Confirmation error:", error);
    throw error;

  }
};

export const logout = () => {
  clearTokens();
};