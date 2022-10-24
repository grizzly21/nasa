import {CameraType} from "../enums/camera-type.enum";

export interface IRover{
  id: string;
  name: string;
  supportedCameras: CameraType[];
}
