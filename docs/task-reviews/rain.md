# Rain configuration: individual review

Inspected every task_config instruction and numeric validator clause for295–314. All twenty main scenes have identical SHA256 prefix50084abf4f0f; after replacing numeric/string literals, validators share control flow hash prefixbf56d6c19144. These are parameter configuration variants, not simulator implementation exercises. The original emitters, ground and collision support exist but have incorrect material values and no collision sub-emitter connection.

| Task | Rain amount / life / preprocess | Speed | Direction X | Scale min | Contact size | Burst | Splash capacity | Splash speed | Gravity | Splash scale |
|---|---|---|---|---|---|---|---|---|---|---|
|295|400 /6 /12|300–500|.05|.15|4|3|3200|30–40|80|.08–.15|
|296|1200 /4 /8|800–1100|.1|.3|6|6|9600|70–90|120|.12–.25|
|297|600 /5 /10|500–700|.3|.2|5|4|4800|45–55|98|.1–.2|
|298|900 /3.5 /8|700–950|.15|.25|5.5|5|7200|60–75|110|.1–.22|
|299|500 /7 /14|200–400|.05|.1|3.5|2|2400|20–35|70|.06–.12|
|300|1500 /3 /6|900–1200|.2|.35|7|8|12800|80–100|130|.15–.3|
|301|700 /5.5 /11|450–650|.12|.18|4.5|3|4200|40–50|90|.09–.18|
|302|600 /4 /8|650–900|.08|.22|5|5|4800|55–70|105|.08–.16|
|303|300 /8 /15|400–600|.1|.25|4|2|1800|25–40|75|.1–.2|
|304|1100 /3.5 /7|750–1000|.25|.28|6.5|6|8800|65–85|115|.12–.24|
|305|550 /6 /12|350–550|.07|.16|4.2|3|3300|35–48|85|.08–.16|
|306|800 /4.5 /9|600–850|.1|.3|5.8|5|6400|55–68|100|.12–.22|
|307|450 /7.5 /14|250–450|.03|.12|3.8|2|2700|22–38|72|.07–.14|
|308|1000 /4 /8|700–1000|.18|.24|6|5|8000|62–78|108|.11–.22|
|309|650 /5 /10|550–750|.1|.1|4.8|4|3900|48–60|95|.05–.1|
|310|750 /5 /10|500–700|.1|.2|5|4|4800|42–58|92|.1–.2|
|311|850 /4 /8|600–800|.4|.2|5.5|4|5400|50–65|98|.1–.2|
|312|950 /6 /12|400–600|.06|.08|4|3|5700|30–45|80|.04–.1|
|313|1400 /3 /6|850–1150|.15|.32|6.8|7|11200|75–95|125|.14–.28|
|314|500 /6.5 /13|350–500|.08|.18|4.3|3|3000|32–45|82|.09–.17|

The old browser requirements retained many numeric values but changed the work to implementing an entire fixed-seed SVG simulation. They also required a constant simultaneous rain count, moved the floor to820, discarded spread and visibility configuration, and had no separately configured material/sub-emitter object relationship. This is a substantial scope change in both directions, not a faithful difficulty-preserving port. The repair supplies a functioning runtime and asks only for configuration and connection, matching the original missing work.

Removed: native resource/serialization types, blanket source-engine exclusions, mandatory solver implementation of the simulator, SVG-only output and a fixed simultaneous live count. Replaced: GPU runtime with supplied CPU/Canvas simulation; native collision/occlusion with supplied contact tests and floor clipping; material resources with separate configurable material objects. The original floor polygon is y220–320, collider top260 and height120, occluder top260; these distinct inherited coordinates are preserved rather than silently aligning them. The visibility rectangle is explicitly relative to the emitter. The phrase “900px wide” conflicts with the source validator's half-extents900 and1800-wide sky; use half-width900.

Restored in every row: actual preprocessing, independent Rain/Splash materials, hide-on-contact, the actual Splash object connection, immediate collision bursts, velocity alignment, respective capacities, emitter positions, initial45° rain and5° splash spreads, and all listed values. Source tests use one-sided minima/loose scale bounds; the new contract states exact target settings instead of allowing physically unrelated extreme values. That tightening is recorded as added precision, not identical legacy acceptance. Source files have no textures. Supplied streak/droplet geometry makes alignment and scale visible; GPU random distribution and rasterization are not claimed to be reproduced.

Added: independent range ownership, repeatable pause/step/reset inspection, real emission/distribution/flight/collision/render assertions. Source validators inspect configuration only. Tests now check600 fresh samples, emission rate, true preheat contacts, inside/outside floor impacts, one burst per hit, splash capacity and gravity trajectory, lifespan, culling, rotation and deterministic reset. Mutations remove contacts, disconnect Splash, skip preheat or remove gravity. Simulation runs in the provider, so these stronger checks do not ask solvers to implement extra physics. Difficulty equivalence remains a contract analysis; no new model-completion experiment has yet been run.
