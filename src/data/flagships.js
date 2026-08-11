// Highlight Work — the two current "agentic AI tool" systems.
// arch / role contain small inline HTML (rendered via dangerouslySetInnerHTML).
// TODO(Yue): replace placeholder architecture, metrics, and links with real info.
export const flagships = [
  {
    slug: 'aige', depth: 'full', keys: [],
    title: 'AI Generate Effects',
    cat: 'agentic AI tool · genAI engineer era',
    badges: [['flag', 'FLAGSHIP']],
    tagline:
      "The AI system behind TikTok Effect House’s <b>Create with AI</b> — type an effect idea, get a runnable AR effect. Shipped &amp; public.",
    desc:
      "AIGE is the AI system behind TikTok Effect House’s <b>Create with AI</b> — a shipped, public feature where a creator types an effect idea and gets a runnable AR effect (Random Picker, Personality Test, Transform Me, mini-games, scratch / flip reveals, and more), ready to customize or submit. The architecture rests on two ideas. <b>First</b>, a prompt is split into <b>three spatial layers</b> — because a request can want a hat on your head, a button on the screen, or an object floating in the room, and each lives in a different space with its own placement logic. <b>Second</b>, the <b>LLM only understands, decomposes and plans — deterministic, schema-validated code does the building</b>. The model classifies the prompt and produces a validated plan per layer; code then handles asset lookup, generation and materializing everything into the effect. That split — LLM for judgment, code for execution — is what makes generation reliable at scale.",
    arch:
      '<span class="lbl">flow</span>  prompt → classify into layers → LLM plans each part → CODE builds it → runnable effect\n' +
      '<span class="lbl">layers</span> split by <i>where the thing lives</i>:\n' +
      '  • <b>Human</b>  — attached to you: stickers · makeup · filters · face effects  (face-local)\n' +
      '  • <b>Screen</b> — 2D UI on screen: image · text · video  (anchored)\n' +
      '  • <b>World</b>  — 3D objects around you: shapes · lights  (world space)\n' +
      '  • <b>+ Logic</b> — optional interactive scripting\n' +
      '<span class="lbl">split</span>  LLM = understand · decompose · plan (validated) · review\n' +
      '        Code = asset lookup · generation · materialize into commands\n' +
      '<span class="lbl">ground</span> hierarchical knowledge: sceneObject → component → property\n' +
      '        + retrievable skill packs per game / effect genre (RAG)\n' +
      '<span class="lbl">loop</span>   agent plans an action → executes in Effect House → observes the result → next step\n' +
      '<span class="lbl">eval</span>   benchmark + automated validation of generated effects → drives end-to-end success\n' +
      '<span class="lbl">shipped</span> in TikTok Effect House',
    role: 'Role: <b>AI system &amp; architecture</b> — the layered decomposition, the validated plan schema per layer, and the core split where the <b>LLM only plans while deterministic code executes</b> (for reliability &amp; success rate). <span class="ph2">[ exact scope — your words ]</span>',
    metrics: [['shipped', 'TikTok Effect House'], ['3 layers', 'human · screen · world'], ['LLM plans', 'code executes']],
    stack: ['Agent architecture', 'Layered scene decomposition', 'LLM planning + classification', 'Schema-validated execution', 'RAG + skill packs', 'Evaluation & benchmarks'],
    links: [['Create with AI ↗', 'https://effecthouse.tiktok.com/learn/guides/ai-capabilities/create-with-ai']],
    cover: '/assets/aige/cover_image.gif',
    video: null,  // TODO(Yue): set back to '/assets/aige/demo.mp4' once the demo video is recorded
    images: [],  // media now placed inside story sections (see projectStories.js aige)
    hue: 262,
  },
  {
    slug: 'sound-viz', depth: 'full', keys: [],
    title: 'Sound Visualization · VFX Generation Agent',
    cat: 'agentic system · in progress',
    badges: [['wip', 'IN PROGRESS']],
    tagline:
      'An agentic VFX system generating real-time visuals for live music — a prompt yields 4 candidate effects, then genetic editing. (WIP)',
    desc:
      'A real-time music-visualization system for live performance (WebGL / GLSL), driven by an <b>agentic generation layer</b>. Three layers: <b>Mechanical</b> (DSP → beat / energy / sections), <b>Semantic</b> (an LLM reads the music + a prompt and emits a <i>structured visual brief</i> — motion grammar, mark/body, color arrangement, music-mapping — not raw shader code), and <b>Runtime</b> (executes the chosen recipe with live mic modulation, projected). I’m building the visual-generation core into a standalone, reusable <b>VFX Generation Agent</b>: prompt → visual brief → retrieve &amp; adapt recipes → <b>4 distinct candidate effects</b> → genetic editing (mutate one, or <b>breed two</b> — e.g. the motion of A with the particle form of B) → lock per song segment. Effects are <i>module compositions</i> over a modular pipeline, so the agent composes parts, not arbitrary shaders. (Work in progress — for a live band show.)',
    arch:
      '<span class="lbl">layers</span> Mechanical (DSP → score) · Semantic (LLM → visual brief) · Runtime (recipe + live mic → projection)\n' +
      '<span class="lbl">agent</span>  VFX Generation Agent (standalone · reusable)\n' +
      '        prompt → visual brief → retrieve &amp; adapt recipes\n' +
      '        → scatter 4 candidates → mutate / breed (genetic) → lock to segment\n' +
      '<span class="lbl">pipeline</span> emitter → forces → integrator → life → render → accumulation\n' +
      '        (agent picks module compositions + audio bindings, not raw shader code)\n' +
      '<span class="lbl">status</span> WIP — building the VFX core into an independent agent',
    role: 'Role: <b>solo · system design &amp; architecture</b> — the 3-layer system, the prompt → visual-brief → recipe → genome pipeline, and the genetic VFX engine (scatter / mutate / breed / lock).',
    metrics: [['4', 'candidate effects / prompt'], ['mutate × breed', 'genetic editing'], ['3-layer', 'mechanical · semantic · runtime']],
    stack: ['Agentic pipeline', 'LLM visual-brief', 'Recipe + genome system', 'WebGL / GLSL', 'Web Audio (DSP)', 'Real-time / projection'],
    links: [['GitHub ↗', 'https://github.com/anyemelody/sound-visualization']],
    cover: '/assets/sound-viz/cover.png',
    video: '/assets/sound-viz/demo.mp4',
    images: ['/assets/sound-viz/effect-01.mp4', '/assets/sound-viz/effect-02.mp4', '/assets/sound-viz/effect-03.mp4', '/assets/sound-viz/effect-04.mp4'],
    hue: 168,
  },
]
