import { getRouters } from '@/services/common/index';
export async function getInitialState() {
  const data = await getRouters();
  return data;
}
