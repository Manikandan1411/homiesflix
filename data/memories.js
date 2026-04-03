// data/memories.js — Static memory data configuration

// 1. ADD YOUR ALBUMS HERE
// "folder" must perfectly match the folder name in "albums/"
// "title" is how it will appear on the website.
const MY_ALBUMS = [
  {
    folder: "hicet-family",
    title: "HICET Family",
    photos: [],
    videos: []
  },
  {
    folder: "JV BIRTHDAY",
    title: "JV BIRTHDAY",
    photos: ["photo1.jpeg", "photo2.jpeg", "photo3.jpeg"],
    videos: ["clip1.mp4", "clip2.mp4"]
  },
  {
    folder: "ALIYAR TRIP",
    title: "ALIYAR TRIP",
    photos: ["photo1.jpeg", "photo2.jpeg", "photo3.jpeg", "photo4.jpeg", "photo5.jpeg", "photo6.jpeg", "photo7.jpeg", "photo8.jpeg", "photo9.jpeg", "photo10.jpeg", "photo11.jpeg", "photo12.jpeg", "photo13.jpeg", "photo14.jpeg", "photo15.jpeg", "photo16.jpeg", "photo17.jpeg", "photo18.jpeg", "photo19.jpeg", "photo20.jpeg", "photo21.jpeg", "photo22.jpeg", "photo23.jpeg", "photo24.jpeg", "photo25.jpeg", "photo26.jpeg", "photo27.jpeg", "photo28.jpeg", "photo29.jpeg", "photo30.jpeg", "photo31.jpeg", "photo32.jpeg", "photo33.jpeg", "photo34.jpeg", "photo35.jpeg", "photo36.jpeg", "photo37.jpeg", "photo38.jpeg"],
    videos: ["clip1.mp4", "clip2.mp4", "clip3.mp4", "clip4.mp4", "clip5.mp4", "clip6.mp4"]
  },
  {
    folder: "1st GANG PHOTO",
    title: "1st GANG PHOTO",
    photos: ["photo1.jpeg", "photo2.jpeg", "photo3.jpeg", "photo4.jpeg", "photo5.jpeg", "photo6.png", "photo7.jpeg", "photo8.jpeg", "photo9.jpg", "photo10.jpeg", "photo11.jpeg", "photo12.jpeg", "photo13.jpeg", "photo14.png", "photo15.png"],
    videos: ["clip1.mp4", "clip2.mp4"]
  },
  {
    folder: "RISHI ANNA SENDOFF",
    title: "RISHI ANNA SENDOFF",
    photos: ["photo1.jpeg", "photo2.jpeg", "photo3.jpeg", "photo4.jpeg", "photo5.jpeg", "photo6.jpeg"],
    videos: ["clip1.mp4"]
  },
  {
    folder: "ATHIRADI SYMPOSIUM",
    title: "ATHIRADI SYMPOSIUM",
    photos: ["photo1.jpeg", "photo2.jpeg", "photo3.jpeg", "photo4.jpeg", "photo5.jpeg", "photo6.jpeg", "photo7.jpeg", "photo9.jpeg", "photo10.jpeg", "photo11.jpeg", "photo12.jpeg", "photo13.jpeg"],
    videos: ["clip1.mp4"]
  },
  {
    folder: "ENNODA BDAY 2025",
    title: "ENNODA BDAY 2025",
    photos: ["photo1.jpeg", "photo2.jpeg", "photo3.jpeg", "photo4.jpeg", "photo5.jpeg", "photo6.jpeg"],
    videos: ["clip1.mp4", "clip2.mp4"]
  },
  {
    folder: "TIP TO RISHI ANNA'S SISTER MARRIAGE",
    title: "TIP TO RISHI ANNA'S SISTER MARRIAGE",
    photos: ["photo1.jpeg", "photo2.jpeg", "photo3.jpeg", "photo4.jpeg", "photo5.jpeg", "photo6.jpeg", "photo7.jpeg", "photo8.jpeg", "photo9.jpeg", "photo10.jpeg", "photo11.jpeg", "photo12.jpeg", "photo13.jpeg", "photo14.jpeg"],
    videos: ["clip1.mp4"]
  },
  {
    folder: "ONE LAST TIME MEETUP",
    title: "ONE LAST TIME MEETUP",
    photos: ["photo1.jpeg", "photo2.jpeg"],
    videos: ["clip1.mp4", "clip2.mp4", "clip3.mp4", "clip4.mp4", "clip5.mp4", "clip6.mp4", "clip7.mp4"]
  },
  {
    folder: "MANDI TIMERS",
    title: "MANDI TIMES",
    photos: ["photo1.jpeg", "photo2.jpeg", "photo3.jpeg", "photo4.jpeg", "photo5.jpeg", "photo6.jpeg"],
    videos: ["clip1.mp4", "clip2.mp4", "clip3.mp4"]
  },
  {
    folder: "MY 1ST THEATER EXP IN CBE",
    title: "MY 1ST THEATER EXP IN CBE",
    photos: ["photo1 (1).jpeg", "photo2.jpeg", "photo3.jpeg", "photo4.jpeg", "photo5.jpeg", "photo6.jpeg", "photo7.jpeg", "photo8.jpeg"],
    videos: []
  }

];

