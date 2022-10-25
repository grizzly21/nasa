import {CameraType} from "../enums/camera-type.enum";

export interface IRover{
  id: string;
  name: string;
  max_sol: number;
  supportedCameras: CameraType[];
}
