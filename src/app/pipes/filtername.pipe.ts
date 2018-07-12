import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtername'
})
export class FilterByNamePipe implements PipeTransform {

  transform(events: any, searchTerm: any): any {
    if(searchTerm === undefined) 
    {
      return events
    }

    return events.filter((event)=>{
      return event.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    })
    
  }

}