let MEMORIES = [];

async function initMemoriesData() {
  MEMORIES = [];

  for (let i = 0; i < MY_ALBUMS.length; i++) {
    const album = MY_ALBUMS[i];
    const basePath = `albums/${album.folder}`;
    let manifest = { photos: album.photos || [], videos: album.videos || [] };

    // Attempt to dynamically fetch manifest.json if empty (useful if they run a live server)
    if (manifest.photos.length === 0 && manifest.videos.length === 0) {
      try {
        const res = await fetch(`${basePath}/manifest.json?t=${Date.now()}`);
        if (res.ok) {
          const fetched = await res.json();
          manifest.photos = fetched.photos || [];
          manifest.videos = fetched.videos || [];
        }
      } catch (e) {
        console.log("Fetch failed or local file:// protocol blocked for", album.title);
      }
    }

    let slides = [];
    let poster = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"; // fallback

    // Load photos
    if (manifest.photos.length > 0) {
      poster = `${basePath}/${manifest.photos[0]}`; // The 1st photo inside the album becomes the cover!
      manifest.photos.forEach(p => slides.push({ type: "image", src: `${basePath}/${p}`, caption: "" }));
    }
    // Load videos
    if (manifest.videos.length > 0) {
      manifest.videos.forEach(v => slides.push({ type: "video", src: `${basePath}/${v}`, caption: "" }));
    }

    // Special behavior for the Hero (Index 0) album
    if (i === 0) {
      poster = "assets/images/hero-bg.jpeg";
      // Keep your custom emotional slides for the hero video button
      if (slides.length === 0 || album.folder === "hicet-family") {
        slides = [
          { type: "video", src: "assets/images/1.mp4", caption: "Where it all began... ✨" },
          { type: "video", src: "assets/images/2.mp4", caption: "Endless laughter, unforgettable days." },
          { type: "video", src: "assets/images/3.mp4", caption: "The bond that time can never fade. ❤️" },
          { type: "video", src: "assets/images/4.mp4", caption: "Through thick and thin, always together." },
          { type: "video", src: "assets/images/5.mp4", caption: "Finding family in friends. 🥺" },
          { type: "video", src: "assets/images/6.mp4", caption: "Every crazy moment turned into a golden memory." },
          { type: "video", src: "assets/images/7.mp4", caption: "Wish we could freeze these moments forever. ⏳" },
          { type: "video", src: "assets/images/9.mp4", caption: "Not just a group, it's a brotherhood. 💪" },
          { type: "video", src: "assets/images/10.mp4", caption: "The smiles that hide a thousand unspoken stories." },
          { type: "video", src: "assets/images/11.mp4", caption: "No matter where life takes us..." },
          { type: "video", src: "assets/images/12.mp4", caption: "We will always be the HICET Family. Forever. ♾️" },
          { type: "video", src: "assets/images/13.mp4", caption: "Distance means nothing when the bond means everything. ❤️" },
          { type: "video", src: "assets/images/14.mp4", caption: "The chaotic memories that make us who we are." },
          { type: "video", src: "assets/images/15.mp4", caption: "Different paths, same unbreakable connection." },
          { type: "video", src: "assets/images/16.mp4", caption: "From strangers in a classroom to a family we chose." },
          { type: "video", src: "assets/images/17.mp4", caption: "To all the endless conversations and midnight plans." },
          { type: "video", src: "assets/images/18.mp4", caption: "Here's to a lifetime of togetherness. ✨" },
          { type: "video", src: "assets/images/19.mp4", caption: "Every single day was a new wild adventure." },
          { type: "video", src: "assets/images/20.mp4", caption: "The unspoken rule: No one gets left behind." },
          { type: "video", src: "assets/images/21.mp4", caption: "Inside jokes that only we will ever understand." },
          { type: "video", src: "assets/images/23.mp4?v=1", caption: "That feeling of just sitting and doing nothing, together." },
          { type: "video", src: "assets/images/24.mp4?v=1", caption: "Even silence with you all feels like the loudest party." },
          { type: "video", src: "assets/images/25.mp4", caption: "For the moments we didn't know we were making memories." },
          { type: "video", src: "assets/images/26.mp4", caption: "We just knew we were having the time of our lives." },
          { type: "video", src: "assets/images/27.mp4", caption: "Through every argument, we only grew closer." },
          { type: "video", src: "assets/images/28.mp4", caption: "The best chapters of my life feature all of you." },
          { type: "video", src: "assets/images/29.mp4", caption: "Looking back, these truly were the golden days." },
          { type: "video", src: "assets/images/30.mp4", caption: "Someday we'll tell these stories and just smile." },
          { type: "video", src: "assets/images/31.mp4", caption: "Until the very end of the line..." },
          { type: "video", src: "assets/images/32.mp4", caption: "Because once a HOMIE, always a HOMIE. ❤️" },
          { type: "video", src: "assets/images/33.mp4", caption: "Because once a HOMIE, always a HOMIE. ❤️" },
          { type: "video", src: "assets/images/34.mp4", caption: "Because once a HOMIE, always a HOMIE. ❤️" },
          { type: "video", src: "assets/images/35.mp4", caption: "Because once a HOMIE, always a HOMIE. ❤️" }
        ];
      }
    }

    MEMORIES.push({
      id: i,
      title: album.title,
      slug: album.folder,
      folderPath: `${basePath}/`,
      year: new Date().getFullYear().toString(),
      tags: ["Album", "Cinematic"],
      description: i === 0
        ? 'The Family by "BOND" not by "BLOOD"'
        : `A beautiful collection of memories for ${album.title}.`,
      duration: `${slides.length * 5}s`,
      poster: poster,
      heroImage: poster,
      category: "album",
      slides: slides
    });
  }
}


