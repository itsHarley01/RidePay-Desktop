import { useState } from 'react';

export default function DevMaintenanceSettings() {
  const [lightMode, setLightMode] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [lightMessage, setLightMessage] = useState('');
  const [hardMessage, setHardMessage] = useState('');

  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [devPassword, setDevPassword] = useState('');
  const [captchaPassed, setCaptchaPassed] = useState(false); // placeholder

  const isDeleteReady =
    deleteConfirmed &&
    deleteText.toLowerCase() === 'delete database' &&
    devPassword.length > 0 &&
    captchaPassed;

  // Only one maintenance mode at a time
  const handleToggle = (mode: 'light' | 'hard') => {
    if (mode === 'light') {
      setLightMode(true);
      setHardMode(false);
    } else {
      setHardMode(true);
      setLightMode(false);
    }
  };

  const handleDeleteDatabase = () => {
    // Placeholder - actual request not implemented yet
    alert('⚠️ Database deletion triggered (not implemented).');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto space-y-8">
      {/* Maintenance Settings */}
      <div>
        <h2 className="text-xl font-bold mb-2">🛠 Maintenance Settings</h2>

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            checked={lightMode}
            onChange={() => handleToggle('light')}
          />
          <label className="text-sm font-medium text-gray-700">
            Enable Light Maintenance Mode
          </label>
        </div>
        {lightMode && (
          <textarea
            placeholder="Enter light maintenance message..."
            className="w-full p-2 border rounded mb-4"
            value={lightMessage}
            onChange={(e) => setLightMessage(e.target.value)}
          />
        )}

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            checked={hardMode}
            onChange={() => handleToggle('hard')}
          />
          <label className="text-sm font-medium text-gray-700">
            Enable Hard Maintenance Mode
          </label>
        </div>
        {hardMode && (
          <textarea
            placeholder="Enter hard maintenance message..."
            className="w-full p-2 border rounded mb-4"
            value={hardMessage}
            onChange={(e) => setHardMessage(e.target.value)}
          />
        )}

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={!lightMode && !hardMode}
          onClick={() => alert('Maintenance settings saved (not implemented)')}
        >
          Save Maintenance Settings
        </button>
      </div>

      <hr className="border-gray-300" />

      {/* Danger Zone */}
      <div>
        <h2 className="text-xl font-bold text-red-600 mb-4">🚨 Danger Zone: Delete Database</h2>

        <div className="mb-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={deleteConfirmed}
              onChange={(e) => setDeleteConfirmed(e.target.checked)}
            />
            <span className="text-sm text-gray-700">I understand this action is irreversible</span>
          </label>
        </div>

        <div className="mb-2">
          <label className="text-sm font-medium text-gray-700">
            Type <code className="font-mono text-red-600">delete database</code> to confirm:
          </label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label className="text-sm font-medium text-gray-700">Enter Dev Password:</label>
          <input
            type="password"
            className="w-full mt-1 p-2 border rounded"
            value={devPassword}
            onChange={(e) => setDevPassword(e.target.value)}
          />
        </div>

        {/* Placeholder for CAPTCHA */}
        <div className="mb-4">
          <button
            className="text-sm text-blue-600 underline"
            onClick={() => setCaptchaPassed(true)}
          >
            ✅ Simulate CAPTCHA success
          </button>
        </div>

        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          disabled={!isDeleteReady}
          onClick={handleDeleteDatabase}
        >
          Delete Entire Database
        </button>
      </div>
    </div>
  );
}
