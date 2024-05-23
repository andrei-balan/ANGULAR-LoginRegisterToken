import { Component, OnInit } from '@angular/core';
import { WebserviceService } from '../service/webservice.service';
import * as bcrypt from "bcryptjs";

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private webservice:WebserviceService) { }
  username : string = '';
  password : string = '';
  email : string = '';

  ngOnInit(): void {
  }
  register(){
    this.webservice.register("register",this.username,bcrypt.hashSync(this.password,10),this.email);
  }

}
