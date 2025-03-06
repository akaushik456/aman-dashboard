import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/',  // Ensure this is set correctly
  plugins: [react()],
});
