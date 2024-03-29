import dotenv from "dotenv";
import {
  GatewayIntentBits,
  Events,
  Client,
  Partials,
  APIEmbed,
} from "discord.js";
import { fetchTweet } from "../lib/fetch";
import http from "http";

dotenv.config();

http
  .createServer(function (req, res) {
    res.write("OK");
    res.end();
  })
  .listen(8080);

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

export const format_quoted = (text: string) => {
  return text
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
};

export const createEmbeds = async (content: string): Promise<APIEmbed[]> => {
  const TwitterOrXlinks = content.matchAll(
    /https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^/]+\/status\/(?<id>\d+)/g
  );

  // Ignore if no id or more than 10
  const ids = Array.from(TwitterOrXlinks, (match) => match.groups?.id).filter(
    (id) => id !== undefined
  ).filter((_, _i) => _i <= 9) as string[];

  if (ids.length === 0) {
    return [];
  }

  const responses = await Promise.all(
    ids.map((id) =>
      fetchTweet(id).catch((error) => {
        console.error("Error fetching tweet:", error);
        return null;
      })
    )
  );

  const embedPromises = responses.map(async (response) => {
    if (!response) {
      return [];
    }

    const {
      id,
      text,
      user,
      photos,
      video,
      likes,
      replies,
      in_reply_to_screen_name,
      in_reply_to_url,
      in_reply_to_status_id_str,
      og_image_url,
      quoted_tweet,
      created_at
    } = response;

    const photoUrls = photos.map((photo) => photo.url);
    if (video) photoUrls.unshift(video.poster);

    let description = text;

    if (quoted_tweet) {
      const quoted_tweet_text = format_quoted(quoted_tweet.text);

      description = `${text}\n\n[Replying to @${quoted_tweet.user.screen_name}](https://twitter.com/${quoted_tweet.user.screen_name}/status/${quoted_tweet.id_str})\n\n${quoted_tweet_text}`;
    }

    if (in_reply_to_status_id_str) {
      const replyTweet = await fetchTweet(in_reply_to_status_id_str).catch(
        (error) => {
          console.error("Error fetching reply tweet:", error);
          return null;
        }
      );

      if (replyTweet) {
        const quotedReply = format_quoted(replyTweet.text);

        description = `${quotedReply}\n\n[Replying to @${in_reply_to_screen_name}](${in_reply_to_url})\n\n${text}`;
      }
    }

    const embed: APIEmbed = {
      description,
      color: 0x1da1f2,
      image:
        photoUrls.length > 0
          ? { url: photoUrls[0] }
          : og_image_url
            ? { url: og_image_url }
            : undefined,
      author: {
        name: `${user.name} (@${user.screen_name})`,
        url: `https://twitter.com/${user.screen_name}`,
        icon_url: user.profile_image_url_https,
      },
      footer: {
        icon_url:
          "https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png",
        text: "X (Twitter)"
      },
      timestamp: created_at,
    };

    embed.fields = [
      {
        name: "𝕏",
        value: `[Open in X](https://twitter.com/${user.screen_name}/status/${id})`,
        inline: true,
      },
    ];

    if (likes > 0) {
      embed.fields = [
        ...embed.fields ?? [],
        {
          name: "♥️",
          value: likes.toLocaleString(),
          inline: true,
        },
      ];
    }

    if (replies > 0) {
      embed.fields = [
        ...embed.fields ?? [],
        {
          name: "💬",
          value: replies.toLocaleString(),
          inline: true,
        },
      ];
    }

    return [embed];
  });

  const resolvedEmbeds = await Promise.all(embedPromises);
  return resolvedEmbeds.flat();
};

client.on(Events.MessageCreate, async (message) => {
  const embeds = await createEmbeds(message.content);
  if (embeds.length > 0) {
    await message.reply({ embeds, allowedMentions: { repliedUser: false }, flags: [4096] });
  }
});

client.once(Events.ClientReady, () => {
  console.log("Ready!");
  if (client.user) {
    console.log(client.user.tag);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

process.on('uncaughtException', (error: Error) => {
  console.error('未処理の例外が発生しました:', error);
});

process.on('unhandledRejection', (reason: {} | null | undefined, promise: Promise<any>) => {
  console.error('未処理のプロミス拒否が発生しました:', promise, '理由:', reason);
});