import { ServicesScreen } from '@/components/servicos/ServicesScreen';
import { useRouter } from 'expo-router';

export default function ServicosRoute() {
  const router = useRouter();
  return <ServicesScreen onPressSolicitar={() => router.push('/solicitacao-servico')} />;
}
