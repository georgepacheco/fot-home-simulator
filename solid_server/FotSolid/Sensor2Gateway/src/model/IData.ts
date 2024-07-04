export interface IDataEntry {
    code: string;
    method: string;
    header: {
      sensor: string;
      device: string;
      time: {
        collect: number;
        publish: number;
      };
      location: {
        lat: number;
        long: number;
      };
      sensorType: string;
      unit: string;
      quantityKind: string;
      deviceUUID: string
    };
    data: string[];
    datetime_pub: string;
  }