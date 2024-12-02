export class Book{
  id:number;
  name :String;
  isRead:Boolean;

  constructor(id:number,name :String, isRead:Boolean){
    this.id=id;
    this.name=name;
    this.isRead=isRead;
  }
}
