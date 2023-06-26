import dotenv from 'dotenv';
dotenv.config();

export enum EnvironmentType {
  PROD = 'PROD',
  DEV = 'DEV',
  TEST = 'TEST',
}

export class Environment {
  static get ENV(): string { return (process.env.ENV || EnvironmentType.DEV)?.toUpperCase(); }
  static get UDP_PORT(): number { return process.env.UDP_PORT ? +process.env.UDP_PORT : 53; }
  static get HTTP_PORT(): number { return process.env.HTTP_PORT ? + process.env.HTTP_PORT : 80; }
}
