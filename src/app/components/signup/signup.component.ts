import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user:any
  constructor(private http: Http, 
    private authService:AuthService,
     private router: Router,
     private messageService: MessageService){}

  ngOnInit() {
  }


  

  @ViewChild('f')signupform:NgForm

  // name:string
  // password:string
  // username:string
  // email:string


  logInafterRegister()
  {
    this.authService.authenticateUser(this.user).subscribe((data:any)=>{
      if(data.success)
           {
              this.authService.storeData(data.token,data.user)
              this.router.navigate(['/profile'])
           }
           else
           {
             console.log("bad")
             this.router.navigate(['/register'])
           }
    })
    
  }

  onRegisterSubmit()
  { 
    this.user =
    {
      firstname: this.signupform.value.firstname,
      password: this.signupform.value.password,
      lastname: this.signupform.value.lastname,
      email: this.signupform.value.email, 
      events: []  
    }  
   this.authService.registerUser(this.user).subscribe((res:any) =>{  
     console.log(res)
     if(res.success == "false")
     {  
      this.messageService.add({severity:'error', summary:'Email active', detail:'The email you are trying to sign up with is already being used'});

     }
     else
     {
      this.logInafterRegister()
     }
  })
 
}

}
