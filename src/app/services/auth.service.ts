import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Headers, Response } from '@angular/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})


export class AuthService {

authToken:any
user:any


  constructor(private http: Http) { }

  registerUser(user)
  { 
    let headers = new Headers();
    headers.append('content-type', 'application/json')
    return this.http.post('users/register',user,{headers:headers})
    .pipe(map(res => res.json()))
  }

  authenticateUser(user):Observable<any>
  {
   let headers = new Headers();
    headers.append('content-type', 'application/json')
    return  this.http.post('users/authenticate', user, {headers:headers})
    ///type it out like this exactly !!!!!!!
    .pipe(map(res => res.json()))
  }




  loadToken()
  { 
    ///id_token is the default name 
    const token = localStorage.getItem('id_token')
    this.authToken = token
  }

  storeData(token,user)
  {
    localStorage.setItem('id_token',token)
    localStorage.setItem('user',JSON.stringify(user))
    this.authToken = token
    this.user = user
    //console.log(this.user)
  }

  logOut()
  {
     this.authToken = null
     this.user = null
     localStorage.clear()
  }


  isLoggedIn():boolean
  {
    if (localStorage.getItem('id_token')) {
      return  true;
    }
    else
    {
      return false;
    }
  }

  updateProfilePic(fd)
  { 
    let headers = new Headers();
    headers.set("Authorization", localStorage.getItem('user'))
    return this.http.put('users/photo', fd, {headers:headers}).pipe(map(res =>  res.json()))
  }

  getProfile():Observable<any>
  { 
    this.loadToken()
 
    let headers = new Headers();
    headers.set("Authorization", this.authToken)
    headers.set('content-type', 'application/json')
    return this.http.get('users/profile', {headers:headers})
    .pipe(map(res => res.json()))
   };
   
  }


