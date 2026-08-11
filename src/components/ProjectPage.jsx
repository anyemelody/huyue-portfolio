import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { bySlug } from '../data/projects.js'
import ProjectSlides from './ProjectSlides.jsx'
import ProjectHScroll from './ProjectHScroll.jsx'

const HOME_CASE_ORDER = ['aige', 'tiktok-effect-house', 'hershey-pop-kisses', 'ibm-watson', 'vuse-unboxing-ar', 'palace-museum', 'santander']

const plain = (value = '') => value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
const paragraphs = (value = '') => value.split(/\n{2,}/).map((part) => plain(part.replace(/^#{2,3}\s.*\n?/, ''))).filter(Boolean)
const storySections = (value = '', fallback = '') => {
  const sections = []
  let active = null
  value.split(/\n{2,}/).forEach((block) => {
    const lines = block.trim().split('\n')
    const heading = lines[0]?.match(/^#{2,3}\s+(.+)/)
    if (heading) {
      active = { title: plain(heading[1]), body: plain(lines.slice(1).join(' ')) }
      sections.push(active)
    } else if (active) {
      active.body = [active.body, plain(block)].filter(Boolean).join(' ')
    }
  })
  return sections.filter((section) => section.body).length
    ? sections.filter((section) => section.body)
    : [{ title: 'Project approach', body: fallback }]
}

function makeAigeDeck(project) {
  const projectIndex = HOME_CASE_ORDER.indexOf(project.slug)
  const previousSlug = HOME_CASE_ORDER[(projectIndex - 1 + HOME_CASE_ORDER.length) % HOME_CASE_ORDER.length]
  const nextSlug = HOME_CASE_ORDER[(projectIndex + 1) % HOME_CASE_ORDER.length]
  const effectImages = [
    'transform_me.gif', 'random_pick.gif', 'personality_test.gif',
    'scratch_to_reveal.gif', 'flip_reveals.gif', 'blocks_game.gif',
    'social_randomizer.gif', 'drop_it.gif', 'which_ai_character_am_i.gif',
  ].map((file) => ({ src: `/assets/aige/${file}`, ratio: '2 / 3' }))

  return {
    slug: project.slug,
    title: 'AI Generate Effects',
    hero: project.cover,
    hideHero: true,
    video: project.video || null,
    embed: null,
    kicker: 'HIGHLIGHT PROJECT / CASE STUDY',
    lead: 'AI Generate Effects is a generative feature in TikTok Effect House that turns a written idea into a runnable AR effect.',
    body: 'Creators can begin with a prompt, generate an effect, refine it in the editor, and publish it directly to TikTok.',
    roles: ['AI system design', 'Agent architecture', 'Evaluation system'],
    facts: [['CLIENT', 'TikTok'], ['PLATFORM', 'TikTok Effect House'], ['TIMELINE', '2024 — PRESENT']],
    link: ['TRY CREATE WITH AI ↗', 'https://effecthouse.tiktok.com/learn/guides/ai-capabilities/create-with-ai'],
    media: [],
    sections: [
      {
        title: 'User Experience', kicker: '02 / USER EXPERIENCE',
        body: 'Open Create with AI in TikTok Effect House to start a new effect. Describe what you want to make, generate a working effect, then keep refining it in the editor before publishing directly to TikTok.',
        media: ['/assets/aige/create_with_ai.png'],
      },
      {
        type: 'media-row',
        media: [
          { src: '/assets/aige/select_or_type_prompt.png', ratio: '1.54 / 1' },
          { src: '/assets/aige/edit_or_submit.png', ratio: '1.54 / 1' },
        ],
      },
      {
        title: 'Agent Design', kicker: '03 / AGENT DESIGN',
        body: 'Five stages carry an effect from language to a runnable result: classify, decompose, plan, materialize, and execute. The model handles judgment; deterministic systems make the result reliable.',
        media: ['/assets/aige/architecture.svg'],
      },
      { title: 'Effect Showcase', kicker: '04 / EFFECT SHOWCASE', body: '', media: [effectImages[0].src] },
      { type: 'media-row', media: effectImages.slice(1) },
    ],
    previous: { slug: previousSlug, title: bySlug[previousSlug]?.name || 'All projects', meta: bySlug[previousSlug]?.era || 'PORTFOLIO' },
    next: { slug: nextSlug, title: bySlug[nextSlug]?.name || 'All projects', meta: bySlug[nextSlug]?.era || 'PORTFOLIO' },
    hidePrevious: true,
  }
}

function makeTikTokDeck(project) {
  const detail = project.detail || {}
  const projectIndex = HOME_CASE_ORDER.indexOf(project.slug)
  const previousSlug = HOME_CASE_ORDER[(projectIndex - 1 + HOME_CASE_ORDER.length) % HOME_CASE_ORDER.length]
  const nextSlug = HOME_CASE_ORDER[(projectIndex + 1) % HOME_CASE_ORDER.length]
  const fromAsset = (file) => `/assets/tiktok-effect-house/${file}`
  const templateShowcase = [
    'template_showcase1.gif', 'template_showcase2.gif', 'template_showcase3.gif',
    'template_showcase4.gif', 'template_showcase5.gif', 'template_showcase6.gif',
  ].map((file, index) => ({ src: fromAsset(file), ratio: index === 0 || index === 2 ? '298 / 529' : '203 / 360' }))
  const categories = [
    { src: fromAsset('category1.png'), ratio: '600 / 536' },
    { src: fromAsset('category2.png'), ratio: '612 / 500' },
    { src: fromAsset('category3.png'), ratio: '588 / 448' },
  ]
  const materialShowcase = [1, 2, 3, 4, 5].map((index) => ({ src: fromAsset(`material_graph_showcase_${index}.gif`), ratio: '298 / 529' }))

  return {
    slug: project.slug,
    title: project.name,
    hero: project.cover,
    video: null,
    embed: detail.videoEmbed || null,
    kicker: 'SELECTED SHIPPED WORK / CASE STUDY',
    lead: 'Effect House is TikTok’s public desktop tool for creating, publishing, and sharing augmented-reality effects.',
    body: 'I led Template Production and contributed to visual-scripting feature design and development, helping creators explore new formats through templates, tutorials, and live education.',
    roles: ['Template Production', 'Education & Tutorial', 'Visual Scripting Feature Design', 'Visual Scripting Development'],
    facts: [['CLIENT', 'TikTok'], ['LOCATION', 'San Jose'], ['TIMELINE', '2021 — PRESENT']],
    link: ['TRY EFFECT HOUSE ↗', 'https://effecthouse.tiktok.com/'],
    media: [],
    sections: [
      {
        title: 'Project Objectives', kicker: '02 / PROJECT OBJECTIVES',
        body: 'Effect House expands what is possible with effects by opening Community Effects to creators, designers, and developers around the world — inviting them to imagine new frontiers for TikTok’s effects universe.',
      },
      {
        title: 'Template Production', kicker: '03 / TEMPLATE PRODUCTION',
        body: 'I led the Effect House Template Team to inspire community creators with timely effects and fresh ideas, while showcasing new product features through inventive applications. Together, the team delivered 20–25 high-quality templates per quarter, more than 120 in total, and reached a 40% effect-conversion rate.',
      },
      { type: 'media-row', media: templateShowcase },
      {
        title: 'Graph Production', kicker: '04 / GRAPH PRODUCTION',
        body: 'Graph is a node-based coding system that lets creators build visual and interactive effects without text-based code. Beyond foundational nodes, I designed Material Graph nodes for screen art: transitions for animating properties, 2D SDF shape generation, and packaged visual effects.',
        media: [fromAsset('node_design_example3.gif')],
      },
      {
        title: 'Screen Art Node Families', kicker: '05 / MATERIAL GRAPH NODE',
        body: 'The Material Graph system groups screen effects into three practical families: Transition, 2D SDF, and Effect.',
      },
      { type: 'media-row', media: categories },
      { title: 'Material Graph Showcase', kicker: '06 / MATERIAL GRAPH SHOWCASE', body: '', media: [materialShowcase[0].src] },
      { type: 'media-row', media: materialShowcase.slice(1) },
    ],
    previous: { slug: previousSlug, title: bySlug[previousSlug]?.name || 'All projects', meta: bySlug[previousSlug]?.era || 'PORTFOLIO' },
    next: { slug: nextSlug, title: bySlug[nextSlug]?.name || 'All projects', meta: bySlug[nextSlug]?.era || 'PORTFOLIO' },
  }
}

function makeHersheyDeck(project) {
  const detail = project.detail || {}
  const projectIndex = HOME_CASE_ORDER.indexOf(project.slug)
  const previousSlug = HOME_CASE_ORDER[(projectIndex - 1 + HOME_CASE_ORDER.length) % HOME_CASE_ORDER.length]
  const nextSlug = HOME_CASE_ORDER[(projectIndex + 1) % HOME_CASE_ORDER.length]
  const fromAsset = (file) => `/assets/hershey-pop-kisses/${file}`
  const sceneFilms = [
    'scene1_BouncingBliss.mov', 'scene2_LumberingCheer.mov', 'scene3_FloatingCuriocity.mov',
    'scene4_HappyHallows.mov', 'scene5_SlidingDelight.mov',
  ].map((file) => ({ src: fromAsset(file), ratio: '16 / 9' }))

  return {
    slug: project.slug,
    title: project.name,
    hero: project.cover,
    video: null,
    embed: detail.videoEmbed || null,
    kicker: 'SELECTED SHIPPED WORK / CASE STUDY',
    lead: 'Pop Kiss Studio is an interactive Google Daydream VR game installation designed by Havas Worldwide for The Hershey Company.',
    body: 'Exhibited at Hershey Stores in Pennsylvania and Las Vegas, the experience invites visitors to become Kiss designers through creative coding, interaction design, and motion-driven 3D worlds — generating product interest, store traffic, shareable moments, and purchase intent.',
    roles: ['Creative Coding', 'Interaction Design', 'Motion / Animation Design & Implementation'],
    facts: [['CLIENT', 'Hershey Company / Havas Worldwide'], ['PLATFORM', 'Google Daydream VR'], ['EXHIBITION', 'Pennsylvania + Las Vegas'], ['TIMELINE', 'OCT 2017']],
    link: ['ORIGINAL CASE STUDY ↗', 'https://www.huyue.space/hershey-pop-kisses'],
    media: [],
    sections: [
      {
        title: 'Express Your Sweet Side', kicker: '02 / IDEATION',
        body: 'Three early concepts grew from the research. We selected “Express Your Sweet Side”: a journey through vivid 3D worlds that gives each visitor inspiration and the tools to make a personalized Kiss.',
        media: [{ src: fromAsset('ideation.png'), ratio: '2508 / 1410' }],
      },
      {
        title: 'Catch & Paint', kicker: '03 / INTERACTION DESIGN',
        body: 'In a 360° world, players catch dynamic materials from objects and paint them onto a Hershey Kiss. A simple click, hold, and release with the Daydream controller makes selecting and applying materials immediately legible.',
        media: [{ src: fromAsset('interaction_design.gif'), ratio: '500 / 560' }],
      },
      {
        title: 'Stage 1 — Inspiration & Education', kicker: '04 / USER FLOW',
        body: 'After putting on the Daydream headset, visitors enter a magical 360° realm as a “Kiss Artist.” They explore floating objects and their materials, then learn how to catch a material and paint it onto a white practice canvas.',
        media: [
          { src: fromAsset('user_flow_stage1_Mokcup.png'), ratio: '1333 / 749' },
          { src: fromAsset('user_flow_stage1_RealDesign.gif'), ratio: '558 / 314' },
        ],
      },
      {
        title: 'Stage 2 — Choose a World', kicker: '05 / USER FLOW',
        body: 'Visitors arrive at a menu of five animated 3D Kiss models. Hovering over a Kiss previews a distinct path and lets them choose the world they want to explore.',
        media: [
          { src: fromAsset('user_flow_stage2_Mokcup.png'), ratio: '1332 / 748' },
          { src: fromAsset('user_flow_stage2_RealDesign.gif'), ratio: '556 / 313' },
        ],
      },
      {
        title: 'Stage 3 — Creation', kicker: '06 / USER FLOW',
        body: 'Inside the selected 3D world, a blank Hershey’s Kiss waits on a pedestal. Visitors discover patterns and dynamic materials in the environment, catch them, and apply them to make a one-of-a-kind Kiss.',
        media: [
          { src: fromAsset('user_flow_stage3_Mockup.png'), ratio: '1333 / 751' },
          { src: fromAsset('user_flow_stage3_RealDesign_1.gif'), ratio: '558 / 314' },
          { src: fromAsset('user_flow_stage3_RealDesign_2.gif'), ratio: '558 / 314' },
        ],
      },
      {
        title: 'Stage 4 — Celebration', kicker: '07 / USER FLOW',
        body: 'The finished Kiss rises from the artist’s space and joins a gallery of creations made by other visitors — turning a personal design moment into a shared retail spectacle.',
        media: [
          { src: fromAsset('user_flow_stage4_Mockup.png'), ratio: '1334 / 751' },
          { src: fromAsset('user_flow_stage4_RealDesign.gif'), ratio: '558 / 314' },
        ],
      },
      {
        title: 'Aesthetic Design & Scene Building', kicker: '08 / FIVE WORLDS',
        body: 'Each world pairs a distinct emotional character with a playful material language, giving visitors a different place to source patterns and inspiration for their Kiss.',
      },
      { type: 'media-row', media: sceneFilms },
    ],
    previous: { slug: previousSlug, title: bySlug[previousSlug]?.name || 'All projects', meta: bySlug[previousSlug]?.era || 'PORTFOLIO' },
    next: { slug: nextSlug, title: bySlug[nextSlug]?.name || 'All projects', meta: bySlug[nextSlug]?.era || 'PORTFOLIO' },
  }
}

function makeVuseDeck(project) {
  const detail = project.detail || {}
  const projectIndex = HOME_CASE_ORDER.indexOf(project.slug)
  const previousSlug = HOME_CASE_ORDER[(projectIndex - 1 + HOME_CASE_ORDER.length) % HOME_CASE_ORDER.length]
  const nextSlug = HOME_CASE_ORDER[(projectIndex + 1) % HOME_CASE_ORDER.length]
  const files = [
    '7514a4_ca06132b247b47f081de972f999cb79d.png', '7514a4_995b6536842e467691644a384a1e9395.png', '7514a4_f054c23505494311abde14094214607f.png',
    '7514a4_0bbbfed11014413b8aaf407906e3ec5f.png', '7514a4_8f0abc632c8249a3acc854769bdfb2dc.png', '7514a4_deca102b4ad64bb7a0979b9ddaa9f3fd.png',
    '7514a4_366ff0ef61404cd3b9ce4769775b2727.png', '7514a4_ed9cb30df57e4c76b98118cdc219795c.png', '7514a4_e22439ddabde400f96ed0e555ce183cb.png',
    '7514a4_30959e2b778f4bc699bccd92a9c1b611.png', '7514a4_f451970cebbf4d5a839664bbe078817d.png', '7514a4_46c75b1b972c4855a014ef65c267d5eb.png',
    '7514a4_ffecc1edf6d943e9afcc7075b497f8f9.png', '7514a4_dc552dfcaf19416b92716f71f104cbda.png', '7514a4_278ef8500bbb457f8f62db13bf9032c2.png',
    '7514a4_eb6afbd1524843fdba33af8b79791120.png', '7514a4_5c1441df6fbe4960806320be25a02348.png', '7514a4_1281b85c77d844c681c0ce3f5445dc0a.png',
    '7514a4_de71ba29ecba476198d530eff4975b01.png', '7514a4_e15e73d9056f4a67893b6d07e16109d8.png', '7514a4_d9a1afc4fb6c498f966f51723292315d.png',
    '7514a4_dfe27841e20a44889471202f771b5275.png', '7514a4_c573f3952ee648d8a6b9416236e4ac13.png', '7514a4_b0a1106543ce4cf49fab3e3d8f4e5f47.png',
    '7514a4_a534313a1fcd4b57993be4d93422db00.png', '7514a4_c5d4bc7cd19f4dcbbdfcc10716cd8f6e.png',
  ].map((file) => ({ src: `/assets/vuse-unboxing-ar/${file}`, ratio: '16 / 9' }))
  const section = (title, kicker, body, media = []) => ({ title, kicker, body, media })
  return {
    slug: project.slug, title: project.name, hero: project.cover, video: null, embed: detail.videoEmbed || null,
    kicker: 'SELECTED SHIPPED WORK / CASE STUDY',
    lead: 'Alto Unboxing AR is a mobile augmented-reality experience built for the VUSE Alto product launch.',
    body: 'It creates a virtual product trial: consumers explore the Alto from its top-level assembly to key components, benefits, and an x-ray view of the full operation.',
    roles: ['Creative Coding', 'Visual & Animation Design', 'Interaction Design'],
    facts: [['CLIENT', 'VUSE / Havas Worldwide'], ['PLATFORM', 'Unity · AR Mobile'], ['TIMELINE', 'AUG 2018']],
    link: detail.link, media: [],
    sections: [
      section('Product in 360°', '02 / IDEATION', 'The experience uses a mobile AR interface to reveal a sleek product and its features in a navigable 360° view — translating product benefits into a layered spatial story.', [files[0]]),
      { type: 'media-row', media: files.slice(1, 9) },
      section('Experience Architecture', '03 / USER EXPERIENCE', 'The end-to-end flow informed both the interaction design and the Unity application structure. Touch moves the product through InTheBox, Rest, SeeInAction, Heater, FlavorPod, MouthPiece, Battery, and SmartConnect states.', [files[9]]),
      section('Stateful Interaction', '04 / APPLICATION SYSTEM', 'A TapEventController selects the next view state from the user’s UI action. A singleton ViewStateController then resets position, plays animations, updates navigation, activates particles, and enables rotation gestures.', [files[10], files[11]]),
      section('Feelm Heater', '05 / COMPONENT VISUALS', 'For the Alto’s heating technology, I translated the original 2D storyboard into a live AR particle system that visualizes the activated coil and its performance benefits.', files.slice(12, 15)),
      section('Flavor Pod', '06 / COMPONENT VISUALS', 'Four distinctive particle systems and vapor effects make each selectable flavor legible as a different product experience.', files.slice(15, 18)),
      section('MouthPiece', '07 / COMPONENT VISUALS', 'Three animated airflow paths — two along the ergonomic edges and one through the device — illustrate an effortless draw.', files.slice(18, 21)),
      section('Smart Battery', '08 / COMPONENT VISUALS', 'A looping visual system communicates consistent, long-lasting power rather than a static product specification.', files.slice(21, 23)),
      section('Quick Connect', '09 / COMPONENT VISUALS', 'Particle fields and motion design turn the magnetic click-and-go connection into a visible, intuitive interaction.', files.slice(23, 26)),
    ],
    previous: { slug: previousSlug, title: bySlug[previousSlug]?.name || 'All projects', meta: bySlug[previousSlug]?.era || 'PORTFOLIO' },
    next: { slug: nextSlug, title: bySlug[nextSlug]?.name || 'All projects', meta: bySlug[nextSlug]?.era || 'PORTFOLIO' },
  }
}

function makeIbmDeck(project) {
  const detail = project.detail || {}
  const projectIndex = HOME_CASE_ORDER.indexOf(project.slug)
  const previousSlug = HOME_CASE_ORDER[(projectIndex - 1 + HOME_CASE_ORDER.length) % HOME_CASE_ORDER.length]
  const nextSlug = HOME_CASE_ORDER[(projectIndex + 1) % HOME_CASE_ORDER.length]
  const section = (title, kicker, body) => ({ title, kicker, body })
  return {
    slug: project.slug, title: project.name, hero: project.cover, video: null, embed: detail.videoEmbed || null,
    kicker: 'SELECTED SHIPPED WORK / CASE STUDY',
    lead: 'IBM Watson Holobot is an augmented-reality storytelling experience unveiled at IBM Think 2018.',
    body: 'It turns the “Call Center of the Future” into a virtual building that visitors explore floor by floor, showing how Watson improves customer service, process efficiency, and decision making.',
    roles: ['Creative Programming', 'Visual & Animation Design', 'Interaction Design'],
    facts: [['CLIENT', 'IBM / Havas Worldwide'], ['PLATFORM', 'Unity · AR Mobile'], ['EXHIBITION', 'IBM THINK 2018'], ['TIMELINE', 'MAR 2018']],
    link: detail.link, media: [],
    sections: [
      section('Call Center of the Future', '02 / PROJECT OBJECTIVE', 'The experience educates visitors on how Watson can add value to call centers through faster responses, streamlined processes, and artificial-intelligence systems that support better service.'),
      section('A Building as a Story', '03 / IDEATION', 'On iOS phones and tablets, users explore a virtual 3D call-center building. Each floor contains interactive objects, animation, and video that explain a specific Watson capability.'),
      section('Particle System Language', '04 / PROTOTYPE & DEVELOPMENT', 'As lead creative technologist, I designed the visuals, motion, interaction, and particle systems. Spheres represent customer requests; their materials evolved through lighting, glow, shadow, reflection, and transparency tests before a high-performance 2D sprite solution was selected.'),
      section('Gaze Interaction', '05 / GUIDANCE', 'A gaze interaction system highlights useful information according to the visitor’s position. In the introduction, it uses text fades and particle movement to guide attention through the scene.'),
      section('Floor 1 — Smart Chatbots', '06 / CALL CENTER FLOORS', 'Two particle systems contrast labor-intensive service with Watson’s chatbot solution, which can respond consistently across messaging, social, and telephone channels.'),
      section('Floors 2 & 3 — From Noise to Order', '07 / CALL CENTER FLOORS', 'Randomly placed spheres progressively form an ordered arrangement, illustrating how Watson searches knowledge sources and answers incoming questions at scale.'),
      section('Floor 4 — Deeper Insight', '08 / CALL CENTER FLOORS', 'A polar-coordinate particle system forms dynamic circles to show how advanced analytics reveal customer behavior, preferences, and expectations.'),
      section('Grounded AR Journey', '09 / USER FLOW', 'Vuforia ground recognition anchors the building to a flat surface. A tap begins the introduction; particles rise, lead attention back to the base, and reveal the building floor by floor as visitors gaze and tap onward.'),
    ],
    previous: { slug: previousSlug, title: bySlug[previousSlug]?.name || 'All projects', meta: bySlug[previousSlug]?.era || 'PORTFOLIO' },
    next: { slug: nextSlug, title: bySlug[nextSlug]?.name || 'All projects', meta: bySlug[nextSlug]?.era || 'PORTFOLIO' },
  }
}

function makePalaceDeck(project) {
  const detail = project.detail || {}
  const projectIndex = HOME_CASE_ORDER.indexOf(project.slug)
  const previousSlug = HOME_CASE_ORDER[(projectIndex - 1 + HOME_CASE_ORDER.length) % HOME_CASE_ORDER.length]
  const nextSlug = HOME_CASE_ORDER[(projectIndex + 1) % HOME_CASE_ORDER.length]
  const media = [
    '7514a4_dabdafd4ec804357be0f3ee131796422.png', '7514a4_b2029332ec7e4a6182adc69226766ea8.png', '7514a4_21410875cd254b428379de39eea09603.png',
    '7514a4_edbae050251242c4801fe4c4047dafd5.png', '7514a4_37522b3de1e742419cb8508de22763e3.png',
    '7514a4_af170f4761944628942fd3bb4637176a.gif', '7514a4_3b43f94dc4824aeb9759d706a902c357.gif', '7514a4_24aa5567fb7a45d3b225b933a6c0ba82.gif',
  ].map((file) => ({ src: `/assets/palace-museum/${file}`, ratio: '16 / 9' }))
  return {
    slug: project.slug, title: project.name, hero: project.cover, video: null, embed: detail.videoEmbed || null,
    kicker: 'SELECTED SHIPPED WORK / CASE STUDY',
    lead: 'A digital installation at the Palace Museum in Beijing, created to celebrate the 2019 Chinese Lunar New Year.',
    body: 'The exhibition brought three interactive themes to life: Catching New Year Blessing, Eternal Blossom, and Frosty Wonderland. I led interaction design, animation design, and application development for Eternal Blossom.',
    roles: ['Interaction Design', 'Animation Design', 'Application Development'],
    facts: [['CLIENT', 'Palace Museum / OUTPUT'], ['PLATFORM', 'Unity · Kinect · Laser RangeFinder'], ['EXHIBITION', 'BEIJING · JAN–APR 2019']],
    link: detail.link, media: [],
    sections: [
      { title: 'Three New-Year Worlds', kicker: '02 / EXHIBITION', body: 'The installation celebrated the Lunar New Year across three visual worlds — Catching New Year Blessing, Eternal Blossom, and Frosty Wonderland — each inviting visitors to activate the scene through their own movement.', media: media.slice(0, 3) },
      { title: 'Eternal Blossom', kicker: '03 / INSPIRATION', body: 'Inspired by Qing Dynasty paintings, Eternal Blossom turns symbols of spring and joy — persimmons, pomegranates, narcissus, peonies, and butterflies — into a living composition. A wave of the arm makes flowers bloom, fruit roll, and butterflies flutter.', media: [media[3]] },
      { title: '2D Rigging & Interaction', kicker: '04 / DEVELOPMENT', body: 'I rigged the 2D visual elements with bones and inverse kinematics so they respond naturally to force. Touching or dragging the large screen applies force to the painted elements and triggers their dynamic movement.', media: [media[4]] },
      { title: 'On-Site Interaction', kicker: '05 / INSTALLATION', body: 'After the scene and interaction were set, the installation mapped the physical exhibition space through Unity and a Laser RangeFinder, enabling visitors to wave and touch to activate the work at full scale.', media: media.slice(5) },
    ],
    previous: { slug: previousSlug, title: bySlug[previousSlug]?.name || 'All projects', meta: bySlug[previousSlug]?.era || 'PORTFOLIO' },
    next: { slug: nextSlug, title: bySlug[nextSlug]?.name || 'All projects', meta: bySlug[nextSlug]?.era || 'PORTFOLIO' },
  }
}

function makeSantanderDeck(project) {
  const detail = project.detail || {}
  const projectIndex = HOME_CASE_ORDER.indexOf(project.slug)
  const previousSlug = HOME_CASE_ORDER[(projectIndex - 1 + HOME_CASE_ORDER.length) % HOME_CASE_ORDER.length]
  const nextSlug = HOME_CASE_ORDER[(projectIndex + 1) % HOME_CASE_ORDER.length]
  return {
    slug: project.slug, title: project.name, hero: project.cover, video: null, embed: detail.videoEmbed || null,
    kicker: 'SELECTED SHIPPED WORK / CASE STUDY',
    lead: 'In Someone Else’s Shoes is an AR mobile experience built for Santander and Boston nonprofit Heading Home.',
    body: 'For every mile walked “in someone else’s shoes,” Santander donated $10 to Heading Home. Volumetric video and immersive storytelling made the experience a prompt for empathy and respect.',
    roles: ['Creative Technology', 'AR Experience Design', 'Unity Development'],
    facts: [['CLIENT', 'Santander / Heading Home'], ['PLATFORM', 'Unity · ARKit · ARCore'], ['RECOGNITION', '2019 WEBBY AWARD'], ['TIMELINE', 'OCT 2018']],
    link: detail.link, media: [],
    sections: [
      { title: 'Walk in Someone Else’s Shoes', kicker: '02 / SOCIAL IMPACT', body: 'The campaign connected physical movement to a concrete social outcome: every mile walked generated a $10 donation for Heading Home, a Boston nonprofit.' },
      { title: 'Empathy Through AR', kicker: '03 / IMMERSIVE STORYTELLING', body: 'The mobile app combines augmented reality and volumetric video to make a first-person encounter feel immediate — using immersion to show that empathy is the cornerstone of respect.' },
      { title: 'Webby Recognition', kicker: '04 / OUTCOME', body: 'In Someone Else’s Shoes received the 2019 Webby Award for Augmented Reality.' },
    ],
    previous: { slug: previousSlug, title: bySlug[previousSlug]?.name || 'All projects', meta: bySlug[previousSlug]?.era || 'PORTFOLIO' },
    next: { slug: nextSlug, title: bySlug[nextSlug]?.name || 'All projects', meta: bySlug[nextSlug]?.era || 'PORTFOLIO' },
  }
}

function makeDeck(project) {
  if (project.slug === 'aige') return makeAigeDeck(project)
  if (project.slug === 'tiktok-effect-house') return makeTikTokDeck(project)
  if (project.slug === 'hershey-pop-kisses') return makeHersheyDeck(project)
  if (project.slug === 'vuse-unboxing-ar') return makeVuseDeck(project)
  if (project.slug === 'ibm-watson') return makeIbmDeck(project)
  if (project.slug === 'palace-museum') return makePalaceDeck(project)
  if (project.slug === 'santander') return makeSantanderDeck(project)
  const detail = project.detail || {}
  const copy = paragraphs(project.story || '')
  const lead = plain(detail.body || copy[0] || project.name)
  const body = copy.find((item) => item !== lead) || lead
  const role = Array.isArray(detail.role) ? detail.role : plain(detail.role || '').replace(/^Role:\s*/i, '').split(/\s*[·,/]\s*/).filter(Boolean)
  const facts = [['CLIENT', detail.client || 'Selected work'], ['TIMELINE', detail.year || project.era], ['MEDIUM', detail.medium || 'Interactive experience']]
  const images = [project.cover, ...(project.images || [])].filter(Boolean)
  const contentSections = storySections(project.story, body).map((section, index) => ({
    ...section,
    media: images.slice(3 + index * 2, 5 + index * 2),
  }))
  const usedImages = 3 + contentSections.length * 2
  const visualSections = images.slice(usedImages).reduce((all, image, index) => {
    if (index % 3 === 0) all.push([])
    all[all.length - 1].push(image)
    return all
  }, []).map((media, index) => ({
    title: `Visual archive ${String(index + 1).padStart(2, '0')}`,
    body: 'Supporting documentation and visual development from the original project case study.',
    media,
    archive: true,
  }))
  const sections = [...contentSections, ...visualSections]
  const projectIndex = HOME_CASE_ORDER.indexOf(project.slug)
  const previousSlug = HOME_CASE_ORDER[(projectIndex - 1 + HOME_CASE_ORDER.length) % HOME_CASE_ORDER.length]
  const nextSlug = HOME_CASE_ORDER[(projectIndex + 1) % HOME_CASE_ORDER.length]
  const previous = bySlug[previousSlug]
  const next = bySlug[nextSlug]
  return {
    slug: project.slug,
    title: project.name,
    hero: project.cover || images[0],
    video: project.video || null,
    embed: detail.videoEmbed || null,
    kicker: project.slug === 'aige' || project.slug === 'sound-viz' ? 'HIGHLIGHT PROJECT / CASE STUDY' : 'SELECTED SHIPPED WORK / CASE STUDY',
    lead,
    body,
    roles: role.length ? role : ['Creative Technology', 'Experience Design'],
    facts,
    link: detail.link || (detail.links && detail.links[0]),
    media: (images.length ? images : [project.cover]).slice(0, 3),
    sectionTitle: 'Work in',
    sectionItalic: 'motion.',
    storyTitle: 'How the system',
    storyItalic: 'takes shape.',
    sections,
    previous: { slug: previousSlug, title: previous?.name || 'All projects', meta: previous?.era || 'PORTFOLIO' },
    next: { slug: nextSlug, title: next?.name || 'All projects', meta: next?.era || 'PORTFOLIO' },
  }
}

function TikTokEffectHouseCase({ p }) {
  const rail = useRef(null)
  const d = p.detail || {}
  const media = [p.cover, ...(p.images || [])].filter(Boolean)

  useEffect(() => {
    const el = rail.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const box = el.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - window.innerHeight)))
      el.style.setProperty('--tiktok-rail-progress', progress.toFixed(4))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <main className="tiktok-case">
      <div className="tiktok-case-topline mono">
        <Link to="/#work">← back to selected work</Link>
        <span>CASE STUDY / 2021 — PRESENT</span>
      </div>

      <section className="tiktok-case-hero">
        <div className="tiktok-case-hero-copy">
          <span className="mono">TIKTOK / AR AUTHORING PLATFORM</span>
          <h1>Effect<br /><em>House.</em></h1>
          <p>Create, publish, and share augmented-reality effects for TikTok.</p>
        </div>
        <div className="tiktok-case-video">
          <iframe src={d.videoEmbed} title="TikTok Effect House video" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        </div>
      </section>

      <section className="tiktok-case-intro">
        <p>{d.body}</p>
        <div className="tiktok-case-facts mono">
          <span>CLIENT / TIKTOK</span><span>LOCATION / SAN JOSE</span><span>ROLE / PRODUCT + CREATIVE TECHNOLOGY</span>
        </div>
        <a className="tiktok-case-link mono" href="https://effecthouse.tiktok.com/" target="_blank" rel="noreferrer">TRY EFFECT HOUSE ↗</a>
      </section>

      <section className="tiktok-rail" ref={rail}>
        <div className="tiktok-rail-stage">
          <div className="tiktok-rail-track">
            <article className="tiktok-rail-panel tiktok-rail-panel--text">
              <div className="mono tiktok-rail-index">01 / PROJECT OBJECTIVE</div>
              <div>
                <h2>More ways to<br /><em>make effects.</em></h2>
                <p>Effect House opens TikTok’s effects universe to creators, designers, and developers — making Community Effects possible without a traditional production pipeline.</p>
              </div>
            </article>
            <article className="tiktok-rail-panel">
              <div className="tiktok-rail-visual"><img src={media[1] || media[0]} alt="Effect House template example" /></div>
              <div className="tiktok-rail-copy">
                <div className="mono tiktok-rail-index">02 / TEMPLATE PRODUCTION</div>
                <h2>Ideas that<br /><em>ship.</em></h2>
                <p>I led the Template Team, turning new product capabilities and trends into inspiring, production-ready effects — plus tutorials and live education to help creators use them.</p>
                <div className="tiktok-case-metrics"><span><b>120+</b> templates delivered</span><span><b>40%</b> effect conversion</span></div>
              </div>
            </article>
            <article className="tiktok-rail-panel">
              <div className="tiktok-rail-copy">
                <div className="mono tiktok-rail-index">03 / GRAPH PRODUCTION</div>
                <h2>Visual logic,<br /><em>made legible.</em></h2>
                <p>Graph is a node-based coding system for building visual and interactive effects. I researched, designed, prototyped, and shipped nodes — including their inputs, outputs, demos, and creator documentation.</p>
                <div className="tiktok-case-tags mono"><span>NODE DESIGN</span><span>PROTOTYPING</span><span>DOCUMENTATION</span></div>
              </div>
              <div className="tiktok-rail-visual"><img src={media[8] || media[2] || media[0]} alt="Effect House graph interface" /></div>
            </article>
            <article className="tiktok-rail-panel">
              <div className="tiktok-rail-visual"><img src={media[12] || media[3] || media[0]} alt="Effect House material graph node" /></div>
              <div className="tiktok-rail-copy">
                <div className="mono tiktok-rail-index">04 / SCREEN ART NODES</div>
                <h2>Effects as<br /><em>a language.</em></h2>
                <p>I designed screen-effect nodes across three families: transitions for property animation, 2D SDF shape generation, and packaged effects such as dissolve, blur, edge detection, and math-art functions.</p>
                <div className="tiktok-case-tags mono"><span>TRANSITION</span><span>2D SDF</span><span>EFFECT</span></div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <footer className="tiktok-case-footer">
        <span className="mono">TIKTOK EFFECT HOUSE / 2021 — PRESENT</span>
        <Link className="mono" to="/#work">BACK TO SELECTED WORK ↑</Link>
      </footer>
    </main>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const p = bySlug[slug]

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!p) {
    return (
      <main className="project-page">
        <div className="wrap" style={{ padding: '140px 0' }}>
          <div className="section-tag mono">404</div>
          <h1 className="section-h">Project not found</h1>
          <Link className="proj-back mono" to="/">← back home</Link>
        </div>
      </main>
    )
  }

  const d = p.detail || {}
  const facts = [d.year, d.location, d.medium, d.client].filter(Boolean).join('  ·  ')
  const legacyVideo = d.videoEmbed
  // full depth -> all images; light -> first 6
  const imgs = p.depth === 'full' ? p.images : p.images.slice(0, 6)

  if (HOME_CASE_ORDER.includes(slug)) return <ProjectHScroll deck={makeDeck(p)} />

  return (
    <main className="project-page">
      <div className="wrap project-wrap">
        <div className="proj-topline mono">
          <Link className="proj-back" to="/#work">← back to selected work</Link>
          <span>CASE STUDY / {p.era}</span>
        </div>

        <header className="proj-head">
          <div className="proj-era mono">SELECTED SHIPPED WORK</div>
          <h1 className="proj-title">{p.name}</h1>
          {facts && <div className="proj-facts mono">{facts}</div>}
          {d.award && <div className="proj-award">{d.award}</div>}
        </header>

        {legacyVideo ? (
          <div className="proj-hero proj-legacy-video">
            <iframe src={legacyVideo} title={`${p.name} video`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
          </div>
        ) : p.video ? (
          <div className="proj-hero">
            <video src={p.video} controls autoPlay muted loop playsInline
              onError={(e) => { const h = e.currentTarget.closest('.proj-hero'); if (h) h.style.display = 'none' }} />
          </div>
        ) : p.cover ? (
          <div className="proj-hero">
            <img src={p.cover} alt={p.name}
              onError={(e) => { const h = e.currentTarget.closest('.proj-hero'); if (h) h.style.display = 'none' }} />
          </div>
        ) : null}

        <div className="proj-grid">
          <div className="proj-main">
            {(d.body || p.story) && <div className="proj-section-label mono">PROJECT OVERVIEW</div>}
            {d.body && <p className="proj-body" dangerouslySetInnerHTML={{ __html: d.body }} />}
            {d.arch && (
              <pre className="arch" dangerouslySetInnerHTML={{ __html: d.arch }} />
            )}
            {p.story && p.story.split(/\n{2,}/).map((block, i) => {
              if (block.startsWith('### ') || block.startsWith('## ')) {
                // first line = heading, remaining lines = body paragraph
                const isSub = block.startsWith('### ')
                const nl = block.indexOf('\n')
                const head = (nl === -1 ? block : block.slice(0, nl)).slice(isSub ? 4 : 3)
                const rest = nl === -1 ? '' : block.slice(nl + 1).trim()
                return (
                  <div key={i}>
                    {isSub
                      ? <h4 className="proj-h" style={{ fontSize: '0.92em', opacity: 0.88 }}>{head}</h4>
                      : <h3 className="proj-h">{head}</h3>}
                    {rest && <p className="proj-body">{rest}</p>}
                  </div>
                )
              }
              if (block.trim().startsWith('[img:')) {
                const srcs = [...block.matchAll(/\[img:([^\]]+)\]/g)].map((m) => m[1])
                const shot = (src, j) => (
                  <figure className="proj-shot" key={j}>
                    {/\.(mp4|webm)$/i.test(src) ? (
                      <video src={src} autoPlay muted loop playsInline
                        onError={(e) => { const f = e.currentTarget.closest('figure'); if (f) f.style.display = 'none' }} />
                    ) : (
                      <img src={src} alt="" loading="lazy"
                        onError={(e) => { const f = e.currentTarget.closest('figure'); if (f) f.style.display = 'none' }} />
                    )}
                  </figure>
                )
                return srcs.length === 1
                  ? <figure className="proj-shot" key={i} style={{ margin: '18px 0' }}>
                      <img src={srcs[0]} alt="" loading="lazy"
                        onError={(e) => { const f = e.currentTarget.closest('figure'); if (f) f.style.display = 'none' }} />
                    </figure>
                  : <div className="proj-gallery" key={i} style={{ margin: '18px 0' }}>{srcs.map(shot)}</div>
              }
              return <p className="proj-body" key={i}>{block}</p>
            })}
            {Array.isArray(d.metrics) && d.metrics.length > 0 && (
              <div className="metrics">
                {d.metrics.map((m, i) => (
                  <div className="metric" key={i}><div className="v">{m[0]}</div><div className="l">{m[1]}</div></div>
                ))}
              </div>
            )}
          </div>

          <aside className="proj-aside">
            {Array.isArray(d.role) && d.role.length > 0 && (
              <div className="modal-group">
                <span className="modal-label mono">my role</span>
                <div className="modal-chips">{d.role.map((r, i) => <span className="t" key={i}>{r}</span>)}</div>
              </div>
            )}
            {Array.isArray(d.tools) && d.tools.length > 0 && (
              <div className="modal-group">
                <span className="modal-label mono">tools</span>
                <div className="modal-chips">{d.tools.map((t, i) => <span className="t" key={i}>{t}</span>)}</div>
              </div>
            )}
            {d.link && (
              <a className="modal-link mono" href={d.link[1]} target="_blank" rel="noreferrer">{d.link[0]}</a>
            )}
            {Array.isArray(d.links) && d.links.map((l, i) => (
              <a className="modal-link mono" key={i} href={l[1]} target="_blank" rel="noreferrer">{l[0]}</a>
            ))}
          </aside>
        </div>

        {imgs.length > 0 ? (
          <div className="proj-gallery">
            {imgs.map((src, i) => (
              <figure className="proj-shot" key={i}>
                {/\.(mp4|webm)$/i.test(src) ? (
                  <video src={src} autoPlay muted loop playsInline
                    onError={(e) => { const f = e.currentTarget.closest('figure'); if (f) f.style.display = 'none' }} />
                ) : (
                  <img src={src} alt={`${p.name} ${i + 1}`} loading="lazy"
                    onError={(e) => { const f = e.currentTarget.closest('figure'); if (f) f.style.display = 'none' }} />
                )}
              </figure>
            ))}
          </div>
        ) : p.story && p.story.includes('[img:') ? null : (
          <div className="proj-empty mono">
            {p.slug === 'aige' || p.slug === 'sound-viz'
              ? '[ architecture diagram, demo video & screenshots — coming soon ]'
              : '[ images coming soon — add to public/assets ]'}
          </div>
        )}

        {p.depth === 'light' && p.images.length > 6 && (
          <div className="proj-more mono">+ {p.images.length - 6} more on the original project</div>
        )}

        <div className="proj-foot">
          <Link className="proj-back mono" to="/#work">← back to highlights</Link>
        </div>
      </div>
    </main>
  )
}
