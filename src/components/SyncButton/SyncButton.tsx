/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { getData, syncData } from '../../utils/pocketbase';
import './SyncButton.css';

const words = [
  'happy', 'quick', 'lazy', 'brave', 'clever', 'wise', 'wild', 'calm', 'bold', 'gentle',
  'fierce', 'shy', 'proud', 'sleepy', 'loud', 'quiet', 'mighty', 'swift', 'strong', 'agile',
  'fox', 'dog', 'cat', 'bird', 'lion', 'tree', 'rock', 'star', 'moon', 'sun',
  'river', 'cloud', 'ocean', 'mountain', 'forest', 'desert', 'island', 'valley', 'lake', 'hill',
  'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'white',
  'black', 'cyan', 'magenta', 'gold', 'silver', 'bronze', 'teal', 'indigo', 'violet', 'crimson',
  'wolf', 'bear', 'tiger', 'eagle', 'snake', 'dolphin', 'elephant', 'penguin', 'panda', 'koala',
  'lion', 'zebra', 'giraffe', 'rhino', 'kangaroo', 'cheetah', 'gorilla', 'hippo', 'jaguar', 'owl'
];

export const generateId = () => {
  const randomWords = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  };
  return randomWords().join('-');
};

interface SyncButtonProps {
  data: {
    selectedCourseIds: number[];
    customEvents: any[];
    showBachelorCourses: boolean;
  };
  onSync: (data: any) => void;
}

export const SyncButton = ({ data, onSync }: SyncButtonProps) => {
  const [syncId, setSyncId] = useState(localStorage.getItem('sync_id') || '');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (syncId) {
      onSync(data);
    }
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const id = syncId || generateId();
      await syncData(id, data);
      setSyncId(id);
      localStorage.setItem('sync_id', id);
      alert(`Deine sync ID ist: ${id}`);
    } catch (err: any) {
      alert('Sync fehlgeschlagen');
    }
    setIsSyncing(false);
  };

  const handleLoad = async () => {
    const id = prompt('Sync ID eingeben:', syncId);
    if (!id) return;
    
    setIsSyncing(true);
    try {
      const data = await getData(id);
      onSync(data);
      setSyncId(id);
      localStorage.setItem('sync_id', id);
    } catch (err: any) {
      alert('Laden fehlgeschlagen');
    }
    setIsSyncing(false);
  };

  return (
    <div className="sync-container">
      <button 
        onClick={handleSync}
        disabled={isSyncing}
        className="sync-button"
      >
        {isSyncing ? 'Sync...' : 'In Cloud speichern'}
      </button>
      <button 
        onClick={handleLoad}
        disabled={isSyncing}
        className="sync-button"
      >
        Aus Cloud laden
      </button>
    </div>
  );
};