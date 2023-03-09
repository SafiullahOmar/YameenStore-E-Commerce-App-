import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login, SignUp } from '../dataType';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  invalidUserAuth= new EventEmitter<boolean>(false);
  constructor(private http:HttpClient,private route:Router) { }
  userSignUp(user:SignUp){
    this.http.post(`http://localhost:3000/user`,user,{observe:'response'}).
    subscribe((res)=>{
      if(res){
        localStorage.setItem('user',JSON.stringify(res.body));
        this.route.navigate(['/']);
      }
    });
  }

  userAuthReload(){
    if(localStorage.getItem('user')){
      this.route.navigate(['/']);
    }
  }

  userLogin(data:Login){
    this.http.get<SignUp[]>(`http://localhost:3000/users?email=${data.email}&password=${data.password}`,
    {observe:'response'}
    ).subscribe((result)=>{
      if(result && result.body?.length){
        localStorage.setItem('user',JSON.stringify(result.body[0]));
        this.route.navigate(['/']);
        this.invalidUserAuth.emit(false)
      }else{
        this.invalidUserAuth.emit(true)
      }
    })
  }

}
