export type Track  = {
  album: {
    id: string;
    name: string;
    uri: string;
  };
  artists: {
    id: string;
    name: string;
  }[];
  id: string;
  name: string;
  type: string;
  uri: string;
}