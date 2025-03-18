export interface RegistrationData {
  name: string;
  username: string;
  email: string;
  password: string;
  repeated_password: string;
}


export interface RegistrationResponse {
  token: string;
  username: string;
}