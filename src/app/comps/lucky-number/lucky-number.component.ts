import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lucky-number',
  templateUrl: './lucky-number.component.html',
  styleUrls: ['./lucky-number.component.scss'],
  imports: [CommonModule],
})
export class LuckyNumberComponent implements OnInit {
  TOTAL_DIGITS = 10;

  digits: number[] = [];
  rollingNumbers = Array.from({ length: 20 }, (_, i) => i % 10);

  digitHeight = 48;
  transforms: string[] = [];
  resetting: boolean[] = [];

  setValue(value: any) {
    const padded = value.toString().padStart(this.TOTAL_DIGITS, '0');

    const newDigits = padded.split('').map(Number);

    newDigits.forEach((digit: number, i: number) => {
      const prev = this.digits[i] ?? 0;

      let diff = digit - prev;
      if (diff <= 0) diff += 10;

      const offset = (prev + diff) * this.digitHeight;

      // force reflow
      this.resetting[i] = true;
      this.transforms[i] = `translateY(-${prev * this.digitHeight}px)`;

      requestAnimationFrame(() => {
        this.resetting[i] = false;
        this.transforms[i] = `translateY(-${offset}px)`;
      });
    });

    this.digits = newDigits;
  }

  setValueRandom() {
    this.setValue(this.generateRandom10DigitNumber());
  }
  generateRandom10DigitNumber(): number {
    const min = 1000000000; // Minimum 10-digit number
    const max = 9999999999; // Maximum 10-digit number

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  ngAfterViewInit() {
    setTimeout(() => this.setValue('0000000000'), 300);
  }
  ngOnInit() {}
}
