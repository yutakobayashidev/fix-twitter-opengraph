type Indices = [number, number];

export interface TweetData {
  __typename: "Tweet";
  quoted_tweet?: QuotedTweet;
  lang: "en";
  in_reply_to_screen_name?: string;
  in_reply_to_status_id_str?: string;
  in_reply_to_user_id_str?: string;
  favorite_count: number;
  possibly_sensitive: boolean;
  created_at: string;
  display_text_range: Indices;
  entities: Entities;
  id_str: string;
  text: string;
  user: User;
  edit_control: EditControl;
  mediaDetails?: MediaDetails[];
  photos: Photo[];
  video: Video;
  conversation_count: number;
  news_action_type: string;
  isEdited: boolean;
  isStaleEdit: boolean;
}

export interface QuotedTweet extends TweetData {
  reply_count: number;
  retweet_count: number;
  favorite_count: number;
  mediaDetails?: MediaDetails[];
  self_thread: {
    id_str: string;
  };
}

export interface Photo {
  backgroundColor: {
    red: number;
    green: number;
    blue: number;
  };
  cropCandidates: {
    x: number;
    y: number;
    w: number;
    height: number;
  }[];
  expandedUrl: string;
  url: string;
  width: number;
  height: number;
}

export interface Video {
  aspectRatio: [number, number];
  contentType: string;
  durationMs: number;
  mediaAvailability: {
    status: string;
  };
  poster: string;
  variants: VideoVariant[];
  videoId: {
    type: string;
    id: string;
  };
  viewCount: number;
}

export interface Media {
  display_url: string;
  expanded_url: string;
  indices: Indices;
  url: string;
}

export interface User {
  id_str: string;
  name: string;
  profile_image_url_https: string;
  screen_name: string;
  verified: boolean;
  is_blue_verified: boolean;
  profile_image_shape: string;
}

interface Entities {
  hashtags: Hashtag[];
  urls: Url[];
  user_mentions: UserMention[];
  media: Media[] | undefined;
}

interface Hashtag {
  indices: Indices;
  text: string;
}

interface Url {
  display_url: string;
  expanded_url: string;
  incides: Indices;
  url: string;
}

interface UserMention {
  id_str: string;
  indices: Indices;
  name: string;
  screen_name: string;
}

interface EditControl {
  edit_tweet_ids: string[];
  editable_until_msecs: string;
  is_edit_eligible: boolean;
  edits_remaining: number;
}

interface MediaDetails {
  display_url: string;
  expanded_url: string;
  ext_media_availability: {
    status: string;
  };
  ext_media_stats: {
    view_count: number;
  };
  indices: Indices;
  media_url_https: string;
  original_info: {
    height: number;
    width: number;
  };
  sizes: Sizes;
  type: "photo" | "video";
  url: string;
  video_info: VideoInfo;
}

interface Size {
  h: number;
  resize: "fit" | "crop";
  w: number;
}

interface Sizes {
  large: Size;
  medium: Size;
  small: Size;
  thumb: Size;
}

interface VideoInfo {
  aspect_ratio: [number, number];
  duration_millis: number;
  variants: Variant[];
}

interface Variant {
  bitrate: number;
  content_type: string;
  url: string;
}

interface VideoVariant {
  type: string;
  src: string;
}
