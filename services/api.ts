import { APPS_SCRIPT_URL } from '../constants';
import { RegistrationData, ApiResponse } from '../types';

/**
 * Registers a new user via Google Apps Script.
 */
export const registerUser = async (data: RegistrationData): Promise<ApiResponse> => {
  if (APPS_SCRIPT_URL.includes("REPLACE_WITH")) {
    await new Promise(r => setTimeout(r, 1000));
    console.warn("Using Mock API. Configure constants.ts with real URL.");
    return { result: 'success', message: 'User registered successfully (Mock)' };
  }

  const formData = new FormData();
  formData.append('action', 'register');
  formData.append('name', data.name);
  formData.append('email', data.email);

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: formData,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("API Error", error);
    return { result: 'error', message: 'Network error occurred.' };
  }
};

/**
 * Checks the subscription status of a user.
 */
export const checkSubscriptionStatus = async (email: string): Promise<ApiResponse> => {
  if (APPS_SCRIPT_URL.includes("REPLACE_WITH")) {
    await new Promise(r => setTimeout(r, 800));
    // Mock Logic
    if (email.includes("active")) {
      // Return a date 20 days in the future for mock
      const mockExpiry = new Date();
      mockExpiry.setDate(mockExpiry.getDate() + 20);
      return { result: 'success', status: 'Active', expiryDate: mockExpiry.toISOString() };
    }
    if (email.includes("reg")) return { result: 'success', status: 'Registered' };
    return { result: 'error', message: 'User not found (Mock)' };
  }

  try {
    const url = `${APPS_SCRIPT_URL}?action=checkStatus&email=${encodeURIComponent(email)}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("API Error", error);
    return { result: 'error', message: 'Unable to verify status.' };
  }
};

/**
 * ADMIN: Fetches all users (requires admin username & password).
 */
export const fetchAllUsers = async (username: string, password: string): Promise<ApiResponse> => {
  if (APPS_SCRIPT_URL.includes("REPLACE_WITH")) {
    // Mock Data
    return { 
      result: 'success', 
      data: [
        { timestamp: '2023-10-01', name: 'Mock User 1', email: 'active@test.com', status: 'Active', notes: '', expiryDate: '2023-12-31T00:00:00.000Z' },
        { timestamp: '2023-10-05', name: 'Mock User 2', email: 'reg@test.com', status: 'Registered', notes: '' }
      ] 
    };
  }

  try {
    const url = `${APPS_SCRIPT_URL}?action=getUsers&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("API Error", error);
    return { result: 'error', message: 'Failed to fetch users.' };
  }
};

/**
 * ADMIN: Verifies admin credentials to grant dashboard access.
 */
export const verifyAdmin = async (username: string, password: string): Promise<ApiResponse> => {
  // We reuse fetchAllUsers to validate credentials
  const res = await fetchAllUsers(username, password);
  if(res.result === 'success') {
      // Return 30 days from now for consistent testing
      const adminExpiry = new Date();
      adminExpiry.setDate(adminExpiry.getDate() + 30);
      return { result: 'success', status: 'Active', expiryDate: adminExpiry.toISOString() };
  }
  return res;
};

/**
 * ADMIN: Updates user status (requires admin username & password).
 */
export const updateUserStatus = async (email: string, newStatus: string, username: string, password: string): Promise<ApiResponse> => {
  if (APPS_SCRIPT_URL.includes("REPLACE_WITH")) {
    return { result: 'success', message: 'Status updated (Mock)' };
  }

  const formData = new FormData();
  formData.append('action', 'updateStatus');
  formData.append('email', email);
  formData.append('newStatus', newStatus);
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: formData,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("API Error", error);
    return { result: 'error', message: 'Failed to update status.' };
  }
};