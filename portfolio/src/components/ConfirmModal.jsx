/**
 * Confirmation Dialog Modal (Practical 6 Supplementary Problem)
 * Prompts user before destructive actions like deleting a task.
 */
function ConfirmModal({ isOpen, title, message, confirmText = 'Delete', cancelText = 'Cancel', onConfirm, onCancel, isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal-dialog animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon">{isDanger ? '⚠️' : '❓'}</span>
          <h3 className="modal-title">{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-modal-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn-modal-confirm ${isDanger ? 'danger' : 'primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
