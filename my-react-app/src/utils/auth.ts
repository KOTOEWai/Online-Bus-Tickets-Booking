export const getUserRole = () => {
  return localStorage.getItem('userRole'); // 'admin' | 'user' | null
};
