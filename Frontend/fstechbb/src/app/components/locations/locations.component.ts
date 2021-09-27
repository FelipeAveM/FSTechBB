import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetService } from 'src/app/services/get.service';
import { PostService } from 'src/app/services/post.service';

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
  public idLocations: any = [];
  public bodyData: any = [];
  public missingData = 'Missing Data. Please fill required fields.';
  public dataButton = 'Insert!';

  @ViewChild('idupd') inputFilters: any;

  constructor(private GetService: GetService, private PostService: PostService) {


  }
  ngOnInit(): void {
    this.loadLocations();
  }

  public loadLocations() {
    this.GetService.get(this.url + 'get/locations')
      .subscribe(data => {
        console.log(data)
        this.locations = data;
        this.callParent();
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



  //------------CRUD----------

  public sendData() {
    var body = {
      id: this.bodyData[0],
      name: this.bodyData[1],
      area_m2: this.bodyData[2],
      parent_loc: this.bodyData[3],
      internal_loc: JSON.parse(this.bodyData[4])
    }

    this.PostService.post(this.url + 'add/location/', body)
      .subscribe(data => {
        console.log('Location sent!')
        if(data != null){
          console.log(data);
          this.ngOnInit();
          this.reloadLocations();
        }
      });
  }

  public getValues(id: any, name: any, area: any, parent: any, internals: any) {
    console.log('Entró a getValues()');
    if (id == '' || name == '' || area == '') {
      console.log(this.missingData);
    }
    else {
      this.bodyData[0] = id;
      this.bodyData[1] = name;
      this.bodyData[2] = area;
      if(internals != '') this.bodyData[3] = parent;
      else this.bodyData[3] = null;
      if(internals != '') this.bodyData[4] = '[' + internals + ']';
      else this.bodyData[4] = null;
      this.sendData();
    }
  }

  updateLocation(id: any, name: any){
    console.log('Entró a updateLocation()');
    if (id == '' || name == '') {
      console.log(this.missingData);
    }
    else {
      this.bodyData[0] = id;
      this.bodyData[1] = name;

      var body = {
        id: this.bodyData[0],
        name: this.bodyData[1]
      }
      if(id != ''){
        this.PostService.post(this.url + 'update/name/', body)
        .subscribe(data => {
          console.log('Location sent to update!')
          if(data != null){
            console.log(data);
            this.ngOnInit();
            this.reloadLocations();
          }
        });
      }
    }
    
  }

  deleteLocation(id: any){
    console.log('id = ' + id);
    var body = {
      id: 0
    }
    console.log('Entró a deleteLocation() id = ' + id);
    if(id != ''){
      this.PostService.post(this.url + 'remove/location/' + id, body)
      .subscribe(data => {
        console.log('Location sent to delete!');
        if(data != null) console.log(data);
        this.ngOnInit();
      });
    }
  }

  //-----OTHERS METHODS

  reloadLocations(){
    console.log('reloadLocations');
    this.ngOnInit();
    this.inputFilters.nativeElement.value('');
  }
}

