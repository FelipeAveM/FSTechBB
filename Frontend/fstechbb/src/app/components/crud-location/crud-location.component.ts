import { ThisReceiver, ThrowStmt } from '@angular/compiler';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-crud-location',
  templateUrl: './crud-location.component.html',
  styleUrls: ['./crud-location.component.css']
})
export class CrudLocationComponent implements OnInit {

  public url = 'http://localhost:3000/';
  public bodyData: any = [];
  public missingData = 'Missing Data. Please fill required fields.';
  public dataButton = 'Insert!';
  filterName:string | undefined;

  @Output()
  reload = new EventEmitter <string>();

  constructor(private PostService: PostService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
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
    this.clear();
  }

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
        if(data != null) console.log(data)
      });
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
          if(data != null) console.log(data)
        });
  
      }
    }
    this.clear();
  }
  clear(){
    this.filterName = '';
  }
  
  reloadLocations(){
    console.log('reloadLocations');
  }

}
