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
