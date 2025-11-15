export enum Language {
  ES = 'es',
  EN = 'en'
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp'
}

export enum ValidationToSkip {
  EXPIRATION_DATE = 'expiration-date',
  INSTRUCTIONS_GRADE = 'instructions-grade'
}

export interface ContractDocument {
  name: string;
  base64?: string;
  storageId?: string;
}

export interface ContractUser {
  name: string;
  email?: string;
  phone?: string;
  groups: string[];
  validationsToSkip?: ValidationToSkip[];
}

export interface CavaliData {
  [key: string]: any;
}

export interface ContractFlags {
  chosenNotificationOptions?: NotificationChannel[];
  cavaliData?: CavaliData;
}

export interface ContractMetadata {
  [key: string]: string | number | boolean;
}

export interface TemplateOptions {
  [key: string]: any;
}

export interface CreateContractPayload {
  title: string;
  templateId: string;
  documents: ContractDocument[];
  users: ContractUser[];
  description?: string;
  reference?: string;
  language?: Language;
  userEmailNotifications?: boolean;
  expirationInHours?: number;
  expirationDatetime?: string;
  onBehalfOf?: string;
  metadata?: ContractMetadata;
  flags?: ContractFlags;
  templateOptions?: TemplateOptions;
}

export interface KeynuaContractResponse {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  [key: string]: any;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

