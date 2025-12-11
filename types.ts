export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  role: Role;
  text: string;
}

export interface User {
  id: string;
  name: string;
  personaId: string;
}
