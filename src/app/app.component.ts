import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import {ProductService } from './service/product.service';
import { map } from 'rxjs';
import { Product } from './model/model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'API_3';

editMode:boolean=false;
isLoading:boolean=false;
allProduct:Product[]=[]
currentUpdatingId:string
@ViewChild('myForm') originalForm:NgForm;

constructor(private http:HttpClient,private productServe:ProductService)
{

}


ngOnInit(): void {

this.fetchAllProduct();
}


//custome' to fetch all product'
allFetchButtonClicked()
{
this.fetchAllProduct();
}


//submit
  onSubmitForm(product:{product_name:string,product_description:string,product_price:string})
{

console.log(product);

const head=new HttpHeaders({'myNewHeader':'Procad'});
this.http.post<{name:string}>('https://apipractise1-default-rtdb.firebaseio.com/products.json',


product,{headers:head})
.subscribe(res=>console.log(res))
}


//{[key:string]:Product}
//fetch
fetchAllProduct()
{
this.isLoading=true
this.http.get<{[key:string]:Product}>('https://apipractise1-default-rtdb.firebaseio.com/products.json')
.pipe(map(res=>{
  const allProductsArray=[];
  for(let key in res){
  if(res.hasOwnProperty(key)){
  allProductsArray.push({...res[key],id:key})
  }
  }
  return allProductsArray;
  }))
.subscribe(res=>{
console.log(res);
this.allProduct=res;
})

this.isLoading=false;




}


//remove' by id'

deleteProductById(id:string)
{
this.http.delete('https://apipractise1-default-rtdb.firebaseio.com/products/'+id+'.json')
.subscribe();
}

//'clear all products'
clearAllProduct()
{
this.http.delete('https://apipractise1-default-rtdb.firebaseio.com/products.json').subscribe();
}




//update
updateProductById(updateId:string)
{
this.currentUpdatingId=updateId;

let updatingProduct=this.allProduct.find(x=>{return x.id===updateId})

console.log(updatingProduct);
console.log(this.originalForm.value);

this.originalForm.setValue({

  product_name:updatingProduct.product_name,
  product_description:updatingProduct.product_description,
  product_price:updatingProduct.product_price




})
this.editMode=true
}

}






//class end

