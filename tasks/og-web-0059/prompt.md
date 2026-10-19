# Create a reusable four-voice music player

Implement `SoundPlayer` in `sound-player.js` and `createMusicPlayer({mixer,AudioVoice})` in `component.js`. The supplied Web Audio engine already creates voices, routes buses and produces actual sound. Diagnostic clips and the inspection page are provided.

- **R1 — Reusable player.** A SoundPlayer accepts an ordered children array and a voice class through `SoundPlayer(children,VoiceType)`. Expose these children. Its `play(audio,single=false)` method returns immediately for null or undefined audio, without changing any voice, including when single is true.
- **R2 — First idle voice.** For valid audio, use the first idle child that is an instance of the supplied voice class. Assign that exact audio object to its `stream`, then call its `play()` method. Ignore non-audio children. If every voice is busy, leave playback unchanged; do not enqueue or steal a voice.
- **R3 — Exclusive playback and stop.** When single is true with valid audio, stop all audio children before selecting the first idle voice. `stop()` calls stop on every audio child, including idle ones. An exclusive request leaves exactly one voice playing. A naturally finished voice becomes available again.
- **R4 — Music assembly.** Return a SoundPlayer named `MusicPlayer` containing exactly 4 new `AudioVoice` children, each constructed with the supplied mixer and bus `Music`. Set `processAlways` to true so playback continues while gameplay is paused.
- **R5 — Actual output and reset.** Preserve the provided play, exclusive play, stop, mute, pause-game and reset controls, waveform and activity indicators. Playback must use real audio nodes and end naturally. Reset stops existing voices and rebuilds the initial player.

The existing engine supplies the Music bus. The diagnostic buffers are test sounds, not a sound-design assignment. Acceptance checks audio object identity, child ordering, null/exclusive behavior, full-pool behavior, stop calls, actual routed samples, natural completion and playback during game pause. Keep the page runnable through `index.html`.
