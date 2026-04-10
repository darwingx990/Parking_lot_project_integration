import { apiClient } from '../core/api.js';
import { Toast } from '../components/toast.js';
import { Modal } from '../components/modal.js';
import { state } from '../core/state.js';

export const UsuariosView = {
    allUsers: [], // Cache para filtrado local

    async render(container) {
        if (state.user.rol !== 'administrador') {
            container.innerHTML = `<div class="error-state">Acceso denegado. Solo administradores.</div>`;
            return;
        }

        container.innerHTML = `
            <div class="module-header">
                <div class="header-content">
                    <h2>Gestión de Usuarios</h2>
                    <p>Administra los perfiles de acceso al sistema.</p>
                </div>
                <button id="addUsuarioBtn" class="btn-primary">Nuevo Usuario</button>
            </div>

            <div class="table-controls">
                <div class="search-container">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="userSearch" class="search-input" placeholder="Buscar por nombre, correo o documento...">
                </div>
            </div>
            
            <div class="card table-wrapper overflow-x">
                <table class="premium-table-v2">
                    <thead>
                        <tr>
                            <th>Identificación</th>
                            <th>Nombre Completo</th>
                            <th>Contacto</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th style="text-align: right;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="usuariosBody">
                        <tr><td colspan="6" class="loader">Cargando usuarios...</td></tr>
                    </tbody>
                </table>
            </div>
        `;

        await this.loadUsuarios();
        this.initEvents();
    },

    async loadUsuarios() {
        const body = document.getElementById('usuariosBody');
        try {
            this.allUsers = await apiClient.usuarios.getAll();
            this.renderTable(this.allUsers);
        } catch (error) {
            body.innerHTML = '<tr><td colspan="6" class="error-state">Error al cargar usuarios.</td></tr>';
        }
    },

    renderTable(users) {
        const body = document.getElementById('usuariosBody');
        if (!body) return;

        if (users.length === 0) {
            body.innerHTML = '<tr><td colspan="6" class="empty-state">No se encontraron usuarios.</td></tr>';
            return;
        }

        body.innerHTML = '';
        users.forEach(u => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div style="font-weight: 700;">${u.numeroDocumento}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">${u.tipoDocumento}</div>
                </td>
                <td>
                    <div style="font-weight: 600;">${u.primerNombre} ${u.primerApellido}</div>
                </td>
                <td>
                    <div style="font-size: 0.85rem;">${u.direccionCorreo}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${u.numeroCelular}</div>
                </td>
                <td><span class="badge ${u.perfil}">${u.perfil}</span></td>
                <td>
                    <span class="status-chip ${u.estado === 'activo' ? 'success' : 'danger'}">
                        ${u.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td style="text-align: right;">
                    <button class="btn-action edit-user" title="Editar" data-id="${u.id}">✏️</button>
                    <button class="btn-action toggle-estado" title="Cambiar Estado" data-id="${u.id}" data-estado="${u.estado}">🔄</button>
                    <button class="btn-action delete delete-user" title="Eliminar" data-id="${u.id}">🗑️</button>
                </td>
            `;
            body.appendChild(row);
        });

        // Bind delete buttons
        body.querySelectorAll('.delete-user').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.dataset.id;
                Modal.show({
                    title: 'Eliminar Usuario',
                    content: '¿Estás seguro de que deseas eliminar este usuario?',
                    confirmText: 'Eliminar',
                    onConfirm: async () => {
                        try {
                            await apiClient.usuarios.delete(id);
                            Toast.show('Usuario eliminado', 'success');
                            await this.loadUsuarios();
                        } catch (err) {
                            Toast.show(err.message, 'error');
                        }
                    }
                });
            };
        });

        // Bind toggle estado buttons
        body.querySelectorAll('.toggle-estado').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.dataset.id;
                const nuevoEstado = btn.dataset.estado === 'activo' ? 'inactivo' : 'activo';
                try {
                    await apiClient.usuarios.update(id, { estado: nuevoEstado });
                    Toast.show(`Estado cambiado a ${nuevoEstado}`, 'success');
                    await this.loadUsuarios();
                } catch (err) {
                    Toast.show(err.message, 'error');
                }
            };
        });
    },

    initEvents() {
        // Filtrado en tiempo real
        const searchInput = document.getElementById('userSearch');
        searchInput.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = this.allUsers.filter(u => 
                u.primerNombre.toLowerCase().includes(term) ||
                u.primerApellido.toLowerCase().includes(term) ||
                u.direccionCorreo.toLowerCase().includes(term) ||
                u.numeroDocumento.includes(term)
            );
            this.renderTable(filtered);
        };

        const btn = document.getElementById('addUsuarioBtn');
        if (btn) btn.onclick = () => this.showAddModal();
    },

    showAddModal() {
        Modal.show({
            title: 'Registrar Nuevo Usuario',
            content: `
                <form id="newUserForm" class="modal-form">
                    <div class="form-grid">
                        <div class="input-group">
                            <label>Tipo Documento</label>
                            <select id="u-tipo-doc" class="modal-input">
                                <option value="CC">Cédula Ciudadanía</option>
                                <option value="CE">Cédula Extranjería</option>
                                <option value="NIT">NIT</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Número Documento</label>
                            <input type="text" id="u-num-doc" class="modal-input" required>
                        </div>
                        <div class="input-group">
                            <label>Primer Nombre</label>
                            <input type="text" id="u-nombre" class="modal-input" required>
                        </div>
                        <div class="input-group">
                            <label>Primer Apellido</label>
                            <input type="text" id="u-apellido" class="modal-input" required>
                        </div>
                        <div class="input-group">
                            <label>Correo Electrónico</label>
                            <input type="email" id="u-email" class="modal-input" required>
                        </div>
                        <div class="input-group">
                            <label>Celular</label>
                            <input type="text" id="u-celular" class="modal-input" required>
                        </div>
                        <div class="input-group">
                            <label>Rol del Sistema</label>
                            <select id="u-perfil" class="modal-input">
                                <option value="1">Administrador</option>
                                <option value="2">Operador</option>
                                <option value="3">Usuario Regular</option>
                            </select>
                        </div>
                    </div>
                </form>
            `,
            confirmText: 'Crear Usuario',
            onConfirm: async () => {
                const data = {
                    tipoDocumento: document.getElementById('u-tipo-doc').value,
                    numeroDocumento: document.getElementById('u-num-doc').value,
                    primerNombre: document.getElementById('u-nombre').value,
                    primerApellido: document.getElementById('u-apellido').value,
                    direccionCorreo: document.getElementById('u-email').value,
                    numeroCelular: document.getElementById('u-celular').value,
                    perfilId: parseInt(document.getElementById('u-perfil').value),
                    estado: 'activo'
                };

                try {
                    await apiClient.usuarios.create(data);
                    Toast.show('Usuario creado exitosamente', 'success');
                    await this.loadUsuarios();
                } catch (err) {
                    Toast.show(err.message, 'error');
                }
            }
        });
    }
};
