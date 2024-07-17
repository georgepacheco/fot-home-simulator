import { login } from "@inrupt/solid-client-authn-browser";
import { Request, Response } from "express";


export const loginWeb = async (req: Request, res: Response) => {
  
  try {
    await login({
      oidcIssuer: "http://localhost:3000",
      redirectUrl: new URL(window.location.href).toString(),
      clientName: "Fot Health Application"
    });

    // localStorage.setItem('sessionData', JSON.stringify(getDefaultSession()));
  } catch (error) {
    console.error('Login error:', error);
  }
}