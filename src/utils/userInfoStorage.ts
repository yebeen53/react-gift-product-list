export interface UserInfo {
    authToken: string;
    email: string;
    name: string;
  }
  
  const STORAGE_KEY = 'userInfo';
  
  export const setUserInfo = (userInfo: UserInfo) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
  };
  
  export const getUserInfo = (): UserInfo | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  };
  
  export const clearUserInfo = () => {
    localStorage.removeItem(STORAGE_KEY);
  };