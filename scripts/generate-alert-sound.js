// Simple script to generate a beep sound for the door sensor alert
// This creates a simple 800Hz tone that can be used as an alert sound

const fs = require('fs');
const path = require('path');

// Create a simple beep sound data
// This is a minimal WAV file structure for a beep sound
function generateBeepWav() {
  const sampleRate = 44100;
  const duration = 1; // 1 second
  const frequency = 800; // 800Hz beep
  const amplitude = 0.3; // Volume (0-1)
  
  const numSamples = sampleRate * duration;
  const buffer = Buffer.alloc(44 + numSamples * 2); // WAV header (44 bytes) + data
  
  // WAV file header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);
  
  // Generate sine wave data
  for (let i = 0; i < numSamples; i++) {
    const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * amplitude * 32767;
    buffer.writeInt16LE(sample, 44 + i * 2);
  }
  
  return buffer;
}

// Generate and save the beep sound
const soundData = generateBeepWav();
const soundPath = path.join(__dirname, '../assets/sounds/alert-buzzer.wav');

// Ensure directory exists
const soundDir = path.dirname(soundPath);
if (!fs.existsSync(soundDir)) {
  fs.mkdirSync(soundDir, { recursive: true });
}

fs.writeFileSync(soundPath, soundData);
console.log('Alert buzzer sound generated successfully at:', soundPath);