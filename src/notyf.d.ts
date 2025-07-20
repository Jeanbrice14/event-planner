declare module 'notyf' {
  export class Notyf {
    constructor(options?: any);
    success(message: string | object): void;
    error(message: string | object): void;
    // Add other methods as needed (e.g., custom notifications)
  }
}
