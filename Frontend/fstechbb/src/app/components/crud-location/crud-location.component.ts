import { ThisReceiver, ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-crud-location',
  templateUrl: './crud-location.component.html',
  styleUrls: ['./crud-location.component.css']
})
export class CrudLocationComponent implements OnInit {

  public url = 'http://localhost:3000/';
  public body:any = [];

  constructor(private PostService: PostService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

public getValues(id:any, name:any, area:any, parent:any, internals:any){
  console.log('Entró a getValues()');
  console.log(id);
  console.log(name);
  console.log(area);
  console.log(parent);
  console.log(internals);
}

  public sendData(){
    this.PostService.post(this.url + 'add/location/', this.body)
    .subscribe(data =>{
      console.log('Location sent!')
    });
  }
}
