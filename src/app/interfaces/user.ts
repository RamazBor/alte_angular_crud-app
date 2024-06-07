export interface User {
  id: number;
  name: string;
  surname: string;
  birthDate: Date;
  mobile: number;
  address: Address;
  skills: Array<string>;
  workExperience: WorkExperience[];
}

interface Address {
  city: string;
  street: string;
}

interface WorkExperience {
  place: string;
  position: string;
  start: Date;
  end: Date;
}
