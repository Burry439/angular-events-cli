import { Component, OnInit,EventEmitter, Output, HostListener } from '@angular/core';
import { EventsService } from '../../../services/events.service';
import { SingleEventComponent } from '../../events/single-event/single-event.component';
import {MatDialog} from '@angular/material';
import {ImageComponent} from '../../image/image.component'



@Component({
  selector: 'app-users-attending-events',
  templateUrl: './users-attending-events.component.html',
  styleUrls: ['./users-attending-events.component.css']
})
export class UsersAttendingEventsComponent implements OnInit {
  @Output() deletedEvents = new EventEmitter<Object>();
  @Output() joinedEvents = new EventEmitter<Object>();
  @Output() leaveEvents = new EventEmitter<Object>();
  @Output() wrongFileFormat = new EventEmitter<String>()
  @Output() eventUpdated = new EventEmitter<String>()
  screenHeight:any
  screenWidth:any
  slidesToShow:number

  user = JSON.parse(localStorage.getItem('user'));
  wholeEvent
  events:any[]
  month= ["January","February","March","April","May","June","July",
  "August","September","October","November","December"];
  constructor(private eventsService: EventsService, private dialog: MatDialog) { this.onResize();}


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
        eventTime: this.events[i].time
        
      }
    })

    dialog.afterClosed()
    
    .subscribe(res =>{
      console.log(res)
      console.log(this.events[i])
      if(!res)
      {
        console.log("click out aaaaa") 
      }

     //console.log("tes "+res.image)
       else if(res === "delete")
      { 
        this.deletedEvents.emit({i:i, _id:this.events[i]._id,name:this.events[i].name})
        this.events.splice(i,1)
        
       console.log("delte "+ res)
      }

      else if (res == "wrong image format")
      { 

        this.wrongFileFormat.emit("wrong image format")
      }

     else if (res.leave)
      {   
        console.log(res + " shoul alway be here")
        if(this.events[i]._id = res.eventId._id)
        {
          this.events.splice(i,1)
          this.leaveEvents.emit(res.eventId)
        }
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
            this.events[i].name = res.name
            this.events[i].details = res.details
            this.events[i].time = res.time
            this.events[i].location = res.location

         }
      }
      else if (res.image && !res.name)
      { 
        console.log("just image")
        this.events[i].image = res.image
      }
      else
      {
        console.log("nothing happend")
      }
     

    })
  }



  ngOnInit() {
    
    this.eventsService.getUsersAttendingEvents(this.user.id).subscribe(res =>{
      this.events = res.attending
      console.log("the whole res " + res)
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
