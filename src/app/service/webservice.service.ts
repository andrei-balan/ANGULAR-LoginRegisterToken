import { Injectable } from '@angular/core';
import { ConnectionService } from './connectionservice.service';
import {HttpHeaders} from "@angular/common/http";
//impor di bcrypt


@Injectable({
  providedIn: 'root'
})
export class WebserviceService {

  constructor(private connectionService:ConnectionService) { }
  
  headers = new HttpHeaders();
  loginResponse:any;
  datiStudenti:any;

  async login (endPoint: string, u:string, p:string): Promise<any>{
    await new Promise((resolve,reject)=>{
      this.headers=new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
      this.connectionService.sendPostRequest(endPoint,{username: u, password: p},{headers:this.headers}).subscribe(
        (data:any)=>{
          console.log(data.token);
          localStorage.setItem("token",data.token);
          resolve(this.loginResponse=data.msg);
        },
        (error:any)=>{
          console.log("Errore login...");
          console.log(error);
          reject();
        }
      );
    });
  }
  async register (endPoint: string, u:string, p:string, e:string): Promise<any>{
    await new Promise((resolve,reject)=>{
      this.headers=new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
      this.connectionService.sendPostRequest(endPoint,{username: u, password: p, email: e},{headers:this.headers}).subscribe(
        (data:any)=>{
          console.log(data.msg);
          resolve(data.msg);
        },
        (error:any)=>{
          console.log("Errore registrazione...");
          console.log(error);
          reject();
        }
      );
    });
  }
  async getStudents(endPoint: string): Promise<any>{
    await new Promise((resolve,reject)=>{
      
      this.headers=new HttpHeaders({'Content-Type':'application/json; charset=utf-8', token: localStorage.getItem("token") || ''});
      this.connectionService.sendGetRequest(endPoint,{headers:this.headers}).subscribe(
        (data:any)=>{
          console.log(data.data);
          //aggiorno il token nel localStorage
          localStorage.setItem("token",data.token);
          //aggiorno i dati degli studenti
          
          resolve(this.datiStudenti=data.data);
        },
        (error:any)=>{
          console.log("Errore getStudents... Token KO");
          console.log(error);
          reject();
        }
      );
    });
  }
  
}