const TIMELINE_EVENTS = [
  {
    year: "2024",
    title: "First Meet",
    description: "Unexpected meeting ta rishi yaa pathathu that can be change the whole chapter of my life.",
    image: "assets/events/photo1.jpeg"
  },
  {
    year: "2024",
    title: "My Birthday Celebration",
    description: "Naa ennachum pakkala ennoda bday this year evlo special laa irukkum nu",
    image: "assets/events/photo2.jpeg"
  },
  {
    year: "2024",
    title: "BrookeFields Mall Trip & season 1 ends",
    description: "Ajith annaku 1st time ponathu appo thaan ajith anna vee pathathu.",
    image: "assets/events/photo3.jpg?v=1"
  },
  {
    year: "2025",
    title: "Jeevitha akka intro",
    description: "In the start of jan laa thaan jeevitha akka kitta pesa start pannathu she become close to me like a blooded sister.",
    image: "assets/events/photo4.jpeg"
  },
  {
    year: "2025",
    title: "NGP college With Ajith anna & Karthick anna",
    description: "Karthick anna naa ennaku romba payam starting from this NGP college ku naa,ajith anna & karthick anna ellarum ponam next thaan karthick anna kitta pesa start panne ",
    image: "assets/events/photo5.jpeg"
  },
  {
    year: "2025",
    title: "Rachel Akka Birthday",
    description: "Feb laa rachel akka birthday so appo laa irundhu thaan rachel akka kuda close saa pesa start pannathu .",
    image: "assets/events/photo6.jpeg"
  },
  {
    year: "2025",
    title: "Harrish jayaraj Concert",
    description: "march laa harish jayaraj concert nandandhuchu edhuku naanum rishi annanu pathathulam fun thaan rishi annaku vera harrish naa romba pidikkum.",
    image: "assets/events/photo7.jpeg"
  },
  {
    year: "2025",
    title: "Theater experience with Rishi anna",
    description: "concert next day ennoda family laa ulla ellarum rishi yaa pathanga oru function laa apparam maa 1st time coimbatore laa theater ku poran adhuvum murmur movie ku.",
    image: "assets/events/photo8.jpeg"
  },
  {
    year: "2025",
    title: "The problem",
    description: "oru chinna problem naala night 12:00 clock juice kudikka ponthu",
    image: "assets/events/photo9a.jpeg"
  },
  {
    year: "2025",
    title: "Season 2 ends",
    description: "in between laa pala problem ku apparam may laa 3rd year raa mudikkaranga so next 4th year ku varamattanga nu thaan but vandhanga.",
    image: "assets/events/photo9.jpeg"
  },
  {
    year: "2025",
    title: "Ganging",
    description: "After rachel akka love panna start pannathuku apparam naanga gang kaa vandha 1st place HICET auditorium.",
    image: "assets/events/photo10.jpeg"
  },
  {
    year: "2025",
    title: "Aliyar Trip",
    description: "After naanga gang kaa naanu,ajith anna, karthick anna, surya anna , rishi anna,jeevitha akka,rachek akka ellarum 1st pomnna spot aliyar dam",
    image: "assets/events/photo11.jpeg"
  },
  {
    year: "2025",
    title: "Thiruvarur Trip",
    description: "Apparam naanum ajith annanum rishi anna avunga akka marriage ku august ponam andhuthu thaan rishi anna odissa pothu 1st time evlo long & 1st time oru marriage ku ennoda family illama ponathu .",
    image: "assets/events/photo12.jpeg"
  },
  {
    year: "2025",
    title: "Jeevitha akka birthday",
    description: "Sep laa jeevitha akka birthday & anniku thaan department flash mob vera",
    image: "assets/events/photo13.jpeg"
  },
  {
    year: "2025",
    title: "Sympo",
    description: "Sympo laa nadakkatha kuthaa last taa sorukuda podala",
    image: "assets/events/photo14.jpeg"
  },
  {
    year: "2025",
    title: "Again ennoda Birthday",
    description: "endha varusham ennoda bday vaa marakkave mudiyathu because 1st time ennaku oru gift varthu adhu endha clg laa from rishi anna kitta irundhu endha year ennathu alarm vachu wish panna neriya peru irukkanga",
    image: "assets/events/photo15.jpeg"
  },
  {
    year: "2025",
    title: "season 3 ends",
    description: "again endha season num pala problem ku apparam mudiyuthu",
    image: "assets/events/photo16.jpeg"
  },
  {
    year: "2026",
    title: "One last season",
    description: "endha season ku yaarum varala ellarum photo call thaan",
    image: "assets/events/photo17.jpeg"
  },
  {
    year: "2026",
    title: "Farewell",
    description: "march 17, 2026 anniku thaan farewell nadakkuthu endha 2 years jounery laa avlo irukkum but without RISHI ANNA,AJITH ANNA, KARTHICK ANNA, PRAVEEN ANNA, SURYA MAMMA, RACHEL AKKA,JEEVITHA AKKA, MONIKAN AKKA, MANIMALA AKKA",
    image: "assets/events/photo18.jpeg?v=1"
  },
];

const SECRET_MEMORY = {
  title: "For You, Always 💌",
  message: "If you're reading this, you held on long enough. This one's just for you. Every single memory we made — every laugh, every late night, every 'I'm outside' text — I wouldn't trade it for anything in the world. Here's to us. Always.",
  emoji: "❤️"
};
