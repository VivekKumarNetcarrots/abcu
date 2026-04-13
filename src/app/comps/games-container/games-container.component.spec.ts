import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesContainerComponent } from './games-container.component';

describe('GamesContainerComponent', () => {
  let component: GamesContainerComponent;
  let fixture: ComponentFixture<GamesContainerComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(GamesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
