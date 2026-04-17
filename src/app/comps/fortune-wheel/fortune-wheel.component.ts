import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IonButton, Platform } from '@ionic/angular/standalone';
import confetti from 'canvas-confetti';
import { Util } from 'src/app/services/util';

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
  targetAngle = 0;

  isSpinning = false;

  spinAudio = new Audio('assets/sounds/spin.mp3');
  tickAudio = new Audio('assets/sounds/tick.mp3');

  lastTickIndex = -1;

  constructor(private util: Util, private platform: Platform) {}

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    const cx = 150;
    const cy = 150;
    const radius = 140;
    const outerRadius = 150;
    const arc = (2 * Math.PI) / this.segments.length;

    ctx.clearRect(0, 0, 300, 300);

    // Rim
    const rim = ctx.createRadialGradient(cx, cy, 120, cx, cy, outerRadius);
    rim.addColorStop(0, '#444');
    rim.addColorStop(0.5, '#999');
    rim.addColorStop(1, '#222');

    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = rim;
    ctx.fill();

    // Segments
    for (let i = 0; i < this.segments.length; i++) {
      const angle = this.startAngle + i * arc;
      const isWinner = !this.isSpinning && i === this.winningIndex;

      const grad = ctx.createLinearGradient(0, 0, 300, 300);
      grad.addColorStop(0, this.getColor(i));
      grad.addColorStop(1, '#000');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + arc);
      ctx.fillStyle = grad;
      ctx.fill();

      if (isWinner) {
        ctx.save();
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.restore();
      }

      ctx.strokeStyle = isWinner
        ? 'rgba(255,215,0,0.9)'
        : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = isWinner ? 4 : 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + arc / 2);
      ctx.fillStyle = '#fff';
      ctx.font = isWinner ? 'bold 16px sans-serif' : 'bold 14px sans-serif';
      ctx.fillText(this.segments[i], radius - 70, 5);
      ctx.restore();
    }

    // Center hub
    const hub = ctx.createRadialGradient(cx, cy, 5, cx, cy, 25);
    hub.addColorStop(0, '#fff');
    hub.addColorStop(1, '#666');

    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fillStyle = hub;
    ctx.fill();

    const pointerOffset = 5;
    const pointerHeight = 30;
    const pointerTop = cy - outerRadius;

    ctx.beginPath();
    ctx.moveTo(cx - 12, pointerTop + pointerOffset);
    ctx.lineTo(cx + 12, pointerTop + pointerOffset);
    ctx.lineTo(cx, pointerTop + pointerOffset + pointerHeight);
    ctx.fillStyle = '#ff006e';
    ctx.shadowColor = '#ff006e';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  getColor(i: number) {
    const colors = [
      '#ff006e',
      '#3a86ff',
      '#ffbe0b',
      '#8338ec',
      '#06d6a0',
      '#fb5607',
      '#118ab2',
      '#ffd166',
    ];
    return colors[i % colors.length];
  }

  spin() {
    if (this.isSpinning) return;

    this.isSpinning = true;

    // Random or test
    // this.winningIndex = Math.floor(Math.random() * this.segments.length);
    this.winningIndex = 0;

    const rotations = 6;
    const segmentAngle = (2 * Math.PI) / this.segments.length;

    const targetSegmentAngle =
      this.winningIndex * segmentAngle + segmentAngle / 2;

    // const pointerAngle = Math.PI / 2;
    const pointerAngle = -Math.PI / 2;

    const current = this.startAngle % (2 * Math.PI);

    let delta = pointerAngle - targetSegmentAngle - current;

    delta = (delta + 2 * Math.PI) % (2 * Math.PI);
    delta += rotations * 2 * Math.PI;

    this.targetAngle = this.startAngle + delta;

    this.spinAudio.currentTime = 0;
    this.spinAudio.play();

    this.animate();
  }

  animate() {
    const diff = this.targetAngle - this.startAngle;

    let speed = 0.08;

    if (diff < 1) speed = 0.05;
    if (diff < 0.5) speed = 0.03;
    if (diff < 0.2) speed = 0.015;
    if (diff < 0.1) speed = 0.008;

    this.startAngle += diff * speed;

    this.handleTick();
    this.draw();

    if (Math.abs(diff) < 0.002) {
      this.startAngle = this.targetAngle;

      this.spinAudio.pause();
      this.spinAudio.currentTime = 0;

      this.isSpinning = false;
      this.finish();
      return;
    }

    requestAnimationFrame(() => this.animate());
  }

  handleTick() {
    const segmentAngle = (2 * Math.PI) / this.segments.length;

    let adjusted = (-Math.PI / 2 - this.startAngle) % (2 * Math.PI);

    if (adjusted < 0) adjusted += 2 * Math.PI;

    const index = Math.floor(adjusted / segmentAngle);

    if (index !== this.lastTickIndex) {
      this.lastTickIndex = index;

      this.tickAudio.currentTime = 0;
      this.tickAudio.play();

      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  }

  async finish() {
    const segmentAngle = (2 * Math.PI) / this.segments.length;

    let adjusted = (-Math.PI / 2 - this.startAngle) % (2 * Math.PI);
    if (adjusted < 0) adjusted += 2 * Math.PI;

    const actualIndex = Math.floor(adjusted / segmentAngle);

    this.winningIndex = actualIndex;

    const result = this.segments[actualIndex];

    console.log('FINAL INDEX:', actualIndex);

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

    setTimeout(async () => {
      // await this.platform.ready();
      this.util.showToast({ message: 'Congratulations!!!' });
    }, 40);
    setTimeout(() => {
      this.util.showAlert({ message: `🎰 You won: ${result}` });
    }, 45);
  }
}
