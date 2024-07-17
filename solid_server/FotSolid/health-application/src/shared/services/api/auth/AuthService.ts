import { login, Session } from "@inrupt/solid-client-authn-browser";
import { Api } from "../axios-config";
import { buildAuthenticatedFetch, createDpopHeader, generateDpopKeyPair } from '@inrupt/solid-client-authn-core';
import { universalAccess } from "@inrupt/solid-client";
import { Buffer } from 'buffer';
import { Environment } from "../../../environment";

type Token = {
  id: string,
  secret: string,
  resource: string
}

interface IUser {
  // Properties
  userid: string;
  local_webid: string;
  webid: string;
  idp: string;
  username: string; //email
  password: string;
  podname: string;
}


const loginCredentials = async (): Promise<typeof fetch | Error> => {

  const user: IUser = {
    "userid": "1652322",
    "local_webid": "http://localhost:3000/Health/profile/card#me",
    "webid": "http://localhost:3000/Health/profile/card#me",
    "idp": "http://localhost:3000/",
    "username": "health@example.com",
    "podname": "Health",
    "password": "12345",
  }

  // const token = await getAuthorization(user);

  // const authFetch = await getAuthFetch(token, user);

  const authFetch = await getAuthorization(user);

  return authFetch;

}

const loginWeb = async (checkedItems: {}, idp: string) => {

  try {
    await login({
      oidcIssuer: idp,
      redirectUrl: new URL(window.location.href).toString(),
      clientName: "Fot Health Application"
    });

    // localStorage.setItem('sessionData', JSON.stringify(getDefaultSession()));
  } catch (error) {
    console.error('Login error:', error);
  }
}

export const AuthService = {
  loginCredentials,
  loginWeb
};

export const getAuthorization = async (user: IUser): Promise<typeof fetch | Error> => {

  // First we request the account API controls to find out where we can log in
  try {
    const indexResponse = await fetch(user.idp + '.account/');
    // const indexResponse = await fetch(process.env.SOLID_IDP + '.account/');

    const { controls } = await indexResponse.json();

    // And then we log in to the account API
    const response = await fetch(controls.password.login, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: user.username, password: user.password }),
    });

    // This authorization value will be used to authenticate in the next step
    const { authorization } = await response.json();
    // console.log(authorization);

    let token = await generateToken(authorization, user);

    const authFetch = await getAuthFetch(token, user);

    return authFetch;

  } catch (error) {

    return new Error(Environment.ERROR_FETCH);
  }

  // return getAuthFetch(token, user);
}


async function generateToken(authorization: any, user: IUser) {
  // Now that we are logged in, we need to request the updated controls from the server.
  // These will now have more values than in the previous example.
  const indexResponse = await fetch(user.idp + '.account/', {
    headers: { authorization: `CSS-Account-Token ${authorization}` }
  });
  const { controls } = await indexResponse.json();

  // Here we request the server to generate a token on our account
  const response = await fetch(controls.account.clientCredentials, {
    method: 'POST',
    headers: { authorization: `CSS-Account-Token ${authorization}`, 'content-type': 'application/json' },
    // The name field will be used when generating the ID of your token.
    // The WebID field determines which WebID you will identify as when using the token.
    // Only WebIDs linked to your account can be used.
    body: JSON.stringify({ name: 'my-token', webId: user.webid }),
  });

  // These are the identifier and secret of your token.
  // Store the secret somewhere safe as there is no way to request it again from the server!
  // The `resource` value can be used to delete the token at a later point in time.
  const { id, secret, resource } = await response.json();

  let token: Token = {
    id: id,
    secret: secret,
    resource: resource
  };

  return token;
}

const getAuthFetch = async (token: Token, user: IUser) => {


  // A key pair is needed for encryption.
  // This function from `solid-client-authn` generates such a pair for you.
  const dpopKey = await generateDpopKeyPair();

  // These are the ID and secret generated in the previous step.
  // Both the ID and the secret need to be form-encoded.
  const authString = `${encodeURIComponent(token.id)}:${encodeURIComponent(token.secret)}`;
  // This URL can be found by looking at the "token_endpoint" field at
  // http://localhost:3000/.well-known/openid-configuration
  // if your server is hosted at http://localhost:3000/.
  const tokenUrl = user.idp + '.oidc/token';

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      // The header needs to be in base64 encoding.
      authorization: `Basic ${Buffer.from(authString).toString('base64')}`,
      'content-type': 'application/x-www-form-urlencoded',
      dpop: await createDpopHeader(tokenUrl, 'POST', dpopKey),
    },
    body: 'grant_type=client_credentials&scope=webid',
  });

  // This is the Access token that will be used to do an authenticated request to the server.
  // The JSON also contains an "expires_in" field in seconds,
  // which you can use to know when you need request a new Access token.
  const { access_token: accessToken } = await response.json();

  const authFetch = await buildAuthenticatedFetch(accessToken, { dpopKey });

  return authFetch;
}

// {
//     "userid": "1652322",
//         "local_webid": "http://localhost:3000/Health/profile/card#me",
//             "webid": "http://localhost:3000/Health/profile/card#me",
//                 "idp": "http://localhost:3000/",
//                     "name": "health",
//                         "username": "health@example.com",
//                             "podname": "Health",
//                                 "password": "12345",
//                                     "auth": "true"
// }