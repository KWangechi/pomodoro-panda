import React, { useState, useEffect, useRef } from 'react';
import styles from './Tasks.module.css';

interface CompletedTaskMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onRepeat: () => void;
  onClose: () => void;
}

export const CompletedTaskMenu: React.FC<CompletedTaskMenuProps> = ({
  onEdit,
  onDelete,
  onRepeat,
  onClose,
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [position, setPosition] = useState<'right' | 'left'>('right');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      if (rect.right > viewportWidth) {
        setPosition('left');
      } else {
        setPosition('right');
      }
    }
  }, []);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (deleteConfirmation) {
      onDelete();
      onClose();
    } else {
      setDeleteConfirmation(true);
    }
  };

  return (
    <div
      ref={menuRef}
      className={`${styles.taskMenu} ${styles[`taskMenu${position}`]}`}
      onClick={(e) => e.stopPropagation()}
      role="menu"
      aria-label="Completed task options"
    >
      <button
        className={styles.menuItem}
        onClick={() => {
          onEdit();
          onClose();
        }}
        role="menuitem"
      >
        <span>✏️</span> Edit
      </button>
      <button
        className={styles.menuItem}
        onClick={() => {
          onRepeat();
          onClose();
        }}
        role="menuitem"
      >
        <span>🔄</span> Repeat
      </button>
      <button
        className={`${styles.menuItem} ${
          deleteConfirmation ? styles.menuItemDanger : ''
        }`}
        onClick={handleDelete}
      >
        <span>🗑️</span> Delete{deleteConfirmation ? '?' : ''}
      </button>
    </div>
  );
}; 