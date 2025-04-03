import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LegalLinksComponent } from '../shared/components/legal-links/legal-links.component';
import { ButtonPropertyService } from '../shared/services/button-propertys.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-welcome',
  standalone: true,
  imports: [CommonModule, LoginComponent, SignUpComponent, LegalLinksComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent implements OnInit, OnDestroy {
  loginStatus: boolean = true;
  showSuccessMessage: boolean = false;
  showIntroAnimation: boolean = true;
  isDesktop: boolean = false;

  private resizeObserver!: ResizeObserver;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private buttonPropertyService: ButtonPropertyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUpdatedLoginStatus();
    this.limitIntroAnimation();
    this.initializeResizeObserver();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  getUpdatedLoginStatus(): void {
    const subscription = this.buttonPropertyService.loginStatus$.subscribe(
      (status) => {
        this.loginStatus = status;
      }
    );
    this.subscriptions.add(subscription);
  }

  limitIntroAnimation(): void {
    setTimeout(() => {
      this.showIntroAnimation = false;
    }, 750);
  }

  initializeResizeObserver(): void {
    this.isDesktop = window.innerWidth > 1024;

    this.resizeObserver = new ResizeObserver(() => {
      const current = window.innerWidth > 1024;
      if (this.isDesktop !== current) {
        this.isDesktop = current;
        this.cdr.detectChanges();
      }
    });

    this.resizeObserver.observe(document.body);
  }

  onRegistrationSuccess(): void {
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 2000);
  }


}
