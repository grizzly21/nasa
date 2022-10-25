import {Component, OnInit} from '@angular/core';
import {NasaClientService} from "./services/nasa-client.service";
import {IRover} from "./interfaces/IRover.interface";
import {CameraType} from "./enums/camera-type.enum";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {formatDate} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {MY_FORMATS} from "./constants/date-format";
import {IPhoto} from "./interfaces/IPhoto.interface";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class AppComponent implements OnInit {
  rovers: IRover[] = [
    {
      id: 'curiosity',
      name: 'Curiosity',
      max_sol: 3631,
      supportedCameras: [
        CameraType.FHAZ,
        CameraType.RHAZ,
        CameraType.MAST,
        CameraType.CHEMCAM,
        CameraType.MAHLI,
        CameraType.MARDI,
        CameraType.NAVCAM,
      ]
    },
    {
      id: 'opportunity',
      name: 'Opportunity',
      max_sol: 2246,
      supportedCameras: [
        CameraType.FHAZ,
        CameraType.RHAZ,
        CameraType.NAVCAM,
        CameraType.PANCAM,
        CameraType.MINITES,
      ]
    },
    {
      id: 'spirit',
      name: 'Spirit',
      max_sol: 2210,
      supportedCameras: [
        CameraType.FHAZ,
        CameraType.RHAZ,
        CameraType.NAVCAM,
        CameraType.PANCAM,
        CameraType.MINITES,
      ]
    },
  ];

  planets = [
    {value: 'earth', viewValue: 'by Earth date'},
    {value: 'martian', viewValue: 'by Martian sol'},
  ]

  byPlanet: string = 'earth';
  selectedValue!: string;

  chooseForm: FormGroup = new FormGroup({
    id: new FormControl(0, Validators.required),
    camera: new FormControl('', Validators.required),
    planet: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required)
  })

  photos: IPhoto[] = [];
  paginationPhoto: IPhoto[] = [];
  selectedPage = 1;
  productsPerPage = 6;

  showWrapper: boolean = false;
  disableButton:boolean = false;

  constructor(
    private nasaService: NasaClientService) {
  }

  ngOnInit() {
  }

  submitForm(value: any) {
    value.camera = CameraType[value.camera];
    if (typeof value.date === 'object'){
      value.date = formatDate(value.date, 'YYYY-MM-dd', 'en-US');
      this.nasaService.getPhotosByEarthDate(value).subscribe(
        next => {
          if (next.photos.length === 0){
            alert("No photo in that day...");
          }else {
            this.photos = next.photos as IPhoto[];
            this.showWrapper = true;
            this.disableButton = false;
            this.displayPhotos();
          }

        },
        err => {
          alert(err);
        }
      )

    }else if (typeof value.date === 'number'){
      this.nasaService.getPhotosByMartianSol(value).subscribe(
        next => {
          if (next.photos.length === 0){
            alert("No photo in that sol...");
          }else {
            this.photos = next.photos as IPhoto[];
            this.showWrapper = true;
            this.disableButton = false;
            this.displayPhotos();
          }

        },
        err => {
          alert(err);
        }
      )
    }else{
      alert('something went wrong...')
    }
  }

  displayPhotos(){
    let pageIndex = (this.selectedPage - 1) * this.productsPerPage;
    this.paginationPhoto = this.photos.slice(pageIndex, this.productsPerPage);
    if(this.paginationPhoto.length >= this.photos.length){
      this.disableButton = true;
    }
  }

  onLoadMore(){
    this.productsPerPage = this.productsPerPage + 6;
    this.displayPhotos()
  }

  getIndex(value: string): number {
    if (!value) return 0;
    return this.rovers.map(obj => obj.id).indexOf(this.selectedValue);
  }
}
