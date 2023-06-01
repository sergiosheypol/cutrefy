import { ActionArgs, isSession, json, LoaderArgs, LoaderFunction, redirect, type V2_MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { toMilliseconds } from "lib/calculator.server";
import { parseNumber, parseString } from "lib/parser.server";
import { prisma } from "lib/prisma.server";
import { Track } from "lib/spotifySdk";
import { playlistTracks } from "lib/spotifySdk.server";
import { getSession, spotifyToken } from "~/sessions";

const minuteParam = 'minute'
const secondParam = 'second'
const uriParam = 'uri'
const nameParam = 'name'
const artistParam = 'artist'

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {

  const session = await getSession(request.headers.get("Cookie"))

  if (!(isSession(session) && session.has(spotifyToken))) {
    return redirect('/login')
  }

  const token = session.get(spotifyToken) ?? ""
  const tracks: Track[] = await playlistTracks(process.env.SPOTIFY_PLAYLIST_ID, token)

  return json(tracks);
};

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"))

  if (!(isSession(session) && session.has(spotifyToken))) {
    return
  }

  const body = await request.formData();
  const minute = parseNumber(body.get(minuteParam))
  const second = parseNumber(body.get(secondParam))
  const uri = parseString(body.get(uriParam))
  const name = parseString(body.get(nameParam))
  const artist = parseString(body.get(artistParam))

  const position = toMilliseconds(minute, second)

  const res = await prisma.tracks.create({
    data: {
      position_ms: position,
      spotify_uri: uri,
      name: name,
      artist: artist
    }
  })

  console.debug(res)

  return redirect('/')
}

export default function Index() {

  const data: Track[] = useLoaderData<typeof loader>();

  return <div className={'container'}>
    <table className={'w-full'}>
      <tr>
        <th className={'p-1'}>Name</th>
        <th className={'p-1'}>Artists</th>
        <th className={'p-1'}></th>
      </tr>
      {data.map((t: Track) => <tr key={t.id}>
        <td className={'p-1'}>{t.name}</td>
        <td className={'p-1 border-r-2'}>
          {t.artists.map(a => a.name).join()}
        </td>
        <td className={'p-1'}><Form method={'POST'} action={'?index'}>
          <label>Min</label>
          <input type={'number'} className={'border'} name={minuteParam}></input>
          <label>Sec</label>
          <input type={'number'} className={'border'} name={secondParam}></input>
          <input type={'hidden'} name={uriParam} value={t.uri} />
          <input type={'hidden'} name={nameParam} value={t.name} />
          <input type={'hidden'} name={artistParam} value={t.artists.map(a => a.name).join()} />
          <button type="submit">Store</button>
        </Form></td>
      </tr>)}
    </table>
  </div>

}
