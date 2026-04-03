# 🎬 HOMIEFLIX — Memory Streaming Platform

A Netflix-style personal memories streaming app. Pure HTML, CSS, Vanilla JS.

## 📂 File Structure

```
homieflix/
├── index.html          ← Home (Netflix style)
├── timeline.html       ← Cinematic timeline
├── css/
│   ├── homieflix.css   ← Main styles
│   └── animations.css  ← All animations
├── js/
│   ├── app.js          ← Main app logic
│   └── timeline.js     ← Timeline page
├── data/
│   └── memories.js     ← YOUR MEMORIES DATA (edit this!)
├── assets/
│   ├── posters/        ← Add your poster images here
│   ├── music/          ← Add ambient.mp3 here
│   └── videos/         ← Add videos here (optional)
└── vercel.json         ← Deploy to Vercel
```

## 🚀 Quick Start

1. Open `index.html` in your browser
2. Edit `data/memories.js` to add YOUR photos and memories
3. Add `assets/music/ambient.mp3` for background music

## ✏️ How to Add Your Memories

Open `data/memories.js` and edit the `MEMORIES` array:

```js
{
  id: 0,
  title: "Your Memory Title",
  year: "2023",
  tags: ["Friends", "Beach"],
  description: "Your memory description here...",
  duration: "2h 15m",
  poster: "assets/posters/your-poster.jpg",      // or Unsplash URL
  heroImage: "assets/posters/your-hero.jpg",
  category: "best",   // best | friends | trips | emotional
  slides: [
    { img: "assets/posters/slide1.jpg", caption: "Caption here 🌅" },
    { img: "assets/posters/slide2.jpg", caption: "Another moment 🎉" },
  ]
}
```

## 🌐 Deploy to Vercel

```bash
npm i -g vercel
cd homieflix
vercel --prod
```

That's it! Your HOMIEFLIX goes live in 30 seconds.

## 🎬 Features

- ✅ Netflix-style intro animation (HOMIEFLIX logo reveal)
- ✅ Hero banner with featured memory
- ✅ Horizontal scroll rows (Best, Friends, Trips, Emotional)
- ✅ Hover zoom card animations
- ✅ Memory detail modal (like Netflix movie page)
- ✅ Cinematic fullscreen player with transitions
- ✅ Surprise mode before playback (random effects!)
- ✅ Secret locked memory (hold 3s to unlock)
- ✅ Continue Watching (saved in localStorage)
- ✅ My List / Favorites
- ✅ Digital Signature Wall with drawing canvas
- ✅ Cinematic Timeline page
- ✅ Keyboard shortcuts: ← → Space Escape
- ✅ Mobile responsive
- ✅ Vercel deployable

## ⌨️ Keyboard Shortcuts (in Player)
- `Space` — Play/Pause
- `→` — Next slide
- `←` — Previous slide
- `Esc` — Exit player

---
Made with ❤️ for your memories.
