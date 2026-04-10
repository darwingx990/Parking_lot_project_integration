import { state } from '../core/state.js';

export const PerfilView = {
    render(container) {
        const u = state.user;
        container.innerHTML = `
            <div class="module-header">
                <h2>🪪 Mi Identificación</h2>
                <p>Consulta tus datos registrados en BioParking.</p>
            </div>
            
            <div class="card profile-card">
                <div class="profile-header">
                    <div class="profile-avatar">${u.nombre.charAt(0)}</div>
                    <div class="profile-main-info">
                        <h3>${u.nombre}</h3>
                        <span class="role-badge">${u.rol}</span>
                    </div>
                </div>
                <div class="profile-details">
                    <div class="detail-item">
                        <label>Tipo Documento</label>
                        <p>${u.tipoDocumento || 'CC'}</p>
                    </div>
                    <div class="detail-item">
                        <label>Número Documento</label>
                        <p>${u.numeroDocumento}</p>
                    </div>
                    <div class="detail-item">
                        <label>Estado de Cuenta</label>
                        <p class="status-active">Activo</p>
                    </div>
                </div>
            </div>
        `;
        this.addStyles();
    },

    addStyles() {
        if (document.getElementById('perfil-styles')) return;
        const style = document.createElement('style');
        style.id = 'perfil-styles';
        style.textContent = `
            .profile-card { max-width: 600px; padding: 40px; margin-top: 20px; }
            .profile-header { display: flex; align-items: center; gap: 20px; border-bottom: 1px solid #eee; padding-bottom: 25px; margin-bottom: 25px; }
            .profile-avatar { width: 80px; height: 80px; background: var(--accent); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 800; }
            .role-badge { background: #dbeafe; color: #2563eb; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }
            .profile-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .detail-item label { display: block; font-size: 0.8rem; color: #64748b; font-weight: 600; margin-bottom: 5px; }
            .detail-item p { font-size: 1.1rem; font-weight: 700; color: #1e293b; }
            .status-active { color: #10b981; }
        `;
        document.head.appendChild(style);
    }
};
