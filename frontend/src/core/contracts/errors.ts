export class ContractError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ContractError';
  }
}

export class FileError extends ContractError {
  constructor(message: string) {
    super(message, 'FILE_ERROR');
    this.name = 'FileError';
  }
}

export class APIError extends ContractError {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message, 'API_ERROR');
    this.name = 'APIError';
  }
}
