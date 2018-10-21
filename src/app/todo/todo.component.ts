import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  newTask
  status;
  priority;
  pending = 0;
  item;
  listItem=[];
  total;
  constructor(private http:HttpClient) {
   }

  ngOnInit() {
    this.http.post("http://localhost:8080/read", {}).subscribe(
      (data)=>{
        this.listItem = <any>data;
        console.log(data);
        this.total=this.listItem.length;
        for(let i=0;i<this.listItem.length;i++)
        {
          if(this.listItem[i].status=="pending"){
            this.pending++;
          }
        }
      }
    )
  }

  add()
  {
    if(this.newTask!=null&&this.priority!=null){
      this.http.post("http://localhost:8080/add", {task:this.newTask ,status:"pending",priority:this.priority,date:new Date().toLocaleString()}).subscribe(
        (data)=>{
          console.log(data);
        }
      )
      this.listItem.push({task:this.newTask ,status:"pending",priority:this.priority,date:new Date().toLocaleString()});
      this.newTask=null;
      this.priority=null;
      this.total++;
      this.pending++;
    }
  }

  remove(i)
  {
    if(this.listItem[i].status=="pending")
    this.pending--;
    this.total--;
    this.http.post("http://localhost:8080/delete",this.listItem[i]).subscribe(
      (data)=>{
        console.log(data);
      }
    )
    this.listItem.splice(i,1);
  }

  edit(item){
    var newtask = prompt("Enter changed data");
    console.log(newtask);
    this.http.post("http://localhost:8080/edit",{task:item.task,status:item.status,priority:item.priority,date:item.date,new:newtask}).subscribe(
      (data)=>{
        console.log(data);
      }
    )
    item.task = newtask;
    if(item.status=="pending")
    {
      item.status="done";
      this.pending--;
    }
    else
    {
      item.status="pending";
      this.pending++;
    }
  }

  updateStatus(item)
  {
    this.http.post("http://localhost:8080/updateStatus",item).subscribe(
      (data)=>{
        console.log(data);
      }
    )
    if(item.status=="pending")
    {
      item.status="done";
      this.pending--;
    }
    else
    {
      item.status="pending";
      this.pending++;
    }
  }

}
