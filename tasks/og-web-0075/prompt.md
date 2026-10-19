# Configure muted startup music

Complete `configureMusic(voice,{mixer,registry})` in `component.js`. The supplied application already has a single audio voice, Master, Music and Sounds buses, startup playback support and a persistent service registry. This is a configuration task.

- **R1 — Music source.** Set the supplied voice's `src` to `music.ogg`, using the original local audio file, and its `bus` to `Music`. Set `autoplay` to true and return the same voice.
- **R2 — Global registration.** Register that exact voice under `MusicPlayer` with `registry.set(name,voice)`. It must remain available and continue the same playback across scene changes.
- **R3 — Independent mute settings.** Call `mixer.setMuted(name,true)` for both `Master` and `Music`. Preserve the existing unmuted Sounds bus. Muting must affect actual output gains, without disabling playback or removing the stream.
- **R4 — Startup behavior.** The provided Start session button unlocks browser audio. Immediately after this first unlock, the application's existing startup mechanism must start the registered autoplay voice without a separate play command. It must decode the original file, advance playback and remain silent while either required bus is muted.
- **R5 — Inspection and reset.** Preserve the supplied waveform, separate Master and Music mute controls, scene switch and Reset. Unmuting only one required bus must leave output silent; unmuting both makes the running music audible. Reset restores both mute settings and the startup configuration.

The browser audio permission gate, decoding and voice lifetime support are already supplied. Acceptance checks configuration on an injected voice/mixer/registry, original asset integrity, real autoplay after unlock, both independent gains, actual output samples and service identity across scene changes. Keep the page runnable through `index.html`.
