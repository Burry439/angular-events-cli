import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router'

import { AppComponent } from './app.component';
import { NgForm, FormsModule } from '@angular/forms';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { AuthService } from './services/auth.service';
import { ProfileComponent } from './components/profile/profile.component';
import { GaurdService } from './services/gaurd.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { MainNavComponent } from './components/main-nav/main-nav.component'
import {MatCardModule} from '@angular/material/card'
import {MatStepperModule} from '@angular/material/stepper';
import { EventsComponent } from './components/events/events.component';
import { SingleEventComponent } from './components/events/single-event/single-event.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatGridListModule} from '@angular/material/grid-list';
import { UsersCreatedEventsComponent } from './components/profile/users-created-events/users-created-events.component';
import { UsersAttendingEventsComponent } from './components/profile/users-attending-events/users-attending-events.component';
import {MatInputModule} from '@angular/material/input'
import { AgmCoreModule } from '@agm/core'
import { SlickModule } from 'ngx-slick';
import { CommentsComponent } from './components/events/single-event/comments/comments.component';
import { FilterByNamePipe } from './pipes/filtername.pipe';
import { FilterlocationPipe } from './pipes/filterlocation.pipe';
import {MatRadioModule} from '@angular/material/radio';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import * as  Cloudinary from 'cloudinary-core';
import { CreateEventComponent } from './components/create-event/create-event.component';
import {CalendarModule} from 'primeng/calendar';
import {GrowlModule} from 'primeng/growl';
import {MessageService} from 'primeng/components/common/messageservice';
import { ImageComponent } from './components/image/image.component';


const appRoutes = [
  {path: '', redirectTo:'events', pathMatch:'full'},  
  {path: 'signUp', component: SignupComponent},
  {path: 'signIn', component: SigninComponent},
  {path: 'profile', component: ProfileComponent, canActivate:[GaurdService]},  
  {path: 'events', component: EventsComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    ProfileComponent,
    MainNavComponent,
    EventsComponent,
    SingleEventComponent,
    UsersCreatedEventsComponent,
    UsersAttendingEventsComponent,
    CommentsComponent,
    FilterByNamePipe,
    FilterlocationPipe,
    CreateEventComponent,
    ImageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatStepperModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatGridListModule,
    MatInputModule,
    MatRadioModule,
    CalendarModule,
    GrowlModule,
    AgmCoreModule.forRoot({
      apiKey:"AIzaSyB9apYkFiLPc7Q0onb1fFfemAB8cLVVoiI",
      libraries: ["places"]

    }),
    SlickModule.forRoot(),
    NgFlashMessagesModule.forRoot(),
    CloudinaryModule.forRoot(Cloudinary, { cloud_name: 'dude439'}),
    
  ],
  entryComponents: [CommentsComponent,EventsComponent,SingleEventComponent, UsersCreatedEventsComponent,CreateEventComponent,ImageComponent],
  providers: [AuthService, GaurdService,MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
