export const Modal = {
    show({ title, content, confirmText = 'Aceptar', cancelText = 'Cancelar', onConfirm, showCancel = true }) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'dynamicModal';
        
        modal.innerHTML = `
            <div class="card modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${showCancel ? `<button class="btn-secondary" id="modalCancel">${cancelText}</button>` : ''}
                    <button class="btn-primary" id="modalConfirm">${confirmText}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        const close = () => {
            modal.style.display = 'none';
            modal.remove();
        };
        
        if (showCancel) {
            document.getElementById('modalCancel').onclick = close;
        }
        
        document.getElementById('modalConfirm').onclick = async () => {
            if (onConfirm) {
                await onConfirm();
            }
            close();
        };
        
        // Cerrar al clickear fuera
        modal.onclick = (e) => {
            if (e.target === modal) close();
        };
    }
};
