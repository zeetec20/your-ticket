export interface IResponse {
  data?: Object | Object[];
  error?: {
    status: number;
    message: string;
  };
  jwt?: String;
}
