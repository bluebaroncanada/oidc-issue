import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginResponse, OidcSecurityService} from "angular-auth-oidc-client";
import {CommonModule} from "@angular/common";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'client';
  userData: any = null;
  token: string = '';
  idToken: string = '';
  headers!: HttpHeaders;
  weather: any;

  constructor(private oidc: OidcSecurityService, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.oidc
      .checkAuth()
      .subscribe((loginResponse: LoginResponse) => {
        const {isAuthenticated, userData, accessToken, idToken, configId} =
          loginResponse;
        this.idToken = idToken;
        console.log(userData);
        this.userData = userData;
      });
  }

  getWeather() {

    const token = this.oidc.getAccessToken().subscribe((token) => {
      this.headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.idToken,
      });
      this.httpClient.get('https://localhost:7025/WeatherForecast', {headers: this.headers}).subscribe((response: any) => {
        this.weather = response;
      })
    });
  }

  login() {
    this.oidc.authorize();
  }

  logout() {
    this.oidc
      .logoff()
      .subscribe((result) => console.log(result));
  }
}
