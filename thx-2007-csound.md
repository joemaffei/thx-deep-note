# The THX "Deep Note" Challenge

(from May 24th, 2007)

Every once in a while I get some crazy idea in my head and I can't seem to stop thinking about it until I give it a try. This time, the idea came from stumbling into an article about the famous THX sound. In this article, Dr. James "Andy" Moorer, the creator of the "most widely-recognized piece of computer-generated music in the world," describes his process in detail. Here's an excerpt of the article, with a few key sections that caught my eye:

*I set up some synthesis programs for the ASP that made it behave like a huge digital music synthesizer. I used the **waveform from a digitized cello tone** as the basis waveform for the oscillators. I recall that it had **12 harmonics**. I could get about **30 oscillators** running in real-time on the device. Then I wrote the "score" for the piece.*

*The score consists of a C program of about 20,000 lines of code. The output of this program is not the sound itself, but is the sequence of parameters that drives the oscillators on the ASP. That 20,000 lines of code produce about 250,000 lines of statements of the form "set frequency of oscillator X to Y Hertz".*

*The oscillators were not simple - they had 1-pole smoothers on both amplitude and frequency. **At the beginning, they form a cluster from 200 to 400 Hz**. I randomly assigned and poked the frequencies so they drifted up and down in that range. At a certain time (where the producer assured me that the THX logo would start to come into view), I jammed the frequencies of the final chord into the smoothers and set the smoothing time for the time that I was told it would take for the logo to completely materialize on the screen. At the time the logo was supposed to be in full view, I set the smoothing times down to very low values so the frequencies would converge to the frequencies of the big chord (which had been typed in by hand - based on a **150-Hz root**), **but not converge so precisely** that I would lose all the beats between oscillators. All followed by the fade-out. It took about 4 days to program and debug the thing. The sound was produced entirely in real-time on the ASP. (...)*

*There are **many, many random numbers** involved in the score for the piece. Every time I ran the C-program, it produced a new "performance" of the piece. The one we chose had that **conspicuous descending tone** that everybody liked. It just happened to end up real loud in that version.*

With those bits of information in mind, and some logical thinking, I figured I could make my own version of the THX Deep Note. Not just recreating the sound, but emulating the thought process behind a task such as the one Dr. Moorer had in his hands. Of course, it would be impossible to recreate the sound exactly like the original, so I took a few creative liberties while trying to be as scientific as possible about the whole thing.

Csound seemed like the best environment for this project. Besides, Dr. Moorer talks about a "score", and a "C program"...

Before I could get into coding anything, I had to find a "cello tone". So I sampled a cello waveform from Edirol Orchestral, brought it into Sound Forge, normalized it, trimmed it and this is what I got: ~~cello.wav~~ (missing)

Looking at the spectral view of this waveform, I could approximate the amplitudes of the first 22 partials fairly accurately. The original sound used only the first 12, but I figured it wouldn't hurt to go farther. Here's a view of the first few partials:



I jotted down those amplitudes in Excel, and adapted the decibel formula to get the relative amplitudes in percentile form. Like this:

| Partial	| Amplitude | 10^(amp/25) |
|---|---|---|
|1	|-25|	0.100*|
|2	|-12|	0.331|
|3	|-32|	0.052|
|4	|-27|	0.083|
|5	|-52|	0.008|
|6	|-34|	0.044|
|7	|-38|	0.030|
|8	|-52|	0.008|
|9	|-37|	0.033|
|10|	-39|	0.028|
|11|	-41|	0.023|
|12|	-51|	0.009|
|13|	-63|	0.003|
|14|	-48|	0.012|
|15|	-51|	0.009|
|16|	-60|	0.004|
|17|	-63|	0.003|
|18|	-60|	0.004|
|19|	-63|	0.003|
|20|	-53|	0.008|
|21|	-57|	0.005|
|22|	-55|	0.006|

Since the fundamental seemed too weak compared to the octave, I changed its amplitude from 0.1 to 0.5. In the end, it gave the sound a lot more body.
Before I could program anything, I had to figure out what notes were being played in the original Deep Note so I could program them into Csound. I did it by ear, and it sounded to me like a big C# "power chord", in 3 octaves: C#, G#, C#, G#, C#, G#. Here's a little discrepancy though... Dr. Moorer says the chord had a 150Hz root. The recording I have shows more of a 70Hz root, where the octave would be at 140Hz, not 150. So I went with 70Hz and added a good amount of 35Hz.

