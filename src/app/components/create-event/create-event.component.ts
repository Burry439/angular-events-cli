import { Component, OnInit,ViewChild,ElementRef, NgZone, Inject,EventEmitter } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { NgForm } from '@angular/forms';
import { EventsService } from '../../services/events.service';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { Http } from '@angular/http';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  @ViewChild('f')eventform:NgForm
  host = JSON.parse(localStorage.getItem('user'));
  closeDialog = new EventEmitter()
  ////maps //////////
  @ViewChild('search', {read: ElementRef}) public searchElement: any;
  lat:number
  lng:number
  formattedAddress:string
  country:string
  city:string
  state:string
  searchLocation:string
  address:object
  valid = true
////////////////////
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private dialogRef: MatDialogRef<CreateEventComponent>, 
  private eventsService:EventsService,
  private mapsAPILoader: MapsAPILoader, 
  private ngZone: NgZone,
  private http: Http
) { }


 convertAddress() 
 { 
    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + 
    this.searchElement.nativeElement.value + '&key=AIzaSyB9apYkFiLPc7Q0onb1fFfemAB8cLVVoiI')
    .subscribe(res =>{
      console.log(res.json())
      if(res.json().status == "ZERO_RESULTS")
      
      { 
        console.log("is it getting here")
        this.valid = false
      }
      else
      {
        this.valid = true
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
    this.onAddEvent()
      }
      console.log("is getting here 2")
   })
}


  onAddEvent()
  {   
        console.log(this.eventform.value.time)
        const newEvent = 
        {
          name: this.eventform.value.eventname,
          details: this.eventform.value.details,
          date: this.eventform.value.date,
          time: this.eventform.value.time,
          host: this.host.id,
          attending: [],
          image: 'uploads/default.png',
          location: 
          {
             lat:this.lat,
             lng:this.lng,
             formattedAddress: this.formattedAddress,
             city: this.city,
             state: this.state,
             country: this.country
          }
            
        }
        this.eventsService.addEvent(newEvent).subscribe(res =>{
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


          console.log("1")
          this.dialogRef.close(res)
          console.log('2')  
          
        })
      }

  

  ngOnInit() {

    this.mapsAPILoader.load().then(
      
      () => {
        
   
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
