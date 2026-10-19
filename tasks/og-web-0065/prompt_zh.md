# 注册独立的音乐与音效播放器

实现 `sound-player.js` 中的 `SoundPlayer`，以及 `component.js` 中的 `installAudio(registry,{mixer,AudioVoice})`。所提供的应用拥有持久服务注册表和 Web Audio 混音器，Master 总线已位于索引 0。构建共享播放器实现，并在应用启动时注册两个池。

- **R1 — 总线布局。** 在总线索引 1 添加 `Music`，在索引 2 添加 `SFX`。两者分别通过各自增益控制接入 Master。使用提供的 `mixer.addBus(name)` 服务；总线顺序就是插入顺序。
- **R2 — 共享播放组件。** 两个池使用同一个 `SoundPlayer(children,VoiceType)` 类。其 `play(audio)` 忽略 null 或 undefined 输入，否则将音频对象原样赋给首个空闲音频子对象的 `stream`，然后调用该子对象的 `play()`。忽略非音频子对象。池满时保持已有播放不变，不排队或抢占声部。`stop()` 停止每个音频子对象。
- **R3 — 池组装。** 将 `MusicPlayer` 注册为恰有 4 个新建 `AudioVoice` 子对象的 SoundPlayer，路由到 Music。将 `SFXPlayer` 注册为另一个 SoundPlayer，恰有 16 个新建 AudioVoice 子对象，路由到 SFX。每个声部均使用提供的混音器构造。将播放器名称设为其注册表键名，并返回同一注册表。
- **R4 — 应用生命周期。** 使用 `registry.set(name,player)` 存储播放器。切换场景后保持同一实例；场景变化不能停止、替换或重复创建全局播放器。两个池都必须能被新场景访问。
- **R5 — 独立音频行为。** 音乐与音效可以并发播放。静音 Music 不能静音 SFX，两者同时静音应使输出无声。停止一个池不能影响另一个池。使用真实音频节点和自然完成，保留提供的按钮、波形和声部指示。重置停止旧声部并重建初始服务。

引擎提供声部创建、增益路由和诊断缓冲区；本题实现播放器及服务组装。验收检查池大小、共享类身份、首个空闲声部选择、准确缓冲区、停止行为、真实总线隔离、自然完成及持久服务身份。保持页面可通过 `index.html` 运行。
