export class User {
  id: number;
  name: string;
  email: string;
  isActivated: boolean;
  activationLink: string;

  constructor(obj?: Partial<User>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
