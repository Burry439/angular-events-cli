import { Component, OnInit , Inject,EventEmitter,ViewChild,NgZone,ElementRef, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { EventsService } from '../../../services/events.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Http } from '@angular/http';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import {MatDialog} from '@angular/material';
import {ImageComponent} from '../../image/image.component'
import { Router } from '@angular/router';


@Component({
  selector: 'app-single-event',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.css']
})
export class SingleEventComponent implements OnInit {

 


  @ViewChild('f')eventform:NgForm

  slideConfig = {"slidesToShow": 1, "slidesToScroll": 1};

 
  closeDialog = new EventEmitter()
  month= ["January","February","March","April","May","June","July",
  "August","September","October","November","December"];  
    event:any
    editMode:boolean
    editImageMode:boolean
    joinedEvent:boolean
    user:any
    picture:File
    tempPic:any
    showAttending = false
    showComments = false
    loggedIn:boolean
    eventId:String



    ///////maps
    private searchElement: ElementRef
    @ViewChild('search') set content(content : ElementRef)
    {
       this.searchElement = content
        if(this.searchElement != undefined)
        { 
          this.mapsAPILoader.load().then(
        
            () => {
              
              console.log("is this running")
               let autocomplete  = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types:["address"] });
      
              
      
              autocomplete.addListener("place_changed", () => {
              this.ngZone.run(() => {
               let place: google.maps.places.PlaceResult = autocomplete.getPlace();
               if(place.geometry === undefined || place.geometry === null ){
                return;
               }
              });
              });
            }
               );
        }

      


    } 
    lat:number
    lng:number
    formattedAddress:string
    country:string
    city:string
    state:string
    searchLocation:string
    address:object
    locationInfo:object
    ///////////////





    ///subscriptions
     uploadImagesub:Subscription
     convertAddressSub:Subscription
     confirmEventChangeSub:Subscription
     joinEventSub:Subscription
     leaveEventSub:Subscription
     onDeleteEventSub:Subscription
     getSingleEventSub:Subscription

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
   private eventsService: EventsService,
   private dialogRef: MatDialogRef<SingleEventComponent>,
   private mapsAPILoader: MapsAPILoader, 
   private ngZone: NgZone,
   private http: Http,
   private dialog: MatDialog,
   private router:Router
) { }


  toSignUp()
  {

    this.router.navigate(['/signUp'])
    this.dialogRef.close()
  }

  toSignIn()
  {

    this.router.navigate(['/signIn'])
    this.dialogRef.close()
  }


openEventDialog()
{ 

  console.log("here")

 this.dialog.open(ImageComponent, {
  
    data: {
      eventId: this.event._id
    }
  })
}

openProfilePicDialog()
{ 

  console.log("here")

 this.dialog.open(ImageComponent, {
  
    data: {
      image: this.event.host.profilePic
    }
  })
}

openEventPicDialog()
{ 

  console.log("here")

 this.dialog.open(ImageComponent, {
  
    data: {
      image: this.event.image
    }
  })
}



datee = this.data.eventDate.year.toString()

toggleComments()
{
    this.showComments = !this.showComments
}

toggleAttending()
{
    this.showAttending = !this.showAttending
}


onFileSelected(event)
{     
    this.editImageMode = true
    this.tempPic = this.event.image 
     this.picture = <File>event.target.files[0]
     if (event.target.files && event.target.files[0]) 
     {
        var reader = new FileReader();
        reader.onload = (event:any) => 
        {
           this.event.image = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
     }  
}

uploadPhoto()
{ 
  this.editImageMode = false
   const fd = new FormData()
   fd.append("eventImage", this.picture, Math.random().toString(36).substr(2, 5))
   console.log(this.picture)
  this.uploadImagesub =  this.eventsService.updateEventImage(fd, this.data.eventId)
   .subscribe((res:any) =>{
     console.log(res)
     if(res == "wrong")
     {  
        console.log("bad stuff")
        this.dialogRef.close("wrong image format")
        return this.event.image = this.tempPic
     }


      const updatedImage = 
      {
        image: res,
        name:this.event.name
      }

      this.dialogRef.close(updatedImage)
     console.log( this.event.image + res)
 },
   (err)=>{
     console.log(err)
   }
)
 
}

cancel()
{  
  this.editImageMode = false
   this.event.image = this.tempPic
}



convertAddress() 
{   

  
  this.convertAddressSub = this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + 
    this.searchElement.nativeElement.value + '&key=AIzaSyB9apYkFiLPc7Q0onb1fFfemAB8cLVVoiI')
    .subscribe(res =>{

      if(res.json().status == "ZERO_RESULTS")
      { 
        this.locationInfo = this.event.location
        this.onConfirmEventChanges()
      }
      else
      { 
        console.log("converting")
        this.lat = res.json().results[0].geometry.location.lat  
        this.lng = res.json().results[0].geometry.location.lng
        this.formattedAddress = res.json().results[0].formatted_address
        for (var ac = 0; ac < res.json().results[0].address_components.length; ac++) {
      
          var component = res.json().results[0].address_components[ac];
           
          if(component.types.includes('sublocality') || component.types.includes('locality')) {
               this.city = component.long_name;
          }
          else if (component.types.includes('administrative_area_level_1')) {
              this.state = component.long_name;
          }
          else if (component.types.includes('country')) {
               this.country = component.long_name;
          }
        }
  
        this.locationInfo = 
        {
          lat:this.lat,
          lng:this.lng,
          formattedAddress: this.formattedAddress,
          city: this.city,
          state: this.state,
          country: this.country
        }
  
        console.log(this.locationInfo)
        this.onConfirmEventChanges()
      }
   
     },
     (err)=>{
      console.log("error : " + err)
      this.locationInfo = this.event.location
      this.onConfirmEventChanges()
    }
      )
     
    }
      
    

  


  






