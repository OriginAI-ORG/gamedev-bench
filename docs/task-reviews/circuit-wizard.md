# Circuit Wizard: individual source comparison

Both the source instruction and all14 rubric items were inspected. The source describes a complete campaign,not merely a boolean calculator: spatial placement,wiring,truth-table validation,arithmetic,multiplexers,buses,delay and feedback memory,limited layouts,locked components and a polished electronics workshop.

| Change | Previous loss / non-equivalence | Repair and acceptance |
|---|---|---|
| Removed | Three fixed serial slots replaced arbitrary construction and real wires. | Bounded7×4 placement,drag/move/delete,independent pins,fan-out and replacement/disconnection. Test occupied/out-of-bounds cells,budget,wires surviving moves and removing incident connections. |
| Removed | A single four-row XOR puzzle replaced at least15 themed puzzles. | Fifteen explicitly authored puzzles across five chapters,including compound logic,half/full adders,multiplexer,two-bit buses,echo and reset-priority feedback latch. Independently build every solution and compare outputs to separate expectations. |
| Removed | No gate budgets,wire-crossing restriction,fixed components,splitters,delays or bus lanes. | Restore each; crossing is enforced geometrically in a locked-component puzzle. Check both splitter pins,16-row two-bit combinations,sequential output and feedback state across repeated runs. |
| Weakened | Numeric display and one boolean pass result replaced animated signal propagation and full presentation. | Directional wire pulses,high/low/unknown states,expected/actual rows,efficiency,chapter/puzzle/completion navigation and illustrated PCB/components. Functional evidence cannot stand in for full art scores. |
| Replaced | Native project launch and input traces. | Local browser package,deterministic query scenarios and actual mouse/keyboard playback,with launch gate. |
| Added | Exact puzzle targets/budgets,coordinates and component choices; exported simulation and stable IDs. | Explicitly documented in both prompts. They make behavior reproducible but constrain original level-design and architectural freedom. This is a restored complete-game scope,not proof of identical difficulty. |

All14 criteria retain their original15/35/15/35 category weights. The unprovided source art libraries are replaced by optional generated industrial illustrations; code and task files are authored directly. The blank starter supplies no solved circuit. Public checking demonstrates one inverter,while private checking exercises all puzzles,wrong solutions,limits,memory,real drag/wire input and demos. Four behavior mutations target XOR logic,first-row-only acceptance,locked-gate removal and lost delay state. Final release evidence is the QA receipt for the final file hashes; manual aesthetic scores remain null.
