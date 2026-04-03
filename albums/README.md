# 📁 HOMIEFLIX — Album Media Folder

## How to Add Your Photos & Videos

Each album has its own folder here. Just **drop your photos and videos** into the correct folder, then update the `manifest.json` to list them.

## Folder Structure
```
albums/
├── hicet-family/
│   ├── manifest.json      ← list your files here
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── clip1.mp4
├── golden-hour-moments/
│   ├── manifest.json
│   └── ...
└── ...
```

## Editing manifest.json

Open the folder for your album and edit `manifest.json`:

```json
{
  "photos": [
    "photo1.jpg",
    "photo2.jpg",
    "birthday_cake.jpg",
    "group_selfie.png"
  ],
  "videos": [
    "clip1.mp4",
    "reels_vid.mov"
  ]
}
```

> **Important:** Only list the **filename**, not the full path. The app automatically prepends the correct path.

## Album Folder Names

| Album Name          | Folder Name           |
|---------------------|-----------------------|
| HICET Family        | `hicet-family`        |
| Golden Hour Moments | `golden-hour-moments` |
| Night City Lights   | `night-city-lights`   |
| Mountain Adventures | `mountain-adventures` |
| Beachside Memories  | `beachside-memories`  |
| The Wedding Story   | `the-wedding-story`   |
| Birthday Bash       | `birthday-bash`       |
| Graduation Day      | `graduation-day`      |
| Winter Wonderland   | `winter-wonderland`   |
| Rainy Day Vibes     | `rainy-day-vibes`     |
| Star Gazing Night   | `star-gazing-night`   |
| Exploring the Wild  | `exploring-the-wild`  |
| Under the Neon      | `under-the-neon`      |
| Coastal Escapes     | `coastal-escapes`     |
| Midnight Rooftops   | `midnight-rooftops`   |
| The Great Outdoors  | `the-great-outdoors`  |
| Urban Jungle        | `urban-jungle`        |
| Cozy Coffee Dates   | `cozy-coffee-dates`   |
| Dreamy Sunsets      | `dreamy-sunsets`      |
| Friends Forever     | `friends-forever`     |

## Supported Formats

- **Photos:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.heic`
- **Videos:** `.mp4`, `.mov`, `.webm`, `.avi`

## Deploying to Vercel

1. Add all your photos/videos to the correct folders
2. Update each `manifest.json`
3. Push to GitHub → Deploy on Vercel
4. **Everyone who visits the link will see your photos!** 🎉
