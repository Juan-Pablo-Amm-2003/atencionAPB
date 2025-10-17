import { useState } from 'react';

interface LoginModalProps {
  onLogin: (username: string) => void;
}

const LoginModal = ({ onLogin }: LoginModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      setError('El usuario y la contraseña no pueden estar vacíos.');
      return;
    }
    // Simulación de autenticación: éxito si la contraseña no está vacía.
    onLogin(username);
  };

  return (
    <div className="fixed inset-0 bg-gray-200 flex justify-center items-center z-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Panadería Valentín</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mt-1 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Ingrese su usuario"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white font-bold py-3 mt-6 rounded-lg hover:bg-blue-700 transition-colors text-lg"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
