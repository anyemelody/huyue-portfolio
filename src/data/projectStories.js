// Full case-study copy migrated from huyue.space (Yue's own writing).
// Format: plain paragraphs separated by blank lines; lines starting with "## " are section headings.
// Rendered by ProjectPage between the header/aside and the image gallery.
export const projectStories = {
  'aige': `## 1 · Intro
AIGE is the AI system behind TikTok Effect House's "Create with AI" — a shipped, public feature where a creator types an effect idea and gets a runnable AR effect, ready to customize or submit. One prompt can ask for almost anything: a hat on your head, a scoreboard on the screen, an object floating in the room, a mini-game with rules. AIGE turns that open-ended language into working effects through a five-stage agentic pipeline, built on one discipline: the LLM judges, deterministic code executes.

My role — AI system & architecture: the three-layer decomposition and classifier design, the RAG knowledge hierarchy and genre skill packs, the schema-validated planning layer with semantic placement, the deterministic staged materializer, the MCP execution loop, and the evaluation system.

## 2 · Agent Design
Five stages take a prompt from language to a running effect. The LLM owns judgment (stages ① – ③); deterministic code owns execution (stages ④ – ⑤).

[img:/assets/aige/architecture.svg]

### ① Classify — One Prompt, Three Spatial Layers
The first LLM pass is a classifier. It reads the prompt and routes each requirement into one of three designed layers, split by where the thing lives: Human — attached to you (face-local coordinates: stickers, makeup, face effects); Screen — 2D UI anchored on screen (image, text, video); World — 3D objects in world space around you; plus an optional Logic layer when the effect needs interactive scripting. Each layer has its own coordinate primitives and placement logic — a forehead sticker and a top-right button are different problems, and treating them with one generic representation is where naive generation breaks.

### ② Decompose — Subtasks Grounded in Retrieval
The agent then splits the whole effect into subtasks, consulting the RAG system as it plans. Knowledge is organized as a hierarchy that mirrors the engine itself — sceneObject → component → property — so every capability the agent reasons about is grounded in what actually exists at each level. On top of that sit retrievable skill packs for specific effect and game genres: procedural knowledge the agent pulls in only when a request matches, instead of stuffing everything into context. Each subtask is isolated — its own namespace, no cross-task references — so one failed piece can't corrupt its siblings.

### ③ Plan — Schema-Validated, No Raw Numbers
Each subtask is formatted into a detailed plan in a strict schema, validated before anything executes. One rule captures the philosophy: the LLM never writes raw coordinates. It outputs semantic placement — "forehead", "top-right, small", "in front of the camera, medium depth", "above the hat, near" — and a deterministic resolver desugars that into exact transforms by looking up engineered preset maps. The model does judgment ("where should this live?"), the code does precision ("what numbers is that?"). Invalid plans are rejected at the schema boundary, before they can touch the scene.

### ④ Materialize — Deterministic Staged Execution
Validated plans are handed to pure code. A materializer converts each plan into engine commands in ordered waves — generate & import assets first, then add scene objects, then set components and properties — so dependencies resolve in the right order and every generated asset's real ID is written back into the plan before anything references it. No LLM in this stage: same plan in, same effect out.

### ⑤ Execute Loop — Build, Observe, Fix
Commands are executed inside Effect House through MCP. The agent doesn't fire-and-forget: it executes a tool call, observes the actual result the engine returns, and decides the next step from that result — continuing to the next subtask, or entering a bounded fix loop (at most three attempts) when something failed, with session state tracked explicitly through phases like planning, generating, awaiting result, fixing, finished. Tool responses are cleaned and trimmed before re-entering context, so the loop stays sharp over long generations. The loop runs until the whole effect is assembled — a real agentic loop against the real engine, not an imagined one.

### Evaluation
I designed the benchmark and built the automated end-to-end validation system: batch-running prompt sets through the full pipeline against the live engine, asserting on structure rather than exact text, capturing per-run artifacts and preview snapshots, and aggregating results so generation success became a number the team could drive up — per layer, per stage, per version. Evaluation is what turned AIGE from a promising demo into something trustable in a public product.

## 3 · UI Reference
The flow creators see: pick or type an effect idea, watch AIGE generate, then edit or submit the result.

[img:/assets/aige/create_with_ai.png]
[img:/assets/aige/generate.png]
[img:/assets/aige/edit_or_submit.png]

## 4 · Effect Showcase
A sample of effects generated end-to-end by AIGE — mini-games, personality tests, transformations, reveals.

[img:/assets/aige/transform_me.gif]
[img:/assets/aige/random_pick.gif]
[img:/assets/aige/personality_test.gif]
[img:/assets/aige/scratch_to_reveal.gif]
[img:/assets/aige/flip_reveals.gif]
[img:/assets/aige/blocks_game.gif]
[img:/assets/aige/social_randomizer.gif]
[img:/assets/aige/drop_it.gif]
[img:/assets/aige/which_ai_character_am_i.gif]`,

  'sound-viz': `Most music visualizers are one of two things. Either they map FFT bins to visual parameters every frame — reactive, but with no memory and no taste: the chorus looks like the verse, just louder. Or they are pre-rendered music videos — full of intention, but dead: nothing responds to the room, the mic, the moment. This project builds the thing in between: a system that first listens through an entire song the way a visual director would, writes a visual plan with actual intent, and then performs that plan live, still reacting to every beat coming through the microphone. It is being built for real stage use — projected behind a live band, driven by a laptop and a mic.

## The Design Problem: Two Time Scales
A good live visualization needs two kinds of intelligence operating on different time scales. Global understanding (offline, whole-song): where are the sections, build-ups, drops? What is the emotional arc? And local reaction (real-time, per-frame): did a beat just hit? How heavy is the bass right now? Pure FFT mapping has the second without the first; pre-rendered direction has the first without the second. The architecture separates them cleanly — then binds them back together at runtime.

## Architecture: Agents with Explicit Artifacts
The pipeline is three agent stages plus a runtime, and every stage boundary is a typed, human-readable JSON artifact: audio file → Music Analysis Agent → music analysis → Visual Planning Agent → visual plan → Visual Generation Agent → performance score → live runtime. This "explicit artifact between every stage" rule is the most important decision in the project. Every stage can be re-run independently and cached, so iterating on generation never re-pays for expensive analysis. A human can intervene anywhere — the artifacts are editing surfaces, not just machine handoffs. And no stage depends on a specific model provider: swapping the LLM behind the planner changes zero downstream code.

## Analyze Stems, Not the Mix
The analysis stage doesn't extract features from the mixed audio. It first separates the track into four stems (vocals / drums / bass / other), then computes features on each stem independently. This dissolved a real accuracy problem: beat tracking on a full mix is polluted by vocal onsets and synth attacks, and running it on the isolated drums stem substantially fixed the beat drift I had been fighting — without reaching for heavier specialized models. When a signal is noisy, decompose the source before you upgrade the model.

## Perception as Formulas, Not a Black Box
Downstream, the planner needs perceptual descriptions per segment — arousal, tension, warmth. Instead of a classifier, these are computed by explicit, readable rules over stem statistics. Because this is a creative tool, the person using it has to be able to disagree with it: when the tension curve feels wrong for a bridge, I can read the formula, see why, and adjust — instead of shrugging at a model's output. Interpretability is what makes the system tunable as an instrument.

## A Visual Signature per Song
The naive agent design lets the LLM pick a recipe per segment from a big library. The failure mode is aesthetic mush — locally plausible choices with no identity across the song. So planning works top-down: each song first gets a Visual Signature — dominant shape family, palette family, render texture, motion character — and all segment-level generation happens inside that signature. Two songs must differ visibly on every axis; that's a hard acceptance criterion. Constrain the space first, then generate within the constraints.

## Agents Propose, Humans Commit
Everything converges into one artifact: the performance score — per-segment locked recipes, live-modulation bindings, transitions. Candidate visuals from the generation agent are preview-only until explicitly locked to a segment; a lock triggers revalidation, compilation, and an atomic replacement of the score that hot-reloads into the running visual. There is no path where an agent silently mutates what will be performed on stage. For a system whose output is projected live behind a band, that guarantee is the difference between an instrument and a slot machine.

## Built for the Stage
Live performance forces constraints a demo never would: graceful degradation when beat lock is lost on a noisy stage mic, offline feature curves downsampled to stay reviewable, and hard scope gates in the MVP plan ("if the first song's loop isn't shippable by week six, tune aesthetics — do not add modules"). The system ships to a real audience, on a real night, with a band waiting — and the architecture is shaped by that deadline.

## Status
In progress — the v1 scope targets two songs through the full pipeline, projected live. On the roadmap: automatic segment boundaries, a graphical editor over the plan artifacts, and a generation agent that composes new visual formulas from primitives instead of only tuning existing ones.`,

  'hershey-pop-kisses': `Pop Kiss Studio is an interactive virtual reality game installation designed and built by Havas Worldwide for The Hershey Company. It was exhibited at Hershey Stores in Pennsylvania and Las Vegas.

## Project Objectives
Generate interest in Hershey products, drive traffic to Hershey retail locations, inspire customers to share experiences online, and increase Hershey product purchases.

## Research
Scouting Hershey retail locations surfaced a few learnings: visibility and presentation of interactive exhibits is extremely important in driving customer engagement; it is important to make users feel they are part of the story and to provide an engaging, personalized experience, ending with a chance to take a selfie and share via email or social network.

Leverage the immersive experience of virtual reality for storytelling — take advantage of sensory cues like smell in addition to vision and gestures. Keep the story simple and optimize the duration of the game to reduce wait time and onboarding complexity.

## Ideation
Three concepts were initially generated from the research phase. Driven by the project goals and requirements, we moved forward with the "Express Your Sweet Side" concept.

## Prototype & Project Building
The story behind "Express Your Sweet Side" is that the user travels through various 3D worlds to gain inspiration from the environments and make their own personalized Kiss designs, becoming a "Kiss Designer."

## Interaction Design
The key interaction is to "catch" dynamic materials from objects in a 360° 3D world and "paint" the selected materials onto a Hershey Kiss model. The VR device is the Google Daydream (Google was a project sponsor). To make "catch" and "paint" intuitive, interactions center on a simple click, hold and release of the Daydream controller to select and apply materials.

## User Flow
The experience contains four distinct stages for a multi-dimensional, coherent and entertaining adventure.

Stage 1 — Inspiration / Education: after putting on the Daydream headset, the user is transported into a magical 360° 3D realm, welcomed as a "Kiss Artist," and taught the key interaction — to "catch" a material from an object and "paint" it onto a white cube canvas.

Stage 2 — Menu / Entry points: the user selects one of five unique worlds by hovering over five animated 3D Kiss models.

Stage 3 — Creation: in the chosen 3D world, a blank Hershey's Kiss sits on a pedestal. The user explores patterns and materials on the 3D objects, "catches" them, and applies them to create a customized Kiss.

Stage 4 — Celebration: the finished personalized Kiss rises and floats out into a gallery of Kisses, featured among pieces created by other users.

## User Testing
Before installing the app in the Hershey Store, we set up the VR prototype in the Havas Media Lab, cast the experience to a TV, and noted where users had issues.

Stumbling blocks & fixes — Orientation & intro: first-time users struggled to use and calibrate the Daydream controller, so we added manual copy explaining how to look around and what the controller does. Users didn't know what to do at the Kiss paths, so we added a "select your favorite Kiss" prompt and moved the Kisses further away so all five are visible. Decorating: people confused dragging vs. clicking, so we made both work; many missed the in-game instructional copy, so we added a storytelling tutorial before the game.`,

  'palace-museum': `The Palace Museum Interactive Installation was a digital installation held at the Palace Museum in Beijing from January to April 2019 to celebrate the Chinese Lunar New Year. The exhibition featured three themes: "Catching New Year Blessing", "Eternal Blossom" and "Frosty Wonderland".

## "Eternal Blossom" — Inspiration
I was the key creative technologist responsible for the theme "Eternal Blossom." It drew inspiration from Qing Dynasty paintings, showcasing visual elements that symbolize spring and joy — persimmons, pomegranates, narcissus flowers and peonies — to celebrate the festive spirit of the Chinese New Year. When people wave their arms, butterflies flutter, flowers sway, narcissus and plum blossoms bloom, and fruits roll — as if interacting with the ancient paintings.

## Development
I rigged all the 2D visual elements with bones and applied 2D Inverse Kinematics (IK) so they respond naturally to force. By touching or dragging on the large screen, users apply force and interact with these antiques, triggering animations and dynamic movement.

After I finished the scene and interaction setup, my teammate Fanyun helped set up the scene on the big screen and connected Unity with a Laser RangeFinder to map the real space — so people can wave and touch to trigger the interactions on site.`,

  'tiktok-effect-house': `Effect House is a public-facing desktop tool to create, publish and share Augmented Reality effects for TikTok. Try it at https://effecthouse.tiktok.com/.

## Project Objectives
To expand what's possible with effects, we created Effect House — a platform that lets anyone build Community Effects for TikTok, inviting creators, designers, and developers from around the world to imagine new frontiers for TikTok's effects universe.

## Template Production
I led the Effect House Template Team to inspire community creators with trending effects and fresh ideas, and to showcase new features that encourage innovative applications.

Key outcomes: delivered 20–25 high-quality templates per quarter, over 120 templates in total — a significant contribution to the platform's creative ecosystem; achieved a ~40% conversion rate, meaning nearly half of TikTok effects were generated using our templates, highlighting their widespread adoption and impact.

Key responsibilities: collaborated with the track leader and product manager to define strategy and oversee daily operations of template production; ensured consistent delivery through meticulous maintenance, transparent communication, and cross-team collaboration with engineering, product, design and QA; designed and produced templates from ideation to development (about one-third of the total); and prepared comprehensive documentation — detailed tutorials, video guides, and live courses on YouTube to educate and inspire creators.

## Graph Production
Graph is a node-based coding system that lets creators build visual, interactive effects without text-based coding. I designed and developed nodes for the graph system.

Key responsibilities: competitor research and strategy with the product manager; designed node details (function, inputs and outputs) and developed nodes from prototype to final delivery; and prepared documentation and demos through articles, video guides, and live YouTube courses.

## Material Graph Node — Screen Art Effect
Beyond the common fundamental nodes shared with other industry tools, I designed unique node types specifically for screen visual effects. I broke general screen effects into three categories: Transition (manipulate animation within properties like number, color, shape, transform), 2D SDF (generate signed distance fields in commonly used shapes), and Effect (wrapped screen effects such as dissolve, blur, edge detection, and math-art functions).`,

  'vuse-unboxing-ar': `Alto Unboxing AR is an interactive augmented reality experience designed and built for VUSE's new Alto product launch.

## Project Objectives
Alto Unboxing AR creates a "virtual product trial" that puts a virtual Alto into the hands of consumers before purchase. Users navigate and discover product features and benefits in multiple layers — from top-level assembly, to key components with their benefits, to full operation in an x-ray view.

## Ideation
Vuse Alto is a cigarette alternative for smokers switching to e-cigarettes, with a modern, sleek design, a revolutionary heating system and long-lasting battery for smoother vapor and crisper flavor. We leverage AR to fully reveal the product features and user benefits in a 360° 3D view on a mobile interface.

## User Experience Design & Project Architecture
As the lead creative technologist, I designed the end-to-end user-experience flow from the high-level storyboards, which also provided an engineering view to inform the Unity project structure and application architecture.

The AR experience consists of several states — InTheBox, Rest, SeeInAction, Heater, FlavorPod, MouthPiece, Battery and SmartConnect — triggered by touch events. A "TapEventController" sets the ViewState in response to the tapped UI button; a "ViewStateController" (implemented with the Singleton pattern) then executes subsequent tasks: resetting object position, playing animation, updating navigation UI, activating particle systems, and enabling rotation gestures after the animation.

## Visual Effects of the Key Product Components
Feelm Heater — the most important component, combining a metal film with a ceramic coil for smoother vapor, better safety and less battery draw. I designed and implemented a particle system that illustrates the coil effect when activated, transforming the original 2D storyboard into AR visual effects.

Flavor Pod — a 1.8 ml pod producing up to 680 puffs across four flavors. Four distinctive particle systems combined with vapor effects show the differences between the flavor choices.

MouthPiece — to convey the comfort and effortless pulls of the ergonomic mouthpiece, I designed and animated three air-flow paths: two along the smooth edges and one flowing through to the heater and flavor pod.

Smart Battery — a 350 mAh long-lasting battery using LSI technology for a consistent draw. To show its long-lasting, consistent power we designed a looping video for a more sophisticated, realistic effect.

Quick Connect — an easy click-and-go feature characterized by a magnetic field. I created a particle system demonstrating the magnetic connection and an animation simulating the easy click-and-go action and secure connection.`,

  'ibm-watson': `IBM Watson Holobot is an interactive augmented reality experience designed and built by Havas Worldwide, unveiled at the 2018 IBM Think Event.

## Project Objectives
Allow users to explore the "Call Center of the Future" powered by IBM Watson through an AR storytelling experience — educating users on how Watson AI technologies add value to their call centers, provide more timely customer responses, streamline processes and improve efficiency.

## Ideation
The project is an AR application for iOS mobile and tablet devices illustrating how Watson technologies revolutionize customer call centers. The user interacts with a virtual 3D call-center building, exploring each floor; each floor contains interactive objects, animations and video demonstrating the benefits of IBM Watson services.

## Prototype & Project Development
As the lead creative technologist, I designed and implemented the visuals, motion/interaction and animation of particle systems. The particle systems were key to demonstrating the complexity of a call center's day-to-day operations and how Watson services help.

Particle system visual design — during the intro, hundreds of particles reveal and float through the air, using spheres to represent commonly asked customer requests and questions. Following IBM's brand guidelines, I prototyped variations combining lighting, glow, shadow, reflection and transparency across matte, metallic and 2D neon-sprite materials. After many iterations and client feedback, we chose the 2D sprite effect — it met IBM's design requirements while maximizing rendering performance. Across stages, particles transform between states: unsolved, processing, and solved.

## Gaze Interaction
For the intro particle system, I built a gaze-interaction system that highlights content based on the user's position, guiding them to useful information in the scene (e.g. text fades in when gazed at).

## The Floors
Floor 1 — showing how Watson enables building, training and deploying smart chatbots that respond across channels (messaging, social, telephone). I implemented two particle systems to contrast traditional labor-intensive service against the smart chatbot solution.

Floors 2 & 3 — Watson can answer up to 70% of incoming questions immediately, and instantly search manuals, marketing materials and FAQs to improve satisfaction by 15%. I created a particle system that starts as randomly placed spheres and forms into an ordered design via mathematical calculations.

Floor 4 — demonstrating how Watson's advanced analytics uncover deeper insights into customer behavior. I used the polar coordinate system to programmatically form spheres into a circle while keeping each particle's movement dynamic.

## User Flow & Experience
Vuforia ground recognition anchors the virtual call center on a flat surface. The user taps to begin; people, trees and streets animate in and a voiceover starts as hundreds of particles rise from the ground. As the intro ends, particles fall back to the base and, when the user gazes at it, the building animates in floor by floor; a silhouette of the next floor appears, and users can tap to continue or replay the current floor.`,

  'santander': `In Someone Else's Shoes was designed for Santander to donate $10 for every mile walked "In Someone Else's Shoes" to the Boston nonprofit Heading Home.

The interactive mobile app, integrated with cutting-edge augmented-reality volumetric video, provides an immersive experience to remind participants that empathy is the cornerstone of respect.

## Recognition
Winner of the 2019 Webby Award — Augmented Reality.`,

  'speak-your-mind': `The Living Logo is the first 3D dynamic logo that indicates the volume of the conversation about mental health, designed for the 2019 Mental Health Global Campaign. Its movement is inspired by mentally calming, organic motion — the more people pledge their support and take action, the more the logo grows and becomes louder. Website: https://www.gospeakyourmind.org/

## Challenge
Every 40 seconds someone in the world dies by suicide. In spite of this, the world still treats mental health with silence, and unlike causes such as global warming there is no global figure advocating for mental health — giving people a voice, pressuring governments and demanding more investment to reduce suicides.

## Idea
We created the first Living Logo to fight suicide — designed to give people a voice and advocate for mental health to global leaders, fed by people's demands submitted through an online voice petition.

## Design & Creative Coding
The logo is made up of lines representing the different layers of the human mind, slowly opening up with an organic feel and movement designed to create a peaceful state of mind. We wanted control over a few variables — the gentle, dynamic movement, the vivid color-fading patterns and progress, the number of pitches and lines, and the varying stroke weight. To compare parameters and explore these variables, I built a website with a control panel to easily manipulate the arguments.`,
}
