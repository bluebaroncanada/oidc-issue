import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginResponse, OidcSecurityService} from "angular-auth-oidc-client";
import {CommonModule} from "@angular/common";
import {HttpClient, HttpResponse} from "@angular/common/http";

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

  constructor(private oidc: OidcSecurityService, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.oidc
      .checkAuth()
      .subscribe((loginResponse: LoginResponse) => {
        const { isAuthenticated, userData, accessToken, idToken, configId } =
          loginResponse;
        console.log(userData);
        this.userData = userData;
      });
  }

  getWeather() {
    this.httpClient.get('http://localhost:5000/WeatherForecast').subscribe((response: any) => {
      console.log(response);
    })
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
