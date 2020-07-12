import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SMS Crud';
  API = 'http://localhost:3000';
  // Declare empty list of people
  entries: any[] = [];
  showEnitresList: Boolean = true;
  showCreateForm: Boolean = false;
  editModeEnabled: Boolean = false;

  @ViewChild('regForm') regForm: NgForm;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllEntries();
  }

  // Add one person to the API
  createEntry(formData) {
    if(this.editModeEnabled){
      this.editModeEnabled = !this.editModeEnabled;
      this.http.post(`${this.API}/entries/` + formData.value.id, formData.value)
      .subscribe(() => {
        this.showCreateForm = false;
        this.showEnitresList = true;
        this.getAllEntries();
      })
    } else {
      this.http.post(`${this.API}/entries`, formData.value)
      .subscribe(() => {
        this.showCreateForm = false;
        this.showEnitresList = true;
        this.getAllEntries();
      })
    }
  }

  getAllEntries() {
    this.http.get(`${this.API}/entries`)
      .subscribe((entry: any) => {
        console.log(entry)
        this.entries = entry;
      })
  }

  enableEditMode(entry) {
    delete entry.__v;
    this.regForm.setValue(entry);
    this.showCreateForm = true;
    this.showEnitresList = false;
    this.editModeEnabled = true;
  }

  deleteEntry(id){
    this.http.delete(`${this.API}/entries/` + id)
      .subscribe((entry: any) => {
        alert('entry deleted');
      });
  }
}
