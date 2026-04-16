import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-fortune-wheel',
  templateUrl: './fortune-wheel.component.html',
  styleUrls: ['./fortune-wheel.component.scss'],
  standalone: true,
  imports: [IonButton],
})
export class FortuneWheelComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  segments = ['100', '200', '300', '400', '500', '600', '700', 'JACKPOT'];
  winningIndex = 0;
  startAngle = 0;
  arc = Math.PI / (this.segments.length / 2);

  isSpinning = false;
  targetAngle = 0;

  // 🔊 AUDIO
  spinAudio = new Audio('assets/sounds/spin.mp3');
  tickAudio = new Audio('assets/sounds/tick.mp3');

  lastTickIndex = -1;
  bounceBack = false;

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.draw();
  }

  // 🎨 DRAW 3D WHEEL
  draw() {
    const ctx = this.ctx;
    const cx = 150;
    const cy = 150;
    const radius = 140;

    ctx.clearRect(0, 0, 300, 300);

    // 🪙 OUTER METAL RING
    const rimGradient = ctx.createRadialGradient(cx, cy, 120, cx, cy, 150);
    rimGradient.addColorStop(0, '#444');
    rimGradient.addColorStop(0.5, '#999');
    rimGradient.addColorStop(1, '#222');

    ctx.beginPath();
    ctx.arc(cx, cy, 150, 0, Math.PI * 2);
    ctx.fillStyle = rimGradient;
    ctx.fill();

    // 🎡 SEGMENTS
    for (let i = 0; i < this.segments.length; i++) {
      const angle = this.startAngle + i * this.arc;

      const grad = ctx.createLinearGradient(0, 0, 300, 300);
      grad.addColorStop(0, this.getColor(i));
      grad.addColorStop(1, '#000');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + this.arc);
      ctx.fillStyle = grad;
      ctx.fill();

      // edge shine
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + this.arc / 2);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(this.segments[i], radius - 20, 5);
      ctx.restore();
    }

    // 💡 LIGHT SWEEP
    const light = ctx.createLinearGradient(0, 0, 300, 0);
    light.addColorStop(0, 'transparent');
    light.addColorStop(0.5, 'rgba(255,255,255,0.15)');
    light.addColorStop(1, 'transparent');

    ctx.fillStyle = light;
    ctx.fillRect(0, 0, 300, 300);

    // 🔘 CENTER HUB
    const hubGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 25);
    hubGrad.addColorStop(0, '#fff');
    hubGrad.addColorStop(1, '#666');

    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fillStyle = hubGrad;
    ctx.fill();

    // 🔺 POINTER (GLOW)
    ctx.beginPath();
    ctx.moveTo(cx - 12, 5);
    ctx.lineTo(cx + 12, 5);
    ctx.lineTo(cx, 35);
    ctx.fillStyle = '#ff006e';
    ctx.shadowColor = '#ff006e';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  getColor(i: number) {
    const palette = [
      '#ff006e',
      '#3a86ff',
      '#ffbe0b',
      '#8338ec',
      '#06d6a0',
      '#fb5607',
      '#118ab2',
      '#ffd166',
    ];
    return palette[i % palette.length];
  }

  // 🎯 SPIN
  // spin() {
  //   if (this.isSpinning) return;

  //   this.isSpinning = true;
  //   this.bounceBack = false;

  //   const winningIndex = Math.floor(Math.random() * this.segments.length);

  //   const rotations = 6;
  //   const target =
  //     rotations * 2 * Math.PI +
  //     (this.segments.length - winningIndex) * this.arc;

  //   this.targetAngle = this.startAngle + target;

  //   // 🔊 START SOUND
  //   this.spinAudio.loop = true;
  //   this.spinAudio.currentTime = 0;
  //   this.spinAudio.play();

  //   this.animate();
  // }
  spin() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.bounceBack = false;

    // 🎯 FIXED WINNER (you can hardcode or random)
    // this.winningIndex = Math.floor(Math.random() * this.segments.length);
    this.winningIndex = 4; // 👉 force "500" for testing

    const rotations = 6;

    // 🎯 calculate exact landing angle
    const segmentAngle = (2 * Math.PI) / this.segments.length;
    const tweak = 0.01; // try between 0.005 – 0.02
    const centerOffset = segmentAngle / 2;
    const target =
      rotations * 2 * Math.PI +
      (this.segments.length - this.winningIndex) * segmentAngle -
      centerOffset +
      tweak;
    // const target =
    //   rotations * 2 * Math.PI +
    //   (this.segments.length - this.winningIndex) * segmentAngle;

    this.targetAngle = this.startAngle + target;

    // 🔊 start sound
    this.spinAudio.loop = true;
    this.spinAudio.currentTime = 0;
    this.spinAudio.play();

    this.animate();
  }
  // ⚡ ANIMATION + PHYSICS
  animate() {
    const diff = this.targetAngle - this.startAngle;

    this.startAngle += diff * 0.08;

    this.handleTick();
    this.draw();

    // 🪩 bounce
    if (diff < 0.01 && !this.bounceBack) {
      this.bounceBack = true;
      this.targetAngle += 0.05;
    }

    if (this.bounceBack && Math.abs(diff) < 0.002) {
      this.spinAudio.pause();
      this.spinAudio.currentTime = 0;

      this.isSpinning = false;
      this.finish();
      return;
    }

    requestAnimationFrame(() => this.animate());
  }

  // 🔊 TICK SOUND
  handleTick() {
    const degrees = (this.startAngle * 180) / Math.PI;
    const segmentAngle = 360 / this.segments.length;

    const index = Math.floor((degrees % 360) / segmentAngle);

    if (index !== this.lastTickIndex) {
      this.lastTickIndex = index;

      this.tickAudio.currentTime = 0;
      this.tickAudio.play();

      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  }

  // 🎉 FINISH
  // finish() {
  //   const deg = (this.startAngle * 180) / Math.PI + 90;

  //   const index = Math.floor(
  //     (360 - (deg % 360)) / (360 / this.segments.length)
  //   );

  //   const result = this.segments[index];
  //   // this.segments[index];

  //   confetti({
  //     particleCount: 250,
  //     spread: 120,
  //     origin: { y: 0.6 },
  //   });

  //   if (result === 'JACKPOT') {
  //     setTimeout(() => {
  //       new Audio('assets/sounds/jackpot.mp3').play();
  //     }, 200);
  //   }

  //   setTimeout(() => {
  //     alert(`🎰 You won: ${result}`);
  //   }, 400);
  // }
  finish() {
    const result = this.segments[this.winningIndex];

    confetti({
      particleCount: 250,
      spread: 120,
      origin: { y: 0.6 },
    });

    if (result === 'JACKPOT') {
      setTimeout(() => {
        new Audio('assets/sounds/jackpot.mp3').play();
      }, 200);
    }

    setTimeout(() => {
      alert(`🎰 You won: ${result}`);
    }, 400);
  }
}
