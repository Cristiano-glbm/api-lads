import { ProfessionalProfileScreen } from '@/components/profissionais/ProfessionalProfileScreen';
import { useRouter } from 'expo-router';

export default function PerfilProfissionalRoute() {
  const router = useRouter();
  return <ProfessionalProfileScreen onBackPress={() => router.back()} />;
}
