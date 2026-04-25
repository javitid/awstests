import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { BehaviorSubject, Observable, combineLatest, from, of } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { getFirebaseAuthInstance, isFirebaseConfigured } from '../config/firebase.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth?: Auth;
  private readonly authReady = new BehaviorSubject<boolean>(false);
  private readonly currentUser = new BehaviorSubject<User | null>(null);
  private loginStatus = new BehaviorSubject<boolean>(false);
  private username = new BehaviorSubject<string | null>(
    sessionStorage.getItem('username')
  );
  private readonly googleProvider = new GoogleAuthProvider();

  constructor() {
    if (!isFirebaseConfigured()) {
      this.authReady.next(true);
      return;
    }

    this.auth = getFirebaseAuthInstance();
    onAuthStateChanged(this.auth, async (user) => {
      this.currentUser.next(user);
      this.loginStatus.next(Boolean(user));
      this.saveUserSession(user);
      this.authReady.next(true);
    });
  }

  isFirebaseReady(): boolean {
    return isFirebaseConfigured();
  }

  signOutExternal(): Promise<void> {
    if (!this.auth) {
      this.clearUserSession();
      return Promise.resolve();
    }

    return signOut(this.auth).then(() => {
      this.clearUserSession();
    });
  }

  signInWithGoogle(): Promise<UserCredential> {
    const auth = this.getRequiredAuth();
    return signInWithPopup(auth, this.googleProvider);
  }

  signInAsGuest(): Promise<UserCredential> {
    const auth = this.getRequiredAuth();
    return signInAnonymously(auth);
  }

  login(loginModel: { email: string; password: string }): Observable<UserCredential> {
    return from(
      signInWithEmailAndPassword(
        this.getRequiredAuth(),
        loginModel.email,
        loginModel.password
      )
    );
  }

  register(registerModel: { email: string; password: string }): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(
        this.getRequiredAuth(),
        registerModel.email,
        registerModel.password
      )
    );
  }

  confirmUser(): Observable<boolean> {
    return of(true);
  }

  refreshToken(): Observable<string> {
    const user = this.currentUser.value;

    if (!user) {
      return of('');
    }

    return from(user.getIdToken(true));
  }

  revokeToken(): Observable<void> {
    return from(this.signOutExternal());
  }

  getToken(): string {
    return sessionStorage.getItem('token') || '';
  }

  saveUsername(username: string): void {
    sessionStorage.setItem('username', username);
    this.username.next(username);
  }

  loggedIn(): boolean {
    return !!this.currentUser.value || sessionStorage.getItem('token') === 'firebase-authenticated';
  }

  setLoginStatus(val: boolean): void {
    this.loginStatus.next(val);
  }

  setUsername(val: string | null): void {
    this.username.next(val);
  }

  isAuthenticated$(): Observable<boolean> {
    return combineLatest([this.authReady, this.loginStatus]).pipe(
      filter(([ready]) => ready),
      map(([, isLoggedIn]) => isLoggedIn),
      distinctUntilChanged()
    );
  }

  private getRequiredAuth(): Auth {
    if (!this.auth) {
      throw new Error('Firebase Auth is not configured yet. Update src/environments/environment*.ts.');
    }

    return this.auth;
  }

  private saveUserSession(user: User | null): void {
    if (!user) {
      this.clearUserSession();
      return;
    }

    sessionStorage.setItem('token', 'firebase-authenticated');
    const username = user.isAnonymous ? 'Invitado' : user.displayName || user.email || 'Usuario';
    this.saveUsername(username);
  }

  private clearUserSession(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    this.loginStatus.next(false);
    this.username.next(null);
    this.currentUser.next(null);
  }
}
