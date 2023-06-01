import { isSession, type ActionArgs, type LinksFunction, LoaderFunction, LoaderArgs, redirect, json } from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css";
import { getSession, spotifyToken } from "./sessions";
import { parseNumber, parseString } from "lib/parser.server";
import { play } from "lib/spotifySdk.server";
import { prisma } from "lib/prisma.server";
import { tracks } from "@prisma/client";

const positionParam = 'position'
const uriParam = 'uri'

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"))

  if (!(isSession(session) && session.has(spotifyToken))) {
    return
  }

  const token = session.get(spotifyToken) ?? ""

  const body = await request.formData();
  const position = parseNumber(body.get(positionParam)).toString()
  const uri = parseString(body.get(uriParam))

  play(uri, position, token)

  return null
}

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {

  const session = await getSession(request.headers.get("Cookie"))

  if (!(isSession(session) && session.has(spotifyToken))) {
    return redirect('/login')
  }

  const tracks: tracks[] = await prisma.tracks.findMany({
    take: 10,
  })

  return json(tracks);
};


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];


export default function App() {
  const data: tracks[] = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className={'container'}>
          <div id={'keypad'} className={'grid grid-cols-4'}>
            {
              data.map(t => {
                return <Form method={'POST'} className={'w-full'}>
                  <button type={'submit'} className={'border px-4 py-8 w-full'}>{t.name}</button>
                  <input type={'hidden'} name={uriParam} value={t.spotify_uri} />
                  <input type={'hidden'} name={positionParam} value={t.position_ms} />
                </Form>
              })
            }
          </div>
        </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
