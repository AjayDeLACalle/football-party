import { useEffect, useRef, useState } from 'react';
import { parseProfiles, PlayerProfile } from './profiles';
import { readProfiles, writeProfiles } from './profileStorage';

export function useProfiles() {
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [ready, setReady] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const writes = useRef(Promise.resolve());
  const canWrite = useRef(false);
  useEffect(() => {
    let active = true;
    readProfiles().then(raw => {
      if (active) { setProfiles(parseProfiles(raw)); canWrite.current = true; }
    }).catch(() => { if (active) setStorageUnavailable(true); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!ready || !canWrite.current) return;
    // Serialize writes so a slower older save cannot replace the latest team.
    const value = JSON.stringify(profiles);
    writes.current = writes.current.then(() => writeProfiles(value)).catch(() => setStorageUnavailable(true));
  }, [profiles, ready]);
  return { profiles, setProfiles, ready, storageUnavailable };
}
