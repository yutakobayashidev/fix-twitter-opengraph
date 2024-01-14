import { normalizeText } from "./normalizeText";
import type {
  Media,
  Photo,
  TweetData,
  User,
  Video,
  QuotedTweet,
} from "../types";
import ogs from "open-graph-scraper";
import { mergeUrls } from "./mergeUrls";

interface TweetDataSubset {
  id: string;
  text: string;
  user: User;
  photos: Photo[];
  video: Video | undefined;
  media: Media[] | undefined;
  likes: number;
  replies: number;
  in_reply_to_screen_name?: string;
  in_reply_to_url?: string;
  in_reply_to_status_id_str?: string;
  quoted_tweet?: QuotedTweet;
  og_image_url?: string;
  created_at: string;
}

// Originally authored by LFades for react-tweet
// Source: https://github.com/vercel/react-tweet/blob/69d454b6c240664778a26a134e39d06cf4685761/packages/react-tweet/src/api/get-tweet.ts#L27
function getToken(id: string) {
  return ((Number(id) / 1e15) * Math.PI)
    .toString(6 ** 2)
    .replace(/(0+|\.)/g, "");
}

const getInReplyToUrl = (tweet: TweetData) =>
  `https://twitter.com/${tweet.in_reply_to_screen_name}/status/${tweet.in_reply_to_status_id_str}`;

export async function fetchTweet(id: string): Promise<TweetDataSubset> {
  const baseUrl = "https://cdn.syndication.twimg.com/tweet-result";
  const token = getToken(id);

  const res = await fetch(`${baseUrl}?id=${id}&token=${token}`);
  const data: TweetData = await res.json();

  const {
    id_str,
    user,
    photos,
    video,
    entities,
    favorite_count,
    conversation_count,
    in_reply_to_screen_name,
    in_reply_to_status_id_str,
    created_at,
    quoted_tweet,
  } = data;

  let og_image_url: undefined | string = undefined;

  const text = normalizeText(data);

  if (data.entities.urls[0]?.expanded_url) {
    try {
      og_image_url = await getOgImageURL(data.entities.urls[0].expanded_url);

      if (og_image_url) {
        // Handling of OGP paths when they are relative paths
        og_image_url = mergeUrls(data.entities.urls[0].expanded_url, og_image_url);
      }

    } catch (e) {
      // console.error(e);
    }
  }

  return {
    id: id_str,
    text,
    og_image_url,
    likes: favorite_count,
    replies: conversation_count,
    user,
    photos: photos ? photos : [],
    video,
    quoted_tweet,
    media: entities.media,
    in_reply_to_screen_name,
    in_reply_to_status_id_str,
    in_reply_to_url: data.in_reply_to_screen_name
      ? getInReplyToUrl(data)
      : undefined,
    created_at: new Date(created_at).toISOString(),
  };
}

export async function getOgImageURL(url: string) {
  const data = await ogs({ url });

  if (data.result?.ogImage && data.result.ogImage.length > 0) {
    return data.result.ogImage[0].url;
  } else {
    return undefined;
  }
}
