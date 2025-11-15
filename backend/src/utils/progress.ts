import { ContractStatus } from '../services/cache.service';

export interface ProgressData {
  progress: number;
  signedCount: number;
  totalSigners: number;
  allSigned: boolean;
}

/**
 * Calculate progress metrics from contract status
 */
export const calculateProgress = (status: ContractStatus): ProgressData => {
  const totalSigners = status.users.length;
  const signedCount = status.users.filter(u => u.status === 'signed').length;
  const progress = totalSigners > 0 ? Math.round((signedCount / totalSigners) * 100) : 0;
  const allSigned = signedCount === totalSigners && totalSigners > 0;

  return { progress, signedCount, totalSigners, allSigned };
};
