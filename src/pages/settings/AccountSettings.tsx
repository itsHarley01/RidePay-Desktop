import { useEffect, useState } from 'react';
import { fetchUserById } from '../../api/fetchUserApi';

interface UserData {
  systemUid?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  role: string;
}

export default function AccountSettings() {
  const uid = localStorage.getItem('uid') || '';
  const isDev = localStorage.getItem('isDev') === 'true';

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (isDev) {
      // Load from localStorage for dev superadmin
      const devUser: UserData = {
        firstName: localStorage.getItem('firstName') || 'Dev',
        lastName: localStorage.getItem('lastName') || 'User',
        role: localStorage.getItem('role') || 'super-admin',
        systemUid: 'DEV-ACCOUNT',
      };
      setUserData(devUser);
    } else if (uid) {
      // Load from backend for regular users
      const getUser = async () => {
        try {
          const data = await fetchUserById(uid);
          setUserData(data);
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      };

      getUser();
    }
  }, [uid, isDev]);

  return (
    <div className="h-full bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-auto w-full max-w-md">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
            👤
          </div>
          <div>
            {userData && (
              <>
                <p className="text-lg font-semibold text-gray-800">
                  {userData.systemUid || '—'}
                </p>
                <p className="text-base text-gray-600">
                  {`${userData.firstName} ${userData.middleName || ''} ${userData.lastName}`}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {userData.role}
                </p>
                <p>{localStorage.getItem('organization')}</p>
                <p>{localStorage.getItem('operatorUnit')}</p>
              </>
            )}
          </div>
        </div>

        {!isDev && (
          <div className="mt-6">
            <p className="text-blue-500 text-sm cursor-pointer w-full text-center hover:underline">
              Edit Profile
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
