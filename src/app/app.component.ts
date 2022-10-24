import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
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

  selectedValue!: string;

  chooseForm: FormGroup = new FormGroup({
    id: new FormControl(0, Validators.required),
    camera: new FormControl('', Validators.required),
    planet: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required)
  })

  photos: IPhoto[] = [];

  constructor(
    private nasaService: NasaClientService,
    @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
  }

  submitForm(value: any) {
    value.date = formatDate(value.date, 'YYYY-MM-dd', 'en-US');
    value.camera = CameraType[value.camera];
    this.nasaService.getPhotosByEarthDate(value).subscribe(
      next => {
        this.photos = next.photos as IPhoto[];
        console.log(this.photos)
      },
      err => {
        alert(err);
      }
    )
  }

  getIndex(value: string): number {
    if (!value) return 0;
    return this.rovers.map(obj => obj.id).indexOf(this.selectedValue);
  }
}
