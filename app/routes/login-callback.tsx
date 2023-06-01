import { LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { AuthToken } from "lib/spotifyLogin";
import { accessToken } from "lib/spotifyLogin.server";
import { commitSession, getSession, spotifyToken, spotifyTokenType } from "~/sessions";

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const url: URL = new URL(request.url)

  const error: string | null = url.searchParams.get("error")
  const state: string = url.searchParams.get("state") ?? "" // Deliberately ignored

  if (error !== null) {
    return json({
      error: error,
      state: state
    })
  }

  const code: string = url.searchParams.get("code") ?? ""

  const loginResp: AuthToken = await accessToken(code)
  
  const session = await getSession(request.headers.get("Cookie"))
  session.set(spotifyToken, loginResp.token)
  session.set(spotifyTokenType, loginResp.type)

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}


