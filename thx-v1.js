// First attempt at creating the THX Deep Note using the Web Audio API,
// possibly intended as a draft for submission to the JS1024 competition.
// by Joe Maffei circa August 4, 2020

var a;
var b;
var partialLevels = [0, .5, .331, .052, .083, .008, .044, .03, .028, .023, .009, .004, .003, .008, .005, .006];
var multipliers = [.25, .25, .25, .5, .5, .5, .5, .75, .75, 1, 1, 1, 1, 1.5, 1.5, 2, 2, 2, 3, 3, 3, 4, 4, 4, 6, 6, 6, 8, 8, 10];
var oscillators = [];
var baseFrequency = 150;
var fadeInTime = 2;
var buildTime = 8;
var sustainTime = 2;
var fadeOutTime = 3;


a = new AudioContext();

var wetLevel = 0.2;
var dryLevel = 1 - wetLevel;

b = a.createGain();
b.gain.value = 0;
b.gain.linearRampToValueAtTime(1, a.currentTime + fadeInTime);
b.gain.linearRampToValueAtTime(1, a.currentTime + fadeInTime + buildTime + sustainTime);
b.gain.linearRampToValueAtTime(0, a.currentTime + fadeInTime + buildTime + sustainTime + fadeOutTime);

var rate = a.sampleRate;

var bufferLength = rate * 3;
var reverbDecay = 2;

var impulse = a.createBuffer(2, bufferLength, rate);
var impulseL = impulse.getChannelData(0);
var impulseR = impulse.getChannelData(1);

for (var i = 0; i < bufferLength; i++) {
    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferLength, reverbDecay);
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferLength, reverbDecay);
}

var reverb = a.createConvolver();
reverb.buffer = impulse;

var dry = a.createGain();
dry.gain.value = dryLevel;

var wet = a.createGain();
wet.gain.value = wetLevel;

b.connect(reverb);
b.connect(dry);

reverb.connect(wet);

dry.connect(a.destination);
wet.connect(a.destination);

multipliers.forEach((multiplier) => {
    var phase = Math.random() * 45;
    var real = partialLevels.map((partialLevel, index) => -partialLevel * Math.sin(phase * index));
    var imaginary = partialLevels.map((partialLevel, index) => partialLevel * Math.cos(phase * index));
    var wave = a.createPeriodicWave(real, imaginary);

    var initialFrequency = 200 + Math.random() * 100;
    var finalFrequency = baseFrequency * multiplier * (1 + Math.random() / 70);

    var oscillator = a.createOscillator();
    oscillator.frequency.value = initialFrequency;
    oscillator.frequency.exponentialRampToValueAtTime(initialFrequency, a.currentTime + fadeInTime);
    oscillator.frequency.exponentialRampToValueAtTime(finalFrequency, a.currentTime + fadeInTime + buildTime);
    oscillator.setPeriodicWave(wave);

    var oscillatorLevel = a.createGain();
    oscillatorLevel.gain.value = 1 / multipliers.length;

    var lfo = a.createOscillator();
    lfo.frequency.value = multiplier + Math.random();

    var lfoLevel = a.createGain();
    var relativeLfoDepth = .75;
    lfoLevel.gain.value = multiplier * relativeLfoDepth;

    var panner = a.createStereoPanner();
    var stereoWidth = 1;
    panner.pan.value = stereoWidth - Math.random() * stereoWidth * 2;

    lfo.connect(lfoLevel);
    lfoLevel.connect(oscillator.frequency);
    oscillator.connect(oscillatorLevel);
    oscillatorLevel.connect(panner);
    panner.connect(b);

    lfo.start();
    oscillator.start();

    oscillators.push(oscillator);
    oscillators.push(lfo);
});
