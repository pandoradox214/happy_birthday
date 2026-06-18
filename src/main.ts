import './style.css'

// --- NEW: Tell TypeScript about our external Confetti library ---
declare global {
  interface Window {
    confetti: any;
  }
}

// --- NEW: Dynamically load the canvas-confetti library ---
const confettiScript = document.createElement('script');
confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
document.head.appendChild(confettiScript);

// 1. Inject the Birthday Card HTML directly into the #app container
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="relative w-full min-h-[100dvh] bg-gradient-to-br from-pink-200 via-purple-300 to-indigo-400 flex flex-col items-center justify-center p-4 overflow-hidden select-none [-webkit-tap-highlight-color:transparent]">
  
  <div class="absolute top-14 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-sm font-bold text-purple-700 z-20">
    🐶 Dogs Booped: <span id="pop-count">0</span>
  </div>

  <div id="card" class="relative z-10 bg-white/95 backdrop-blur-md p-6 md:p-12 rounded-3xl shadow-2xl text-center max-w-[90%] md:max-w-md w-full border border-white/20 transform transition-all duration-500 hover:scale-[1.02]">
    

    <img src="${import.meta.env.BASE_URL}birthday_gorl.jpg" alt="Birthday Girl" class="w-24 h-24 md:w-32 md:h-32 mx-auto object-cover rounded-full border-4 border-white shadow-lg mb-4 " />
    
    <h1 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
      Happy Birthday!
    </h1>
    <p class="text-gray-600 font-medium mb-6 md:mb-8 text-xl md:text-2xl">Tita Eia</p>
    
    <button id="open-btn" class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-purple-500/30 transform active:scale-95 transition-all text-base md:text-lg cursor-pointer">
      Open Card 💌
    </button>

    <div id="secret-message" class="hidden opacity-0 max-h-0 overflow-hidden transition-all duration-700 ease-in-out mt-6 pt-6 border-t border-purple-100">
      <p class="text-base md:text-lg font-serif text-pink-600 italic mb-4 leading-relaxed">
        "Congrats sa new work mo. Paldo na naman ba tayo? What I can say is that thank you for being the beacon of comfort sa bahay, also thank you for everything may you enjoy your day and work day"
      </p>
      <div class="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-widest animate-pulse mt-4">
        ✨ Tap the floating dogs to boop them! ✨
      </div>
    </div>

  </div>
</div>
`

// 2. Query the freshly injected DOM Elements
const openButton = document.getElementById('open-btn') as HTMLButtonElement | null;
const secretMessage = document.getElementById('secret-message') as HTMLDivElement | null;
const card = document.getElementById('card') as HTMLDivElement | null;
const popCountDisplay = document.getElementById('pop-count') as HTMLSpanElement | null;

// 3. Setup Audio and Interactive State variables
const bgMusic = new Audio(import.meta.env.BASE_URL + 'happy_birthday.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4;

const woofSound = new Audio(import.meta.env.BASE_URL + 'woof.mp3');
let duckTimeout: number | undefined;

const dogEmojis = ['🐶', '🐕', '🐩', '🦮', '🐕‍🦺', '🐾', '🐕‍🦺'];
const bubbleColors = ['bg-amber-200/90', 'bg-orange-200/90', 'bg-yellow-200/90', 'bg-stone-200/90', 'bg-pink-200/90', 'bg-sky-200/90'];
let dogInterval: number | undefined;
let boopedCount = 0;

// 4. Floating Dog Generator Logic
function spawnDog() {
  const container = document.querySelector('#app > div');
  if (!container) return;

  const dogBubble = document.createElement('div');
  
  const randomColor = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
  const randomDog = dogEmojis[Math.floor(Math.random() * dogEmojis.length)];
  const randomX = Math.random() * 80 + 10; 
  const randomSize = Math.floor(Math.random() * 15) + 45; 
  const duration = Math.random() * 6 + 12; 

  dogBubble.className = `absolute bottom-0 left-0 ${randomColor} rounded-full flex items-center justify-center shadow-md border border-white/40 cursor-pointer transition-all duration-150 active:scale-75 animate-float z-0`;
  
  dogBubble.style.left = `${randomX}vw`;
  dogBubble.style.width = `${randomSize}px`;
  dogBubble.style.height = `${randomSize}px`;
  dogBubble.style.fontSize = `${randomSize * 0.55}px`; 
  dogBubble.style.setProperty('--float-duration', `${duration}s`);
  
  dogBubble.textContent = randomDog;

  dogBubble.addEventListener('click', () => {
    boopedCount++;
    if (popCountDisplay) popCountDisplay.textContent = boopedCount.toString();
    
    // 🎵 Play Bark Sound 
    const bark = woofSound.cloneNode() as HTMLAudioElement;
    bark.volume = 0.8; 
    bark.play().catch(() => {}); 
    
    // 🎚️ Duck Background Music Volume
    bgMusic.volume = 0.1; 

    if (duckTimeout) window.clearTimeout(duckTimeout);

    // 🔊 Restore volume after 800ms
    duckTimeout = window.setTimeout(() => {
      bgMusic.volume = 0.4; 
    }, 800); 

    dogBubble.textContent = '❤️';
    dogBubble.classList.add('scale-150', 'opacity-0', 'pointer-events-none');
    setTimeout(() => dogBubble.remove(), 150);
  });

  container.appendChild(dogBubble);
  setTimeout(() => dogBubble.remove(), duration * 1000);
}

// 5. Main Card Click Event Listener
if (openButton && secretMessage && card) {
  openButton.addEventListener('click', () => {
    const isHidden = secretMessage.classList.contains('hidden');

    if (isHidden) {
      // 🎊 FIRE CONFETTI!
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#fbcfe8', '#e9d5ff', '#c7d2fe', '#fde68a'], // Matches your card's theme!
          zIndex: 100 // Ensures it pops over the card
        });
      }

      // 🎵 Play Music!
      bgMusic.play().catch(error => console.log("Audio play blocked by browser:", error));

      secretMessage.classList.remove('hidden');
      setTimeout(() => {
        secretMessage.classList.remove('opacity-0', 'max-h-0');
        secretMessage.classList.add('opacity-100', 'max-h-[600px]');
      }, 10);
      
      card.classList.add('shadow-pink-300/50');
      openButton.textContent = 'Close Card 🐕';
      openButton.classList.replace('from-purple-500', 'from-neutral-500');
      openButton.classList.replace('to-pink-500', 'to-neutral-600');

      dogInterval = window.setInterval(spawnDog, 100);
      for (let i = 0; i < 4; i++) setTimeout(spawnDog, i * 200); 
      
    } else {
      // 🔇 Pause Music!
      bgMusic.pause();

      secretMessage.classList.remove('opacity-100', 'max-h-[600px]');
      secretMessage.classList.add('opacity-0', 'max-h-0');
      setTimeout(() => secretMessage.classList.add('hidden'), 700);

      card.classList.remove('shadow-pink-300/50');
      openButton.textContent = 'Open Card 💌';
      openButton.classList.replace('from-neutral-500', 'from-purple-500');
      openButton.classList.replace('to-neutral-600', 'to-pink-500');

      clearInterval(dogInterval);
    }
  });
}