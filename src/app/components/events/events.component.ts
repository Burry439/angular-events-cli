import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import { EventsService } from '../../services/events.service';
import {MatDialog} from '@angular/material';
import{SingleEventComponent} from './single-event/single-event.component'
import {CreateEventComponent} from '../create-event/create-event.component'
import {ImageComponent} from '../image/image.component'

import {MessageService} from 'primeng/components/common/messageservice';



@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  //pipes: [FilterPipe]
})
export class EventsComponent implements OnInit{

  @ViewChild('f')eventform:NgForm


  events:any
  password:string
  //username:string
  picture:File
  tempPic:any
  hasJoined:boolean
  host = JSON.parse(localStorage.getItem('user'));
  imageIndex = null
  loggedIn:boolean
  searchTerm:string
  filterType = 'Name'

  constructor(private eventsService: EventsService,
     private dialog: MatDialog,
     private dialog2: MatDialog,
     private dialog3: MatDialog,
     private messageService: MessageService
     ) { }
   month= ["January","February","March","April","May","June","July",
  "August","September","October","November","December"];  

  filterTypes = ["Country", 'Name']


  openImageDialog(id)
  { 

    let index = null
    for(let i = 0; i < this.events.length; i++)
    {
      if(this.events[i]._id == id)
      {
        index = i
      }
    }

    let dialog3 = this.dialog3.open(ImageComponent, {
    
      data: {
        image: this.events[index].image
      }
    })
  }

  openCreateEventDialog()
  {
    let dialog2 = this.dialog2.open(CreateEventComponent, {
      data: {
        
      }
    })

    dialog2.afterClosed()
    .subscribe(res =>{
      if(res == undefined)
      {
         console.log("shoulding add")
      }
      else
      {
        console.log("the res " + res)
        this.messageService.add({severity:'success', summary:'Event added', detail:'you created ' + res.name});
        this.events.push(res)
      }
      
    })

  }


  openEventDialog(id) {
   
    let index = null
    for(let i = 0; i < this.events.length; i++)
    {
      if(this.events[i]._id == id)
      {
        index = i
      }
    }
    let dialog = this.dialog.open(SingleEventComponent, {
      data: {
        eventId : this.events[index]._id,
        eventDate: this.events[index].date,
        eventTime: this.events[index].time
      }
    })

    dialog.afterClosed()
    .subscribe(res =>{

      if(!res)
      {
        console.log("click out ") 
      }

     //console.log("tes "+res.image)
       else if(res === "delete")
      { 
        this.messageService.add({severity:'success', summary:'Event deleted', detail:'you deleted ' + this.events[index].name});
        this.events.splice(index,1)
       console.log("delte "+ res)
      }


      else if (res.leave)
      { 
          
        console.log( "  this.events[i]._id :" +this.events[index].attending + ":  res.eventId._id :" +  res.eventId._id)
        if(this.events[index]._id == res.eventId._id)
        {
            console.log("be here now")
            for(let j = 0; j < this.events[index].attending.length; j++)
            {
                if(this.events[index].attending[j] == this.host.id)
                console.log(this.events[index].attending[j]+ " " + this.host.id)
                {
                  this.events[index].attending.splice(j,1)
                }
            }
        }
        this.messageService.add({severity:'success', summary:'left event', detail:'you left ' + res.name});

        }
      else if (res.join && res.eventId != undefined)
      { 
          console.log(res)
         console.log(this.events[index].attending)
         this.events[index].attending.push(this.host.id)
         console.log(this.events[index].attending)
         this.messageService.add({severity:'success', summary:'Joined event', detail:'you joined ' + res.name});

      }

      else if(res.name && !res.image) 
      { 
        this.messageService.add({severity:'success', summary:'Event edited', detail:'you edited ' + res.name});

        console.log(res.name+ " edit events") 
         if(res.date)
         {
            this.events[index].name = res.name || this.events[index].name
            this.events[index].details = res.details
            this.events[index].location = res.location
            this.events[index].date = res.date
            this.events[index].time = res.time
         }
         else
         {  
          this.events[index].location = res.location
            this.events[index].name = res.name
            this.events[index].details = res.details
            this.events[index].time = res.time

         }
      }
      else if (res.image && !res.name)
      { 
        console.log("just image")
        // this.messageService.add({severity:'success', summary:'Event image changed', detail:'you changed ' + res.name + " image"});

        this.events[index].image = res.image
      }
      else if (res == "wrong image format")
      { 
        this.messageService.add({severity:'warn', summary:'Wrong file type', detail:'please use jpg, jpeg or png'});

        console.log("show messge")
      }

    })
  }




  ngOnInit() {

    this.eventsService.getEvents().subscribe((events) => {
     console.log(events)
      if(this.host)
      {
        this.loggedIn = true
      }
      else
      {
        this.loggedIn = false
      }
      this.events = events
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
     /// console.log(this.events)
  })

  }



}
