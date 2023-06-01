import { Track } from "./spotifySdk"

const baseUrl = 'https://api.spotify.com/v1'


type trackList = {
  items: embeddedTrack[]
}

type embeddedTrack = {
  track: Track
}


export const playlistTracks = async (id: string, token: string): Promise<Track[]> => {
  const url: string = `${baseUrl}/playlists/${id}/tracks?${new URLSearchParams({
    market: 'ES',
    fields: 'items(track(name,id,type,uri,artists(id,name),album(name,id,uri)))',
  })
    }`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const rawTracks: trackList = await res.json()

  const tracks: Track[] = rawTracks.items.map((t: embeddedTrack) => t.track)

  return tracks
}

export const play = async (uri: string, position: string, token: string) => {
  const url: string = `${baseUrl}/me/player/play`

  const body = {
    uris: [uri],
    position_ms: position
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  })
}
