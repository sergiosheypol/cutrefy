import { AuthToken } from "./spotifyLogin";

export const redirectURI: string = process.env.NODE_ENV == "development" ? "http://localhost:3000/login-callback" : "";

const tokenUrl = "https://accounts.spotify.com/api/token";
const grantTypeValue = "authorization_code"

export const composeAuthUrl = (): string => {
  const responseType: string = "code";
  const scopes: string[] = ["playlist-read-private", "user-modify-playback-state"];
  return "https://accounts.spotify.com/authorize?" + new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID ?? "",
    response_type: responseType,
    redirect_uri: redirectURI,
    state: Math.random().toString(),
    scope: scopes.join()
  });
}

const composeRequestAuthToken = (): string => {
  const clientId = process.env.SPOTIFY_CLIENT_ID ?? ""
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? ""
  return Buffer.from(clientId + ':' + clientSecret).toString('base64')
}

export const accessToken = async (code: string): Promise<AuthToken> => {
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Authorization": `Basic ${composeRequestAuthToken()}`
    },
    body: new URLSearchParams({
      'grant_type': grantTypeValue,
      'code': code,
      'redirect_uri': redirectURI
    })
  })

  const body = await res.json()
  console.info(`login info: ${JSON.stringify(body)}`)

  return {
    token: body.access_token,
    type: body.token_type
  }

}
