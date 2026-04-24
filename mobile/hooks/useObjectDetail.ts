import { useLocalSearchParams } from 'expo-router';
import { useObjectsStore } from '../store/useObjectsStore';

export function useObjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const object = useObjectsStore((s) => s.getById(String(id)));
  return { id: String(id), object };
}
