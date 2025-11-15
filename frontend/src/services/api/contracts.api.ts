import { HTTPClient } from "./client";
import { config } from "../../config/environment";
import {
  CreateContractPayload,
  KeynuaContractResponse,
  ApiResponse,
} from "../../types/api.types";

export interface ContractStatusData {
  id: string;
  status: string;
  title: string;
  createdAt: string;
  completedAt?: string;
  users: Array<{
    name: string;
    email: string;
    status: "pending" | "signed" | "viewed";
    signedAt?: string;
  }>;
  webhookEvents: Array<{
    event: string;
    timestamp: string;
    data?: any;
  }>;
  progress: number;
  signedCount: number;
  totalSigners: number;
  allSigned: boolean;
}

const client = new HTTPClient(config.api.baseURL, config.api.timeout);

export const contractsAPI = {
  async create(
    payload: CreateContractPayload
  ): Promise<KeynuaContractResponse> {
    const response = await client.post<ApiResponse<KeynuaContractResponse>>(
      config.api.endpoints.contracts,
      payload
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to create contract");
    }

    return response.data;
  },
  async getStatus(contractId: string): Promise<ContractStatusData> {
    const response = await client.get<ApiResponse<ContractStatusData>>(
      config.api.endpoints.contractStatus(contractId)
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.message || "Failed to fetch contract status"
      );
    }

    return response.data;
  },

  async getById(contractId: string): Promise<KeynuaContractResponse> {
    const response = await client.get<ApiResponse<KeynuaContractResponse>>(
      `${config.api.endpoints.contracts}/${contractId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch contract");
    }

    return response.data;
  },
};
