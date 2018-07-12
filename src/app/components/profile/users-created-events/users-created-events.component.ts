import { Component, OnInit,EventEmitter, Output,HostListener } from '@angular/core';
import { EventsService } from '../../../services/events.service';
import { SingleEventComponent } from '../../events/single-event/single-event.component';
import {MatDialog} from '@angular/material';
import {ImageComponent} from '../../image/image.component'



@Component({
  selector: 'app-users-created-events',
  templateUrl: './users-created-events.component.html',
  styleUrls: ['./users-created-events.component.css']
})
export class UsersCreatedEventsComponent implements OnInit {
  @Output() deletedEvents = new EventEmitter<Object>();
  @Output() joinedEvents = new EventEmitter<Object>();
  @Output() leaveEvents = new EventEmitter<Object>();
  @Output() wrongFileFormat = new EventEmitter<String>()
  @Output() eventUpdated = new EventEmitter<String>()
  screenHeight:any
  screenWidth:any
  slidesToShow:number

  user = JSON.parse(localStorage.getItem('user'));
  events:any[]
  month= ["January","February","March","April","May","June","July",
  "August","September","October","November","December"];
  constructor(private eventsService: EventsService,private dialog: MatDialog) { }

  slideConfig = {"slidesToShow": this.slidesToShow, "slidesToScroll": 1};


  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;

      if(this.screenWidth < 760)
      { 
         this.slidesToShow = 1
      }
      else if (this.screenWidth > 760 && this.screenWidth < 1050)
      {
        this.slidesToShow = 2

      }
      else
      {
        this.slidesToShow = 3
      }

}

openEventImageDialog(i)
{
   let dialog = this.dialog.open(ImageComponent,{
      data:{
        image: this.events[i].image
      }
   })
}



  openDialog(i) {
    console.log(this.events[i])
    let dialog = this.dialog.open(SingleEventComponent, {
      data: {
        eventId : this.events[i]._id,
        eventDate: this.events[i].date,
        eventTime: this.events[i].time,

      }
    })

    dialog.afterClosed()
    .subscribe(res =>{

    


      if(!res)
      {
        console.log("click out yyyyyy") 
      }

      else if (res == "wrong image format")
      { 

        this.wrongFileFormat.emit("wrong image format")
      }

     //console.log("tes "+res.image)
       else if(res === "delete")
      { 
        this.deletedEvents.emit({i:i, _id:this.events[i]._id, name:this.events[i].name})
        this.events.splice(i,1)
        
       console.log("delte "+ res)
      }


     else if (res.leave)
      { 
        console.log( "  this.events[i]._id :" +this.events[i].attending + ":  res.eventId._id :" +  res.eventId._id)
        if(this.events[i]._id == res.eventId._id)
        {
          
            for(let j = 0; j < this.events[i].attending.length; j++)
            {
                if(this.events[i].attending[j] == this.user.id)
                {
                  this.events[i].attending.splice(j,1)
                }
            }
            this.leaveEvents.emit({id:res.eventId,name:res.name})
        }
          
          // console.log("leaving event")
          // console.log(this.events[i].attending)
       
        }
      else if (res.join)
      {   
         console.log(res)
         console.log(res.eventId)
         this.events[i].attending.push(this.user.id)
         this.joinedEvents.emit({id:res.eventId, name:res.name})
      }

      else if(res.name && !res.image) 
      { 
        this.eventUpdated.emit(res.name)
        console.log(res.name+ " edit events") 
         if(res.date)
         {
            this.events[i].name = res.name || this.events[i].name
            this.events[i].details = res.details
            this.events[i].date = res.date
            this.events[i].time = res.time
            this.events[i].location = res.location
         }
         else
         {  
          this.events[i].time = res.time
           this.events[i].location = res.location
            this.events[i].name = res.name
            this.events[i].details = res.details
         }
      }
      else if (res.image && !res.name)
      { 
        console.log("just image")
        this.events[i].image = res.image
      }
     

    })
  }




  ngOnInit() {
    
    this.eventsService.getUsersEvents(this.user.id).subscribe(res =>{
      console.log("the whole res " + res.events)
      this.events = res.events
      console.log(this.events)
      for(let i = 0; i < this.events.length; i++)
      { 
        const date = new Date(this.events[i].date)
        const year = date.getFullYear()
        const month = date.getMonth()
        const day =  date.getDate()
        const theDate = 
        {
          year:year,
          month:month,
          day:day
        }
        this.events[i].date = theDate

        const time = new Date(this.events[i].time)

        
        const hour = time.getHours()
        const minute = time.getMinutes()
        
        const theTime = 
        {
          hour:hour,
          minute:minute
        }

        this.events[i].time = theTime


      }
  },
    (err)=>{
      console.log(err)
    })
  }
}