onConfirmEventChanges()
{
  
  console.log(" host "+ this.user.profilePic)
  let eventChanges;

    if(this.data.eventDate == this.eventform.value.date)
    {
      this.eventform.value.date = null
    }
    if(this.eventform.value.time == "")
    {
      this.eventform.value.time = null
    }

    if(this.searchLocation == "")
    {
      this.locationInfo = this.event.location
    }

console.log(this.eventform.value.time)
     eventChanges = 
    { 
      name: this.eventform.value.eventname,
      details: this.eventform.value.details,
      date: this.eventform.value.date || null,
      time: this.eventform.value.time || null,
      eventId: this.data.eventId,
      location: this.locationInfo,
      join: true
    }
  
  console.log("changed vent "+ eventChanges)

  this.confirmEventChangeSub = this.eventsService.editEvent(eventChanges).subscribe(res =>{

    const date = new Date(res.date)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day =  date.getDate()
    const theDate = 
    {
      year:year,
      month:month,
      day:day
    }
    res.date = theDate


    const time = new Date(res.time)
    const hour = time.getHours()
    const minute = time.getMinutes()
    
    const theTime = 
    {
      hour:hour,
      minute:minute
    }

    res.time = theTime
    
    const updatedEvent =
    {
      name: res.name,
      details: res.details,
      date:res.date,
      time:res.time,
      location:res.location,
      updatedEvent: "changed"
    }

    console.log(res)
   this.dialogRef.close(updatedEvent)
})
}



onJoinEvent()
{   
   const eventId = this.data.eventId
   const userId = this.user.id
   let updatedList = null
  //  console.log("event id" + eventId + " user id "+ userId)
 this.joinEventSub = this.eventsService.joinEvent(eventId,userId).subscribe((res: any) => {
       console.log(res)
      updatedList = {eventId:res._id, join:true, name:res.name}
      console.log(updatedList)

    this.dialogRef.close(updatedList)
  });  
}

  onLeaveEvent()
  {   
    console.log("here")
     let updatedList = null
    this.leaveEventSub = this.eventsService.leaveEvent(this.data.eventId, this.user.id).subscribe((res: any) => {
        // console.log("the res "+ res)
        // console.log("here2" + res.name)
        updatedList = {eventId:res,leave:true, name:res.name}
        console.log("1st")
        this.dialogRef.close(updatedList)
      })
    
  }
  onCancelEventChanges()
  {
    this.editMode = false;
  }


  onEditEvent()
  { 
    this.editMode = true    
  }

  onDeleteEvent()
  { 
    console.log(this.data.eventId)
    this.onDeleteEventSub = this.eventsService.deleteEvent(this.data.eventId,this.user.id,this.event.image).subscribe((res: any) => {
    console.log("the res "+ res)
  })
     this.dialogRef.close("delete")
  }

  // ngOnDestroy(){
  //   this.uploadImagesub.unsubscribe()
  //   this.convertAddressSub.unsubscribe()
  //   this.confirmEventChangeSub.unsubscribe()
  //   this.joinEventSub.unsubscribe()
  //   this.leaveEventSub.unsubscribe()
  //   this.onDeleteEventSub.unsubscribe()
  //   this.getSingleEventSub.unsubscribe()
  // }

  ngOnInit() {

 



    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.data)
    this.joinedEvent = false
     this.eventsService.getSingleEvent(this.data.eventId).subscribe(res =>{
        // console.log("host: " + res.host.name +"attending: " + res.attending[0])
         this.event = res
         this.eventId = res._id
        
        console.log(this.event.location)
        console.log(this.locationInfo)

    if(JSON.parse(localStorage.getItem('user')))
    { 
      this.loggedIn = true
      for(let i = 0; i < this.event.attending.length; i++)
      {
        if(this.event.attending[i]._id == this.user.id || this.event.attending[i] == this.user.id)
        {
          return this.joinedEvent = true
        }
        
      }
    }
    else
    {
      this.loggedIn = false
    }

      
     
    // console.log(this.datee + " < dattee")
   
    
  })
  }
 

}
