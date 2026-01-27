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
          <h1 class="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold pixel-font text-white tracking-wider break-words">
            {{ displayText() }}<span class="cursor">|</span>
          </h1>
        </div>
      </div>
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
  `],
})
export class App implements OnInit {
  protected readonly title = signal('hello-world');
  protected readonly displayText = signal('');
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
}
