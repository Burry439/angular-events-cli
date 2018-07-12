import { Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {CreateEventComponent} from '../create-event/create-event.component'
import {MatDialog} from '@angular/material';
import {MessageService} from 'primeng/components/common/messageservice';
import {ImageComponent} from '../image/image.component'



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user:any
  // hosting:any
  // attending:any[]
  constructor(private authService: AuthService, private dialog: MatDialog,private messageService: MessageService
  ) { }
  host = JSON.parse(localStorage.getItem('user'));
  picture:File
  tempPic:any
  saveChange:boolean
  show:boolean
  imageIndex:number
  eventImageIndex = null
  profilePicRows = 3
  changePictureRows = 0
  showMycreatedEvents:boolean
  showMyattendingEvents:boolean
  userCreatedEvents:number




  eventUpdated(event)
  { 
    this.messageService.add({severity:'success', summary:'Event edited', detail:'you edited ' + event});

  }

  wrongFileFormat()
  { 
    this.messageService.add({severity:'warn', summary:'Wrong file type', detail:'please use jpg, jpeg or png'});

  }


  openEventImageDialog()
{
   let dialog = this.dialog.open(ImageComponent,{
      data:{
        image: this.user.profilePic
      }
   })
}

  openCreateEventDialog()
  { 
    this.showMycreatedEvents = false;
    this.showMyattendingEvents = false;
    let dialog = this.dialog.open(CreateEventComponent, {
      data: {

      }
    })

    dialog.afterClosed()
    .subscribe(res =>{
      if(res == undefined)
      {
         console.log("shoulding add")
      }
      else
      {
        console.log("the res " + res)
        this.messageService.add({severity:'success', summary:'Event added', detail:'you created ' + res.name});

        this.user.events.push(res._id)
      }
      
    })

  }



  joinEvent(event)
  {
    console.log(event)
    
    this.user.attending.push(event.id)
    this.messageService.add({severity:'success', summary:'Joined event', detail:'you joined ' + event.name});

    console.log(this.user.attending)
  }

  deleteEvent(info)
  {   
      console.log(info._id)
      for(let i = 0; i < this.user.attending.length; i++)
      {   
          console.log("attending id:"+this.user.attending + " id :"+  info._id)
         if(this.user.attending == info._id)
         {  
            console.log("yoyoyo")
            this.user.attending.splice(i,1)   
         }
      }
      this.messageService.add({severity:'success', summary:'Event deleted', detail:'you deleted ' + info.name});
      this.user.events.splice(info.i,1)
  }

  leaveEvent(event)
  {     
      this.user.attending.pop()
      this.messageService.add({severity:'success', summary:'Event left', detail:'you left ' + event.name});

  }


  showAttendingEvents()
  { 
    if(this.user.attending.length && !this.showMyattendingEvents)
    {
      this.showMycreatedEvents = false
      this.showMyattendingEvents = true
    }
    else
    {
      this.showMyattendingEvents = false
    }
  }

  showCreatedEvents()
  { 
    if(this.user.events.length && !this.showMycreatedEvents )
    {
    this.showMycreatedEvents = true
    this.showMyattendingEvents = false
    }
    else
    {
      this.showMycreatedEvents = false
    }
  }

 onFileSelected(event)
 {  
      this.profilePicRows = 2
      this.changePictureRows = 1
      this.picture = <File>event.target.files[0]
      if (event.target.files && event.target.files[0]) 
      {
         var reader = new FileReader();
         reader.onload = (event:any) => 
         {
            this.user.profilePic = event.target.result;
         }
         reader.readAsDataURL(event.target.files[0]);
      }  
      this.show = true
      this.saveChange = true
 }
 uploadPhoto()
 {
    const fd = new FormData()
    fd.append("profilePic", this.picture, this.picture.name)

    console.log(this.picture)
    this.authService.updateProfilePic(fd)
    .subscribe(res =>{
        console.log(res)
        if(res == "wrong")
        { 
            this.user.profilePic = this.tempPic
           this.wrongFileFormat()
            return null
        }

      this.user.profilePic = res.profilePic
      console.log(res.profilePic)
  },
    (err)=>{
      console.log(err)
    }
)
this.profilePicRows = 3
this.changePictureRows = 0
  this.saveChange = false
 }

 cancel()
 {  
   this.user.profilePic = this.tempPic
    this.saveChange = false
    this.show = false
    this.profilePicRows = 3
    this.changePictureRows = 0
 }

ngOndestroy()
{
  
}


  ngOnInit() {
    this.authService.getProfile().subscribe((profile:any) => {
      this.user = profile
      this.tempPic = this.user.profilePic
      this.userCreatedEvents = this.user.events.length
      console.log(profile)
      console.log(this.userCreatedEvents)
    },
    err => {
      console.log(err)
      this.show = false;
    }
  )
    
  }

}
