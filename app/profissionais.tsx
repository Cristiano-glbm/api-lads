import { ProfessionalsScreen } from '@/components/profissionais/ProfessionalsScreen';
import { useRouter } from 'expo-router';

export default function ProfissionaisRoute() {
  const router = useRouter();
  return (
    <ProfessionalsScreen
      onPressContratar={(id) => {
        router.push({ pathname: '/perfil-profissional', params: { id } });
      }}
    />
  );
}
