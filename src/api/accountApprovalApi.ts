// src/api/accountApprovalApi.ts
import axiosInstance from './axiosInstance';

/**
 * Approves a user account by UID
 * @param uid - Firebase UID of the user to approve
 */
const approveAccount = async (uid: string): Promise<void> => {
  try {
    await axiosInstance.patch(`/approve-account/${uid}`);
    console.log(`✅ Approved account for UID: ${uid}`);
  } catch (error: any) {
    console.error(`❌ Failed to approve account for UID: ${uid}`, error);
    throw error;
  }
};

export default approveAccount;
