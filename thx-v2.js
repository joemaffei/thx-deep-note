// Light refactor of thx-v1.js
// by Joe Maffei circa August 5, 2020


function play() {
    var partialLevels = [0, .5, .331, .052, .083, .008, .044, .03, .028, .023, .009, .004, .003, .008, .005, .006];
    var multipliers = [.25, .25, .25, .5, .5, .5, .5, .75, .75, 1, 1, 1, 1, 1.5, 1.5, 2, 2, 2, 3, 3, 3, 4, 4, 4, 6, 6, 6, 8, 8, 10];
    var baseFrequency = 150;
    var fadeInTime = 2;
    var buildTime = 8;
    var sustainTime = 2;
    var fadeOutTime = 3;
    var wetLevel = 0.2;
    var dryLevel = 1 - wetLevel;
    var reverbDecay = 2;
    var relativeLfoDepth = .75;
    var rnd = (nn) => Math.random() * nn;
    var a = new AudioContext();
    var impulseCalc = (zz) => (rnd(2) - 1) * Math.pow(1 - zz / a.sampleRate * 3, reverbDecay);
    var b = a.createGain();
    var reverb = a.createConvolver();
    var dry = a.createGain();
    var wet = a.createGain();
    var impulse = a.createBuffer(2, a.sampleRate * 3, a.sampleRate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);
    var i = 0;

    b.gain.value = 0;
    b.gain.linearRampToValueAtTime(1, a.currentTime + fadeInTime);
    b.gain.linearRampToValueAtTime(1, a.currentTime + fadeInTime + buildTime + sustainTime);
    b.gain.linearRampToValueAtTime(0, a.currentTime + fadeInTime + buildTime + sustainTime + fadeOutTime);

    for (; i < a.sampleRate * 3; i++) {
        impulseL[i] = impulseCalc(i);
        impulseR[i] = impulseCalc(i);
    }

    reverb.buffer = impulse;

    dry.gain.value = dryLevel;
    wet.gain.value = wetLevel;

    b.connect(reverb);
    b.connect(dry);

    reverb.connect(wet);

    dry.connect(a.destination);
    wet.connect(a.destination);

    multipliers.forEach((multiplier) => {
        var phase = rnd(45);
        var real = partialLevels.map((partialLevel, index) => -partialLevel * Math.sin(phase * index));
        var imaginary = partialLevels.map((partialLevel, index) => partialLevel * Math.cos(phase * index));
        var wave = a.createPeriodicWave(real, imaginary);
        var initialFrequency = 200 + rnd(100);
        var finalFrequency = baseFrequency * multiplier * (1 + rnd(.01));
        var oscillator = a.createOscillator();
        var oscillatorLevel = a.createGain();
        var lfo = a.createOscillator();
        var lfoLevel = a.createGain();
        var panner = a.createStereoPanner();

        oscillator.frequency.value = initialFrequency;
        oscillator.frequency.linearRampToValueAtTime(initialFrequency, a.currentTime + fadeInTime);
        oscillator.frequency.linearRampToValueAtTime(finalFrequency, a.currentTime + fadeInTime + buildTime);
        oscillator.setPeriodicWave(wave);

        oscillatorLevel.gain.value = 1 / multipliers.length;

        lfo.frequency.value = multiplier + rnd(1);
        lfoLevel.gain.value = multiplier * relativeLfoDepth;

        panner.pan.value = 1 - rnd(2);

        lfo.connect(lfoLevel);
        lfoLevel.connect(oscillator.frequency);
        oscillator.connect(oscillatorLevel);
        oscillatorLevel.connect(panner);
        panner.connect(b);

        lfo.start();
        oscillator.start();
    });
}
