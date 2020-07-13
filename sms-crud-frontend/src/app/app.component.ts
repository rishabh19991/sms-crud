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
  model: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.API = window.location.protocol + '//' + window.location.hostname + ':3000';
    this.getAllEntries();
  }

  createEntry() {
    if(this.editModeEnabled){
      this.editModeEnabled = !this.editModeEnabled;
      this.http.post(`${this.API}/entries/` + this.model.id, this.model)
      .subscribe(() => {
        this.showCreateForm = false;
        this.showEnitresList = true;
        this.getAllEntries();
        alert('Entry Updated!');
      })
    } else {
      this.http.post(`${this.API}/entries`, this.model)
      .subscribe(() => {
        this.showCreateForm = false;
        this.showEnitresList = true;
        this.getAllEntries();
        alert('Entry Created!');
      })
    }
  }

  getAllEntries() {
    this.http.get(`${this.API}/entries`)
      .subscribe((entry: any) => {
        this.entries = entry;
      })
  }

  displayForm() {
    this.showCreateForm = true; 
    this.showEnitresList= false;
    this.model.id = this.entries.length + 1;
  }

  enableEditMode(entry) {
    delete entry._id;delete entry.__v;
    this.model = entry;
    this.showCreateForm = true;
    this.showEnitresList = false;
    this.editModeEnabled = true;
  }

  deleteEntry(id){
    this.http.post(`${this.API}/deleteEntries/` + id, {})
      .subscribe((entry: any) => {
        this.getAllEntries();
        alert('Entry Deleted');
      });
  }

  dumpDummyData() {
    this.http.get(`${this.API}/dummyEntries`)
      .subscribe((entry: any) => {
        this.entries = entry;
      });
  }
}
