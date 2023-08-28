export class Token {
  id: number;
  userId: number;
  refreshToken: string;

  constructor(obj?: Partial<Token>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
