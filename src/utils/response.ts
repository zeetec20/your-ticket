export interface IResponse {
  data?: Object | Object[] | null;
  error?: {
    status: number;
    message: string;
  };
  jwt?: String;
}
