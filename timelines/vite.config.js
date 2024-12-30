import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: {
      '.js': 'jsx', // Enable JSX in .js files
    },
  },
});
