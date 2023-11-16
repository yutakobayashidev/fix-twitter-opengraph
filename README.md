# fix-twitter-opengraph

Discord BOT to fix Twitter's OpenGraph that appears when sending URLs containing x.com or twitter.com.

![the student ran an account noting events with free food at the university, but is facing punishment from the university after he allegedely advertised a private event and took food from it, though his lawyers dispute some details.](https://github.com/yutakobayashidev/fix-twitter-opengraph/assets/91340399/e5710e1e-add6-42b5-9be1-341a4154e34a)

## invite link

https://discord.com/api/oauth2/authorize?client_id=1174659737153982535&permissions=92160&scope=bot

## feature

- Like! Show the number of
- View original post and link to reply
- Image display
- Display OG images of URL destinations included in tweets

## environment variables

```
cp .env.example .env
```

```
DISCORD_BOT_TOKEN=for # Discord BOT Token
```

## run

### dev

```
pnpm dev
```

### production

```
pnpm compile
pnpm start
```

## Special Thanks

https://github.com/MatthewStanciu/twitter-og
