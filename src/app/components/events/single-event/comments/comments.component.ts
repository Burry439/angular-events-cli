import { Component, OnInit,ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommentsService } from '../../../../services/comments.service';
import {ImageComponent} from '../../../image/image.component'
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @ViewChild('f')commentform:NgForm
  @ViewChild('e')editcommentform:NgForm

  @Input() eventId: String;
  user = JSON.parse(localStorage.getItem('user'));

  comments:any[]
  theComment:number
  editedComment:string
  loggedIn = false;
  constructor(private commentsService: CommentsService,private dialog: MatDialog,) { }
  

  openImageDialog(i)
  { 



    let dialog = this.dialog.open(ImageComponent, {
    
      data: {
        image: this.comments[i].commenter.profilePic

      }
    })
  }


  onAddComment()
  {
    const newComment =
    {
      comment: this.commentform.value.comment,
      userId:this.user.id,
      eventId: this.eventId
    }
    console.log(newComment)
    this.commentsService.addComment(newComment).subscribe((res: any) => {
      console.log(res)
      this.commentform.reset();

      this.comments.push(res)
    })
  }

  onDeleteComment(index)
  {
    this.commentsService.deleteComment(this.comments[index]._id).subscribe((res:any)=>{
      this.comments.splice(index,1)
      console.log("deleted " + res)
    })
  }

  onEditcomment(i)
  { 
    this.editedComment = null
    this.theComment = this.comments[i]._id
    console.log(this.theComment + this.comments[i]._id)
    //this.editMode = !this.editMode
  }

  cancel()
  {
    this.theComment = null
    this.editedComment = null
  }

  onConfirmEditcomment(i)
  { 
   
    this.commentsService.editComment(this.comments[i]._id,  this.editedComment).subscribe((res:any)=>{
      this.editedComment = null
      this.theComment = null
      console.log(res)
      this.comments[i].comment = res
    })

  }


  ngOnInit() {

      if(this.user)
      { 
        this.loggedIn = true
        console.log(this.loggedIn)

      }

    console.log(this.eventId)
    this.commentsService.getComments(this.eventId).subscribe((res: any) => {
      console.log(res)
      this.comments = res
    })
  }

}
