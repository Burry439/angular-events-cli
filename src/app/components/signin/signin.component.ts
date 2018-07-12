import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm,FormBuilder, FormGroup, } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  
  constructor(private http: Http,
     private authService: AuthService,
      private router: Router,
      private messageService: MessageService) { }

  ngOnInit() {
  }


  @ViewChild('f')signinform:NgForm

  password:string
  email:string

  onSignIn()
  { 
    
    const user = 
    {
      password: this.signinform.value.password,
      email: this.signinform.value.email,
    }

    this.authService.authenticateUser(user).subscribe((res) =>{
        if(res.success)   
        { 
          console.log(" token ::" + res.token + " user::" + res.user )
          this.authService.storeData(res.token, res.user)
          this.router.navigate(['/profile'])
        }
        else
        { 
          this.messageService.add({severity:'error', summary:'Incorrect info', detail:'The email or password you entered is invalid'});

        }
    })
    
    
   
  }


}
