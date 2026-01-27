import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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
            class="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold pixel-font text-white tracking-wider break-words cursor-pointer hover:scale-105 transition-transform">
            {{ displayText() }}<span class="cursor">|</span>
          </h1>
        </div>
      </div>

      @if (showPig()) {
        <div 
          class="pig-container"
          [style.left.px]="pigX()"
          [style.top.px]="pigY()">
          🐷
        </div>
      }
    </div>

    <router-outlet />
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    .pixel-font {
      font-family: 'Press Start 2P', monospace;
      text-shadow: 0 0 10px rgba(74, 222, 128, 0.5),
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
      0%, 50% {
        opacity: 1;
      }
      51%, 100% {
        opacity: 0;
      }
    }

    .typing-animation {
      animation: fadeIn 2s ease-in 2.5s both;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    h1 {
      animation: glitch 5s infinite;
    }

    @keyframes glitch {
      0%, 90%, 100% {
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
      animation: pigBounce 0.5s ease-out, pigFade 5s ease-out forwards;
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

    @keyframes pigFade {
      0%, 80% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `],
})
export class App implements OnInit {
  protected readonly title = signal('hello-world');
  protected readonly displayText = signal('');
  protected readonly showPig = signal(false);
  protected readonly pigX = signal(0);
  protected readonly pigY = signal(0);
  private readonly fullText = 'HELLO WORLD';
  private currentIndex = 0;

  ngOnInit() {
    this.typeText();
  }

  private typeText() {
    if (this.currentIndex < this.fullText.length) {
      this.displayText.set(this.fullText.substring(0, this.currentIndex + 1));
      this.currentIndex++;
      setTimeout(() => this.typeText(), 150);
    }
  }

  protected spawnPig() {
    // Prevent spam clicking - only spawn if no pig is currently visible
    if (this.showPig()) {
      return;
    }
    
    this.pigX.set(Math.random() * (window.innerWidth - 100));
    this.pigY.set(Math.random() * (window.innerHeight - 100));
    this.showPig.set(true);
    
    setTimeout(() => {
      this.showPig.set(false);
    }, 5000);
  }
}
