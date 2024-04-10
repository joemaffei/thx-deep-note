<CsoundSynthesizer>

<CsOptions>
-o dac
</CsOptions>

<CsInstruments>
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
endin
</CsInstruments>

<CsScore>
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
</CsScore>

</CsoundSynthesizer>
