# START HERE (Lando)

This kit makes Claude Code build your Masterclass 101 with a team of nine agents. You don't write code. You answer questions, test on your phone, and say go.

## Set it up on your PC (10 minutes)
1. On the PC, open claude.ai, open this chat, download `lando-masterclass-101.zip`.
2. Right-click the zip, Extract All, into a folder like `C:\Users\<you>\Projects\`. Extract the whole thing. Don't copy files one at a time: the agents live in the `.claude` folder, and some unzip tools skip folders that start with a dot.
3. Open the `lando-masterclass-101` folder in File Explorer, click the address bar, type `cmd`, press Enter. A terminal opens in that folder.
4. Check the agents: type `claude agents`. You should see nine: architect, content-curator, fact-checker, troubleshooter, learning-designer, ui-designer, app-engineer, business-customer, qa-adversary.
5. Type `claude` to start.
6. Paste this:

```
Read BUILD_PROMPT.md and run Phase 0. Ask me your questions first. No app code until I type build it.
```

7. Answer its questions, read the blueprint, pick one of the two looks, then type `build it`.

## How the build runs
- Eight phases. It stops after each one so you can test on your phone. Nothing moves without your go.
- Phase 3 matters most: Fix It and the Job Runner working offline in your garage.
- Before the first deploy, tell it your current Netlify credit balance.

## If something goes sideways
- Agents missing: type `/exit`, start `claude` again, run `claude agents`.
- New session or it lost the thread: `Read docs/STATUS.md and pick up where we left off.`
- Ran out of usage mid-phase: it commits after every wave, so nothing is lost. Use the line above in a new session.
- Later, to add a fix, a lesson, or change a price: `Follow docs/HOW-TO-ADD.md and add: <what you want>`.

## What's in the kit
| File | What it is |
|---|---|
| `BUILD_PROMPT.md` | The plan Claude Code follows |
| `CLAUDE.md` | Your rules. Claude Code loads it every session |
| `knowledge/KNOWLEDGE_BASE.md` | Everything we've worked out, tagged by how sure we are |
| `.claude/agents/` | The nine specialists |
| `reference/` | Your booklet text, the Panel Map, the Model Y job sheet. Older; the knowledge base wins |
