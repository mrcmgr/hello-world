import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface Pig {
  id: number;
  x: number;
  y: number;
  isRain: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div class="fixed inset-0 bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
      <div class="flex flex-col items-center justify-center text-center w-full max-w-full">
        <div class="mb-4 sm:mb-6 md:mb-8">
          <span class="text-green-400 font-mono text-xs sm:text-sm">~/dev/hello-world</span>
          <span class="text-green-400 font-mono text-xs sm:text-sm ml-2">$</span>
        </div>

        <div class="flex items-center justify-center w-full px-2">
          <h1
            (click)="spawnPig()"
            class="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold pixel-font text-white tracking-wider break-words cursor-pointer hover:scale-105 transition-transform"
          >
            {{ displayText() }}<span class="cursor">|</span>
          </h1>
        </div>
      </div>

      @for (pig of pigs(); track pig.id) {
        <div
          [class.pig-container]="!pig.isRain"
          [class.pig-rain]="pig.isRain"
          [style.left.px]="pig.x"
          [style.top.px]="pig.y"
        >
          🐷
        </div>
      }
    </div>

    <router-outlet />
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

      * {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }

      *::selection {
        background: transparent;
        color: inherit;
      }

      *::-moz-selection {
        background: transparent;
        color: inherit;
      }

      .pixel-font {
        font-family: 'Press Start 2P', monospace;
        text-shadow:
          0 0 10px rgba(74, 222, 128, 0.5),
          0 0 20px rgba(74, 222, 128, 0.3),
          0 0 30px rgba(74, 222, 128, 0.2);
        color: #4ade80;
        line-height: 1.5;
      }

      .cursor {
        animation: blink 1s step-end infinite;
        color: #4ade80;
      }

      @keyframes blink {
        0%,
        50% {
          opacity: 1;
        }
        51%,
        100% {
          opacity: 0;
        }
      }

      h1 {
        animation: glitch 5s infinite;
      }

      @keyframes glitch {
        0%,
        90%,
        100% {
          transform: translate(0);
        }
        92% {
          transform: translate(-2px, 2px);
        }
        94% {
          transform: translate(2px, -2px);
        }
        96% {
          transform: translate(-2px, -2px);
        }
        98% {
          transform: translate(2px, 2px);
        }
      }

      .pig-container {
        position: fixed;
        font-size: 3rem;
        animation:
          pigBounce 0.5s ease-out,
          pigFade 5s ease-out forwards;
        pointer-events: none;
        z-index: 1000;
      }

      .pig-rain {
        position: fixed;
        font-size: 3rem;
        animation:
          pigBounce 0.5s ease-out,
          pigFall 3s linear forwards,
          pigFade 3s ease-out forwards;
        pointer-events: none;
        z-index: 1000;
      }

      @keyframes pigBounce {
        0% {
          transform: scale(0) rotate(0deg);
        }
        50% {
          transform: scale(1.3) rotate(180deg);
        }
        100% {
          transform: scale(1) rotate(360deg);
        }
      }

      @keyframes pigFall {
        0% {
          transform: translateY(0) rotate(0deg);
        }
        100% {
          transform: translateY(calc(100vh + 100px)) rotate(720deg);
        }
      }

      @keyframes pigFade {
        0%,
        80% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    `,
  ],
})
export class App implements OnInit {
  private readonly MOBILE_BREAKPOINT_PX = 768;
  private readonly RAIN_THRESHOLD_PIGS = 10;
  private readonly MAX_USER_PIGS_MOBILE = this.RAIN_THRESHOLD_PIGS + 1;
  private readonly MIN_RAIN_DURATION_MS = 7000;
  private readonly USER_PIG_LIFETIME_MS = 4000;
  private readonly RAIN_PIG_LIFETIME_MS = 3000;
  private readonly RAIN_SPAWN_INTERVAL_MS = 200;
  private readonly PIG_MARGIN_PX = 100;
  private readonly TYPING_SPEED_MS = 150;

  protected readonly title = signal('hello-world');
  protected readonly displayText = signal('');
  protected readonly pigs = signal<Pig[]>([]);
  private readonly fullText = 'HELLO WORLD';
  private currentIndex = 0;
  private pigIdCounter = 0;
  private rainInterval: any;
  private rainStartTime: number | null = null;

  ngOnInit() {
    this.typeText();
  }

  private typeText() {
    if (this.currentIndex < this.fullText.length) {
      this.displayText.set(this.fullText.substring(0, this.currentIndex + 1));
      this.currentIndex++;
      setTimeout(() => this.typeText(), this.TYPING_SPEED_MS);
    }
  }

  private getMaxUserPigs(): number {
    return window.innerWidth <= this.MOBILE_BREAKPOINT_PX ? this.MAX_USER_PIGS_MOBILE : Infinity;
  }

  protected spawnPig() {
    const newPig: Pig = {
      id: this.pigIdCounter++,
      x: Math.random() * (window.innerWidth - this.PIG_MARGIN_PX),
      y: Math.random() * (window.innerHeight - this.PIG_MARGIN_PX),
      isRain: false,
    };

    let updatedPigs = [...this.pigs(), newPig];

    // Check if we exceeded the max user pigs limit
    const maxUserPigs = this.getMaxUserPigs();
    const userPigs = updatedPigs.filter((p) => !p.isRain);
    if (userPigs.length > maxUserPigs) {
      // Remove the oldest user pig
      const oldestUserPig = userPigs[0];
      updatedPigs = updatedPigs.filter((pig) => pig.id !== oldestUserPig.id);
    }

    this.pigs.set(updatedPigs);

    // Check if we should start raining pigs (only count user-placed pigs)
    const userPigCount = this.pigs().filter((p) => !p.isRain).length;
    if (userPigCount > this.RAIN_THRESHOLD_PIGS && !this.rainInterval) {
      this.startPigRain();
    }

    // Remove pig after its lifetime expires
    setTimeout(() => {
      this.pigs.set(this.pigs().filter((pig) => pig.id !== newPig.id));

      // Stop rain if we're back below threshold (only count user-placed pigs)
      const userPigCount = this.pigs().filter((p) => !p.isRain).length;
      if (userPigCount <= this.RAIN_THRESHOLD_PIGS && this.rainInterval && this.rainStartTime) {
        const elapsed = Date.now() - this.rainStartTime;
        if (elapsed >= this.MIN_RAIN_DURATION_MS) {
          this.stopPigRain();
        }
      }
    }, this.USER_PIG_LIFETIME_MS);
  }

  private startPigRain() {
    this.rainStartTime = Date.now();
    this.rainInterval = setInterval(() => {
      const rainPig: Pig = {
        id: this.pigIdCounter++,
        x: Math.random() * (window.innerWidth - this.PIG_MARGIN_PX),
        y: -this.PIG_MARGIN_PX, // Start above the screen
        isRain: true,
      };

      this.pigs.set([...this.pigs(), rainPig]);

      // Remove raining pig after animation
      setTimeout(() => {
        this.pigs.set(this.pigs().filter((pig) => pig.id !== rainPig.id));

        // Check if we should stop the rain
        const userPigCount = this.pigs().filter((p) => !p.isRain).length;
        if (userPigCount <= this.RAIN_THRESHOLD_PIGS && this.rainInterval && this.rainStartTime) {
          const elapsed = Date.now() - this.rainStartTime;
          if (elapsed >= this.MIN_RAIN_DURATION_MS) {
            this.stopPigRain();
          }
        }
      }, this.RAIN_PIG_LIFETIME_MS);
    }, this.RAIN_SPAWN_INTERVAL_MS);
  }

  private stopPigRain() {
    if (this.rainInterval) {
      clearInterval(this.rainInterval);
      this.rainInterval = null;
      this.rainStartTime = null;
    }
  }
}
