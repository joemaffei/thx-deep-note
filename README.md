# THX Deep Note

A collection of my reproductions of the THX Deep Note over the years.

## Csound

This was my first experiment. I don't know if I still have the source code,
but I wrote a blog post about it, so it may be on the web somewhere.

## ToneJS

When I learned about the Web Audio API, a lot of articles claimed that it was
too difficult to make music with, and recommended a tool like ToneJS. I started
playing around with it and, of course, had to try making the THX Deep Note with
it. I [posted it on CodePen](https://codepen.io/joemaffei/pen/ejRdoL) on July 24, 2018, and the next day it rose to number
one according to [this tweet](https://twitter.com/codepenpicks/status/1022147098530246656).

## Web Audio

I revisited it in July or August 2020, but this time I wanted to take a stab at coding it using
the Web Audio API. This proved not to be as complicated as I had been convinced
a couple years prior.

`thx-v1.js`

`thx-v1.min.js` (broken)

`thx-v2.js`

`thx-v2.min.js`

I don't remember the specifics, but the fact that both minified versions are just
over 1024kB, I'm guessing I was trying to shrink the code down for entry in the
JS1024 competition

### JS1024

I figured that if I removed a couple fo things, like the LFO, I might be able
to minify the code enough to embed it in an HTML document. I spent a lot of time manually
applying several code golf tricks, which significantly cut down the size of the
final JS code. This allowed me to add the code to a click handler on a button,
complete with styling to look a bit like the THX logo.

`thx-2021-js1024.html`

`thx-2021-js1024.min.html`
