import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../service/connectionservice.service';
import { Router } from '@angular/router';
import { WebserviceService } from '../service/webservice.service';
import * as bcrypt from "bcryptjs";

@Component({
  selector: 'login-stud',
  templateUrl: './login-stud.component.html',
  styleUrls: ['./login-stud.component.css']
})
export class LoginStudComponent implements OnInit{

  username : string = '';
  password : string = '';
  constructor(private webservice:WebserviceService) { }

  ngOnInit(): void {
    
  }
  login(){
    console.log("Username: "+this.username);
    console.log("Password: "+this.password);
    this.webservice.login("login",this.username,this.password);
  }
  getStudenti(){
    this.webservice.getStudents("getStudents");
  }

}