Then it was time to get down and dirty with Csound. I created the score first. The frequencies I ended up with were 35, 70, 105, 140, 210, 280, 420. I tried running it with just a simple oscillator and it didn't sound right. So I kept going... 560, 840, 1120, 1680, 2240. Ten frequencies, for the 30 oscillators described in the article. So I just tripled each oscillator, but that wasn't it. It seemed some oscillators had to have more weight than others, while some needed two or three for the detuning to sound right. But I'm jumping ahead of myself...

With a rough idea for the score, I went on to create the orchestra file. I needed oscillators that would go from somewhere between 200 and 400Hz to whatever their final frequency would be. A cluster of 30 randomly assigned oscillators sounded ugly in that range. Besides, sometimes the lowest notes would start too high, unlike the original Deep Note. So I put a "weight" to the random factor by adding 1/10th of the final frequency to 200. That way, the lowest oscillators would start anywhere between 200 and 203.5, while the highest would start between 200 and 424. That "conspicuous descending tone" would always be there as well.

An LFO could provide enough pitch drift so that the final chord would be thick enough without having regular beats, so each oscillator got its own sawtooth LFO whose frequency is anywhere between 0 and 2Hz, and whose amplitude is 1/100th of the final frequency. Again, the higher the final frequency, the more detuning the oscillator gets.

The final frequencies would also need an amount of randomness, so that the chord would have that synth-y, "unison spread" quality to it. At first I had the frequency envelope ending at exactly the 7 second mark, but that sounded too mechanical. Keeping Dr. Moorer's words in mind -- "many, many random numbers" -- I made it so the "landing" time would be anywhere between 6.5 and 7 seconds. Perfect.

Csound's linear envelopes weren't right for the amplitude, and the exponential ones were too steep. So I multiplied a linear envelope by an "assistant" envelope to generate a more musical fade-in and out.

Here's what the score file looks like:

```
sr = 44100
kr = 44100
ksmps = 1
nchnls = 1
instr 1
seed 0
iinit = 200+rnd(p4/10)
ifinal = p4+birnd(p4/200)
kfenv expseg iinit, 6.75+rnd(.25)-p2, ifinal, 9, ifinal
kaenv linseg 0, 6-p2, p5, 6, p5, 4, 0
ka1 linseg 0.5, 12, 1, 4, 0
klfo lfo p4/100, rnd(2), 4
a1 oscil ka1*kaenv*1.7, kfenv+klfo, 1
out a1
```

That's it! 14 lines of code versus the original 20,000... I'm sure there's a lot more to the original program, but this one still does a pretty good job. Here's the orchestra file:

```
f1 0 1024 10 .5 .331 .052 .083 .008 .044 .03 .028 .023 .009 .004 .003 .008 .005 .006
; sta dur freq amp
i1 0.0 16.0 35 2000
i1 0.1 15.9 35 2000
i1 0.2 15.8 35 2000
i1 0.3 15.7 70 2000
i1 0.4 15.6 70 2000
i1 0.5 15.5 70 2000
i1 0.6 15.4 70 2000
i1 0.7 15.3 105 1500
i1 0.8 15.2 105 1500
i1 0.9 15.1 140 1500
i1 1.0 15.0 140 1500
i1 1.1 14.9 140 1500
i1 1.2 14.8 140 1200
i1 1.3 14.7 210 1200
i1 1.4 14.6 210 1200
i1 1.5 14.5 280 1200
i1 1.6 14.4 280 1200
i1 1.7 14.3 280 1200
i1 1.8 14.2 420 1500
i1 1.9 14.1 420 1500
i1 2.0 14.0 420 1500
i1 2.1 13.9 560 1500
i1 2.2 13.8 560 1500
i1 2.3 13.7 560 1500
i1 2.4 13.6 840 1200
i1 2.5 13.5 840 1200
i1 2.6 13.4 1120 1200
i1 2.7 13.3 1120 1000
i1 2.8 13.2 1680 800
i1 2.9 13.1 2240 400
e
```

If you listen to the result without first hearing the original Deep Note, you'd almost think it's the real deal. Of course, the original sounds much better, but it's mainly because I don't have the exact same cello sample as the original (and because I don't want to spend days staring at spectral pictures, waveforms and spreadsheets). Besides, this is the raw sample. I'm sure that with a little EQ, compression and reverb, you could get even closer to the original sound. And if you listen closely, the oscillators on the original don't come in in the order I programmed them. At any rate, the spirit of the sound is there.

Whew! Now I can finally get this out of my mind! Who knows what's next...
