import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetService } from 'src/app/services/get.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  public url = 'http://localhost:3000/';
  public locations: any = [];
  public parentData: any = [];
  public parents: any = [];
  public defaultLoc = 'Earth';
  public internalsData: any = [];
  public internals: any = [];
  public defaultInts = 'No Internals';

  constructor(private GetService: GetService) {


  }
  ngOnInit(): void {
    this.loadLocations();
  }

  public loadLocations() {
    this.GetService.get(this.url + 'get/locations')
      .subscribe(data => {
        console.log(data)
        this.locations = data;
        //this.callParent();
        this.callInternals();
      });

  }
  //PARENT

  public callParent() {
    for (let index = 0; index < this.locations.length; index++) {
      this.getParentData(this.locations[index].id, index);
    }
  }

  public getParentData(parentId: number, i: number) {
    this.GetService.get(this.url + 'get/parent/' + parentId)
      .subscribe(data => {
        this.parentData = data;
        console.log(this.parentData);
        this.loadParent(i);
      });
  }

  public loadParent(index: number) {
    if (this.parentData == null) this.parents[index] = this.defaultLoc;
    else {
      this.parents[index] = this.parentData.name;
      console.log(this.parents[index]);
    }
    this.locations[index].parent_loc = this.parents[index];
    console.log(this.locations[index].parent_loc);
  }

  //INTERNALS

  public callInternals() {
    console.log('Cant regs: ' + this.locations.length)
    for (let index = 0; index < this.locations.length; index++) {
      this.getInternalsData(this.locations[index].id, index);
    }
  }

  public getInternalsData(internalId: number, i: number) {
    this.GetService.get(this.url + 'get/internals/' + internalId)
      .subscribe(data => {
        this.internalsData = data;
        console.log(this.internalsData);
        this.loadInternals(i);
      });
  }

  public loadInternals(index: number) {
    this.internals[index] = ''
    if (this.internalsData == null) this.internals[index] = this.defaultInts;
    else {
      console.log('Internals Length = ' + this.internalsData.length);
      for (let subindex = 0; subindex < this.internalsData.length; subindex++) {
        this.internals[index] = this.internals[index] + ', ' + this.internalsData[subindex].name;
        console.log(this.internals[index]);
      }

    }
    if (this.internalsData != null) this.locations[index].internal_loc = this.internals[index].substring(2, this.internals[index].length );
    else this.locations[index].internal_loc = this.internals[index];
    console.log(this.locations[index].internal_loc);

  }
}

