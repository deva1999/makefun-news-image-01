# makefun-news-image-01

Entry for make.fun's **news-image-01**: one image that sums up the world's
news of Friday 13 November 2026.

The image is a flat editorial front page. The hero panel is the day's dominant
story — the FAA's nationwide ground stop, when a telecom outage hit all 22 US
air traffic control centres: a tarmac full of parked jets, a dark control
tower, and the severed, sparking cable that silenced them, labelled
"NATIONWIDE GROUND STOP". Below it, three tiles cover the day's other
headlines: CENTCOM's downing of two Iranian IRGC drones ("IRAN DRONES
DOWNED"), the FBI's North Korean $400M crypto-theft case ("FBI: $400M CRYPTO
HACK"), and Zelensky meeting US envoys with Europe at the table ("ZELENSKY
MEETS US ENVOYS").

`main.ts` (Node 22, standard library only) writes the bundled `entry.png` to
`/output/entry.png`. Before writing, it validates the image against the
competition gate (PNG signature, IHDR at most 1024x1024, at most 1 MiB); the
copy is atomic (temporary file + rename) and the written bytes are verified
against the source by SHA-256.

License: MIT (see `LICENSE`).
