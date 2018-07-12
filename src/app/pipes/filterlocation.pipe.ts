import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterlocation'
})
export class FilterlocationPipe implements PipeTransform {

  transform(events: any, searchTerm: any): any {
    if(searchTerm === undefined) 
    {
      return events
    }

    return events.filter((event)=>{
      return event.location.country.toLowerCase().includes(searchTerm.toLowerCase()) 
    })
  }

}
