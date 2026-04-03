# 🎬 HOMIEFLIX — Hero Slideshow Media

## What this folder does
Every photo and video you put here plays as the **animated hero background** on the Home page. Photos display with a cinematic Ken Burns effect; videos actually play in full before moving to the next clip.

---

## How to add your 30 photos & videos

### Step 1 — Drop your files here
```
assets/images/
├── 1.jpg
├── 2.jpg
├── 3.png
├── ...
├── 26.mp4
├── 27.mov
└── manifest.json   ← edit this file
```
Supported formats: **`.jpg` `.jpeg` `.png` `.webp`** for photos | **`.mp4` `.mov` `.webm`** for videos

---

### Step 2 — Edit manifest.json

Open `manifest.json` and add each file in the **exact order** you want them to play:

```json
{
  "title": "HICET Family – The Golden Period",
  "description": "The Family by BOND not by BLOOD",
  "items": [
    { "file": "yourphoto.jpg",  "type": "image", "caption": "" },
    { "file": "another.png",   "type": "image", "caption": "" },
    { "file": "clip1.mp4",     "type": "video", "caption": "" },
    { "file": "sunny_day.jpg", "type": "image", "caption": "" }
  ]
}
```

> **Rules:**
> - `"type"` must be exactly `"image"` or `"video"`
> - `"file"` is just the filename — no path needed
> - Order matters: the slideshow plays top-to-bottom, then loops
> - `"caption"` is optional, leave blank `""` if you don't need it

---

### Step 3 — Refresh the browser
That's it! The home page hero will immediately start cycling through your photos and videos.

---

## Timing
| Type | Duration |
|------|----------|
| 📸 Photo | 5 seconds each (with Ken Burns zoom/pan) |
| 🎬 Video | Full video length, then advances |

---

## Tips
- **Best photo size**: 1920×1080 or larger landscape photos look best
- **Video length**: Keep clips under 30 seconds for a good flow
- **Order**: Start with a strong photo for the first impression (it loads before the slideshow fetch)
- **Naming**: You can use any filename — `birthday.jpg`, `clip_rooftop.mp4`, etc. Just match it in the manifest
