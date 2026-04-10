import { apiClient } from '../core/api.js';
import { state } from '../core/state.js';
import { Toast } from '../components/toast.js';

export const LoginView = {
    init() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;

        this.setupTabs();

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const numeroDocumento = document.getElementById('numeroDocumento').value;
            const clave = document.getElementById('clave').value;
            const mode = document.getElementById('loginRole').value;

            try {
                const btn = loginForm.querySelector('button');
                btn.disabled = true;
                btn.textContent = 'Autenticando...';

                // Preparar cuerpo según el modo
                const body = { numeroDocumento };
                if (mode === 'personal') {
                    body.clave = clave;
                }

                const result = await apiClient.auth.login(body);
                
                // El backend devuelve { token, usuario: { ... } }
                // Si el rol no viene explícito, podríamos decodificarlo del JWT (atob)
                // Pero asumimos que el resultado ya trae el objeto usuario con su rol.
                state.setUser(result.usuario, result.token);
                
                const userRole = result.usuario.rol.toLowerCase();
                Toast.show(`¡Bienvenido ${result.usuario.nombre || ''}!`, 'success');
                
                setTimeout(() => {
                    this.redirectByRole(userRole);
                }, 800);

            } catch (error) {
                console.error('Login Error:', error);
                Toast.show(error.message || 'Error en la autenticación', 'error');
                
                const btn = loginForm.querySelector('button');
                btn.disabled = false;
                btn.textContent = 'Iniciar Sesión';
            }
        });

        if (state.isAuthenticated()) {
            this.redirectByRole(state.user.rol.toLowerCase());
        }
    },

    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const passwordGroup = document.getElementById('passwordGroup');
        const claveInput = document.getElementById('clave');
        const loginRoleInput = document.getElementById('loginRole');
        const idLabel = document.getElementById('idLabel');

        tabs.forEach(tab => {
            tab.onclick = () => {
                const role = tab.dataset.role;
                
                // Actualizar UI activa
                tabs.forEach(t => t.classList.toggle('active', t === tab));
                loginRoleInput.value = role;

                if (role === 'usuario') {
                    passwordGroup.style.display = 'none';
                    claveInput.removeAttribute('required');
                    idLabel.textContent = 'Ingresa tu Cédula';
                    claveInput.value = '';
                } else {
                    passwordGroup.style.display = 'block';
                    claveInput.setAttribute('required', '');
                    idLabel.textContent = 'Número de Documento';
                }
            };
        });
    },

    redirectByRole(role) {
        // Redirección post-login según requerimiento
        if (role === 'administrador') {
            window.location.href = 'dashboard.html';
        } else {
            // Operadores y Usuarios externos van a sus vistas operativas
            // En nuestra SPA, dashboard.html maneja la navegación interna
            window.location.href = 'dashboard.html';
        }
    }
};

if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', () => LoginView.init());
}
