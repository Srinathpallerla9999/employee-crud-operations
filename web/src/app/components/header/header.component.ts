import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, public authService: AuthService) { }
  ngOnInit(): void {
    
  }


  logout() {
    localStorage.clear()
    this.router.navigate(["/login"])

  }
}
