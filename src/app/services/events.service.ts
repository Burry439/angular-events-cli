import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Headers, Response } from '@angular/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  host = JSON.parse(localStorage.getItem('user'));

  allEvents: any[]
 
  constructor(private http: Http) { }

  getSingleEvent(eventId)
  {
    let headers = new Headers();
    headers.set("Authorization", eventId)
    return this.http.get('events/getsingleevents', {headers:headers})
    .pipe(map(res => this.allEvents = res.json()))
  }


  getUsersAttendingEvents(userId)
  {
    let headers = new Headers();
    headers.set("Authorization", userId)
    return this.http.get('users/getattendingevents', {headers:headers})
    .pipe(map(res =>  res.json()))
  }


  getUsersEvents(userId)
  {
    let headers = new Headers();
    headers.set("Authorization", userId)
    return this.http.get('users/getcreatedevents', {headers:headers})
    .pipe(map(res =>  res.json()))
  }


  leaveEvent(eventId, userId)
  { 
      const event =
      {
        eventId:eventId,
        userId:userId
      }
      let headers = new Headers();
      headers.append('content-type', 'application/json')
    return this.http.put('events/leaveevent',event)
    .pipe(map(res => res.json()))
  }


  joinEvent(eventId, userId)
  {
    const userInfo =
    {
      eventId: eventId,
      userId: userId
    }
    console.log(userInfo)
    let headers = new Headers();
    headers.append('content-type', 'application/json')
    return this.http.post('events/join',userInfo ,{headers:headers})
    .pipe(map(res => res.json()))
  }

  updateEventImage(fd,eventId):Observable<any>
  { 
    
    let headers = new Headers();
    headers.set("Authorization", eventId)
    return this.http.put('events/photo', fd, {headers:headers} )
    .pipe(map(res => res.json()))
  }


  editEvent(event):Observable<any>
  { 
    let headers = new Headers();
    headers.append('content-type', 'application/json')
    return this.http.put('events/editevents',event,{headers:headers})
    .pipe(map(res => res.json()))
  }

  addEvent(event):Observable<any>
  { 
    let headers = new Headers();
    headers.append('content-type', 'application/json')
    return this.http.post('events/addevents',event,{headers:headers})
    .pipe(map(res => res.json()))
  }

  getEvents():Observable<any>
  { 
    let headers = new Headers();
    headers.set('content-type', 'application/json')
    return this.http.get('events/getevents', {headers:headers})
    .pipe(map(res => this.allEvents = res.json()))
   };



   deleteEvent(eventId,userId,image):Observable<any>
   {  
      console.log(eventId,userId)
      const info = 
      {
        eventId:eventId,
        userId:userId,
        image:image
      }
      return this.http.put('events/delete',info)
      .pipe(map(res => res.json()))
   }

}
