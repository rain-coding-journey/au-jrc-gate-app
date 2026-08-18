import { openDB } from 'idb';

const DB_NAME = 'AU_JRC_Security_DB';
const DB_VERSION = 1;

export const initOfflineDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('offline_scans')) {
        db.createObjectStore('offline_scans', { keyPath: 'offline_log_id' });
      }
    },
  });
};

export const saveScanOffline = async (scanPayload) => {
  const db = await initOfflineDB();
  const item = {
    ...scanPayload,
    offline_log_id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  await db.put('offline_scans', item);
  return item;
};

export const getOfflineScans = async () => {
  const db = await initOfflineDB();
  return db.getAll('offline_scans');
};

export const clearOfflineScans = async () => {
  const db = await initOfflineDB();
  return db.clear('offline_scans');
};