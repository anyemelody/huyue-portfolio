// The Journey — 3 eras, top (newest) -> bottom (oldest), exactly as Yue specified.
// project = { slug, name, meta, hue, img, depth, keys, detail }.
//   img   = HOMEPAGE gallery cover (same as old huyue.space)
//   depth = 'full' (all images + long copy on its page) | 'light' (cover + summary + a few images)
//   keys  = gallery folders in public/assets used to build the project page image gallery
//   detail= copy from content/projects_from_wix.md
export const eras = [
  {
    years: '2023–2026',
    title: 'Creative Coder / Artist',
    build:
      'Built generative &amp; real-time systems in code — shaders, creative-coding tools, and interactive installations where the engineering <i>is</i> the medium.',
    projects: [
      // Creative-coding sketches — each is its own card that links straight to its GitHub repo.
      // TODO(Yue): replace each href with the real GitHub repo URL. Confirm name↔image order matches the page.
      { name: 'Lan Sketch', meta: 'creative coding · live ↗', hue: 270, external: true, href: 'https://anyemelody.github.io/LanSketch/', img: '/assets/creative-coding/7514a4_adffb6f84fdf492aa176d9520fb5f566.gif' },
      { name: 'Mei Sketch', meta: 'creative coding · live ↗', hue: 350, external: true, href: 'https://anyemelody.github.io/MeiSketch/', img: '/assets/creative-coding/7514a4_84db5264d1f549d0a81c4d2d5bc03bb0.gif' },
      { name: 'Garden', meta: 'creative coding · live ↗', hue: 35, external: true, href: 'https://anyemelody.github.io/Garden/', img: '/assets/creative-coding/7514a4_bd5722793dc04e478178e01f790aba4a.png' },
      { name: 'Green Hair Grass', meta: 'creative coding · live ↗', hue: 110, external: true, href: 'https://anyemelody.github.io/GreenHairGrass/', img: '/assets/creative-coding/7514a4_5aec6b29aa72469ab3530700aa4a16bc.gif' },
      { name: 'Dancing Spring', meta: 'creative coding · live ↗', hue: 95, external: true, href: 'https://anyemelody.github.io/DancingSpring/', img: '/assets/dancing-spring/7514a4_39045e757b174c0cb3c7407a90c953bd.jpg' },
      { name: 'Collatz Conjecture Plant', meta: 'creative coding · live ↗', hue: 215, external: true, href: 'https://anyemelody.github.io/CollatzConjecturePlant/', img: '/assets/creative-coding/7514a4_517b2670290c43708dffa6e92f9f7c2a.gif' },
      { name: 'Sound Emotion', meta: 'creative coding · live ↗', hue: 260, external: true, href: 'https://anyemelody.github.io/SoundEmotion/', img: '/assets/sound-emotion/7514a4_20a46a0b0e694fee90e7e2b814b01a31.png' },
      {
        slug: 'palace-museum', name: 'Palace Museum', meta: 'interactive installation · Beijing 2019', hue: 30,
        img: '/assets/palace-museum/7514a4_02589036a71d42088ffd829aa1601498.gif',
        depth: 'light', keys: ['palace-museum'],
        detail: {
          year: 'Jan 2019', location: 'Beijing', medium: 'Interactive Installation · Digital Experience', client: 'OUTPUT',
          role: ['Interaction Design', 'Animation Design', 'Application Development'],
          tools: ['Unity 3D', 'Kinect', 'Laser RangeFinder'],
          body: 'Interactive digital exhibition at the Palace Museum, Beijing (Jan–Apr 2019) celebrating the Chinese Lunar New Year. Three themes — "Catching New Year Blessing", "Eternal Blossom" and "Frosty Wonderland". I was the key creative technologist responsible for "Eternal Blossom", drawing inspiration from Qing Dynasty paintings.',
        },
      },
      {
        slug: 'rain-rite', name: 'Rain Rite', meta: 'project · (details TBD)', hue: 330,
        depth: 'light', keys: [],
        detail: { body: '(Details to be added — send medium, your role, and assets.)' },
      },
    ],
  },
  {
    years: '2021–2025',
    title: 'Interactive Engineer',
    build:
      'Engineered production AR systems and real-time graphics pipelines — shipping interactive products on platforms used at real scale.',
    projects: [
      {
        slug: 'tiktok-effect-house', name: 'TikTok Effect House', meta: 'TikTok · AR authoring tool', hue: 330,
        img: '/assets/tiktok-effect-house/7514a4_75cd50a9dd1a4bc98c60854f47721bad.gif',
        depth: 'light', keys: ['tiktok-effect-house'],
        detail: {
          year: '2021 – Now', location: 'San Jose', medium: 'TikTok · AR Effects · Desktop Tool', client: 'TikTok',
          role: ['Template Production', 'Education & Tutorial', 'Visual Scripting Feature Design', 'Visual Scripting Development'],
          videoEmbed: 'https://www.youtube-nocookie.com/embed/iMw3da1VIuo?rel=0',
          body: 'Effect House is TikTok’s public desktop tool for creating, publishing and sharing AR effects. I led its Template Team and contributed to visual-scripting feature design and development — helping creators explore new formats through templates, tutorials and live education.',
          links: [['Try Effect House ↗', 'https://effecthouse.tiktok.com/'], ['Original case study ↗', 'https://www.huyue.space/tiktokeffecthouse']],
        },
      },
      {
        slug: 'social-filter-studio', name: 'Social Filter Studio', meta: 'Spark AR · social filters', hue: 288,
        img: '/assets/social-filter-lab/7514a4_7beaa793ab934cb3b6aff773b7b40126.gif',
        depth: 'light', keys: ['social-filter-lab', 'your-claw-machine'],
        detail: {
          medium: 'Spark AR · Social AR · Creative Promotion',
          body: 'A studio of social AR filters built in Spark AR — face-tracking interactions and creative promotional effects (incl. "Your Claw Machine", a face-controlled claw game).',
        },
      },
      {
        slug: 'lotus-love', name: 'Lotus Love', meta: 'Unity · VFX · shader graph', hue: 300, video: true,
        img: '/assets/dreamy-lotus/7514a4_85b62416eb134f95b8b892cfed49ed1c.gif',
        depth: 'light', keys: ['dreamy-lotus'],
        detail: {
          year: 'Sep 2021', location: 'New York', medium: 'Unity · VFX · Shader Graph', client: 'Individual Work',
          tools: ['Unity 3D', 'VFX Graph', 'Shader Graph'],
          body: 'A real-time VFX study in Unity. Lotus VFX breakdown — Initialize: remap each particle\'s distance from the origin to drive size & lifetime (far particles smaller but longer-lived). Update: Turbulence + VectorFieldForce, with Perlin noise driving intensity/drag/frequency. Output: particles face the camera for a soft circular bloom.',
        },
      },
      {
        slug: 'dreamy-galaxy', name: 'Dreamy Galaxy', meta: 'Unity · interactive planetarium', hue: 255, video: true,
        img: '/assets/dreamy-galaxy/7514a4_cc34a2e1637942198b4c422ffff15611.png',
        depth: 'light', keys: ['dreamy-galaxy'],
        detail: {
          year: 'Oct 2020', location: 'New York', medium: 'Unity', client: 'Individual Work / Teaching',
          tools: ['Unity 3D'],
          body: 'Built while teaching an online "AR Application Development" course for OF COURSE (Shanghai). A class project: an interactive planetarium experience designed to inspire curiosity and popularize knowledge — part of a syllabus and demo set I created from scratch.',
        },
      },
      {
        slug: 'animal-party', name: 'Animal Party', meta: 'Unity · SDF VFX', hue: 90, video: true,
        img: '/assets/animal-love/7514a4_543f6619262a4464b7bb65cecb762ea0.gif',
        depth: 'light', keys: ['animal-love'],
        detail: {
          year: 'Oct 2021', location: 'New York', medium: 'Unity', client: 'Individual Work',
          tools: ['Unity 3D', 'VFX Graph'],
          body: 'A demo exploring Unity3D\'s VFX Signed Distance Field (SDF) capability along with other force effects.',
        },
      },
    ],
  },
  {
    years: '2017–2020',
    title: 'Creative Technologist',
    build:
      'Built branded immersive experiences end-to-end — AR/VR apps and data-driven work for global brands, on real deadlines.',
    projects: [
      {
        slug: 'hershey-pop-kisses', name: 'Hershey Pop Kiss Studio', meta: 'Havas · Daydream VR game', hue: 42,
        img: '/assets/hershey-pop-kisses/7514a4_f80385002c0949559cbe0150988b35c3.png',
        depth: 'full', keys: ['hershey-pop-kisses'],
        detail: {
          year: 'Oct 2017', location: 'New York', medium: 'Daydream VR · Unity · Mobile Game', client: 'Havas Worldwide (for The Hershey Company)',
          role: ['Creative Coding', 'Interaction Design', 'Motion/Animation Design & Implementation'],
          tools: ['Unity 3D', 'Google Daydream SDK', 'Chromecast', 'Cinema 4D'],
          videoEmbed: 'https://player.vimeo.com/video/282921770?autoplay=false&muted=false&loop=false&byline=false&portrait=false&title=false',
          body: 'An interactive Google Daydream VR game installation for The Hershey Company, exhibited at Hershey Stores in Pennsylvania and Las Vegas. I built creative coding, interaction design, and motion/animation implementation for an experience where visitors become Kiss designers.',
          link: ['Original case study ↗', 'https://www.huyue.space/hershey-pop-kisses'],
        },
      },
      {
        slug: 'vuse-unboxing-ar', name: 'VUSE Alto Unboxing AR', meta: 'Havas · AR mobile', hue: 160,
        img: '/assets/vuse-unboxing-ar/7514a4_c3c2bb9d72354e75bdc3b35f95fd981c.png',
        depth: 'light', keys: ['vuse-unboxing-ar'],
        detail: {
          year: 'Aug 2018', location: 'New York', medium: 'AR · Unity · Mobile Application', client: 'Havas Worldwide',
          role: ['Creative Coding', 'Visual & Animation Design', 'Interaction Design'],
          tools: ['Unity 3D', 'Vuforia Image Recognition', 'Cinema 4D'],
          videoEmbed: 'https://player.vimeo.com/video/312750923?autoplay=true&muted=true&loop=false&byline=false&portrait=false&title=false',
          body: 'A mobile "virtual product trial" AR experience for VUSE\'s Alto launch. Users explore the product through layered assembly, components and x-ray views; I led creative coding, visual/motion design and interaction design across the Unity application.',
          link: ['Original case study ↗', 'https://www.huyue.space/vuse-unboxing-ar'],
        },
      },
      {
        slug: 'ibm-watson', name: 'IBM Watson Holobot', meta: 'Havas · AR mobile', hue: 198,
        img: '/assets/ibm-watson-holobot/7514a4_616268afb0984fa1ae0c3329b48c2e9c.png',
        depth: 'light', keys: ['ibm-watson-holobot'],
        detail: {
          year: 'Mar 2018', location: 'New York', medium: 'AR · Unity · Mobile App', client: 'Havas Worldwide',
          role: ['Creative Programming', 'Visual & Animation Design', 'Interaction Design'],
          tools: ['Unity 3D', 'Vuforia Ground Recognition', 'Cinema 4D'],
          videoEmbed: 'https://player.vimeo.com/video/303205600?autoplay=true&muted=true&loop=false&byline=false&portrait=false&title=false',
          body: 'IBM Watson Holobot — "The Future of the Call Center" — is an AR storytelling experience unveiled at IBM Think 2018. As lead creative technologist, I designed and implemented visual systems, motion/interaction, and particle animation to explain how Watson supports call-center operations.',
          link: ['Original case study ↗', 'https://www.huyue.space/ibm-watson-holobot'],
        },
      },
      {
        slug: 'santander', name: "Santander — In Someone Else's Shoes", meta: 'AR mobile · 🏆 Webby 2019', hue: 8,
        img: '/assets/santander/7514a4_4b08e2fd1ad3470d9c736aac76c31b23.jpg',
        depth: 'light', keys: ['santander'],
        detail: {
          year: 'Oct 2018', location: 'New York', medium: 'Mobile App · Unity3D · ARKit · ARCore', client: 'Team Work',
          award: '🏆 Winner — 2019 Webby Award, Augmented Reality',
          videoEmbed: 'https://player.vimeo.com/video/421067928?autoplay=false&muted=false&loop=false&byline=false&portrait=false&title=false',
          body: 'In Someone Else\'s Shoes was created for Santander to donate $10 for every mile walked to Boston nonprofit Heading Home. The AR mobile experience combines volumetric video and immersive storytelling to make empathy tangible; it won the 2019 Webby Award for Augmented Reality.',
          link: ['Original case study ↗', 'https://www.huyue.space/santanderinsomeoneelseshoes'],
        },
      },
      {
        slug: 'speak-your-mind', name: 'Speak Your Mind', meta: 'Havas · three.js living logo', hue: 190,
        img: '/assets/speak-your-mind/7514a4_1ffab849fd8e482d8f07db40eb5f8f2f.gif',
        depth: 'light', keys: ['speak-your-mind'],
        detail: {
          year: 'Aug 2019', location: 'New York', medium: 'Interactive Website · Creative Coding · Data Visualization', client: 'Havas Worldwide',
          role: ['Ideation', 'Creative Coding'],
          tools: ['three.js', 'vue.js', 'html'],
          body: 'The Living Logo — the first 3D dynamic logo indicating the volume of the conversation about mental health, built for the 2019 Mental Health Global Campaign. The more people pledge support, the more the logo grows and gets louder.',
          link: ['gospeakyourmind.org ↗', 'https://www.gospeakyourmind.org/'],
        },
      },
    ],
  },
]
