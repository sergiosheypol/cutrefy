import { LoaderFunction, redirect } from "@remix-run/node";
import { composeAuthUrl } from "lib/spotifyLogin.server";

export const loader: LoaderFunction = async () => {
  return redirect(composeAuthUrl())
}
