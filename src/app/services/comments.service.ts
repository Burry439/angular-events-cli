import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Headers, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: Http) { }

  addComment(comment):Observable<any>
  { 
    let headers = new Headers();
    headers.append('content-type', 'application/json')
    return this.http.post('comments/addcomment',comment,{headers:headers})
    .pipe(map(res => res.json()))
  }

  getComments(eventId):Observable<any>
  { 
    let headers = new Headers();
    headers.set("Authorization", eventId)
    return this.http.get('comments/getcomments', {headers:headers})
    .pipe(map(res => res.json()))
   };

   deleteComment(commentId):Observable<any>
   {  
      let comment = 
      {
         commentId:commentId
      }
      console.log(comment)
   
      return this.http.put('comments/deletecomment',comment)
      .pipe(map(res => res.json()))
   }

   editComment(commentId,commentText):Observable<any>
   {  
      let comment = 
      {
         commentId:commentId,
         commentText:commentText
      }
      console.log(comment)
   
      return this.http.put('comments/editcomment',comment)
      .pipe(map(res => res.json()))
   }



}
