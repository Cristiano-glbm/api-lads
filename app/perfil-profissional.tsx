import { ProfessionalProfileScreen } from '@/components/profissionais/ProfessionalProfileScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { PROFESSIONAL_CARLOS } from '@/constants/professionalsMock';
import type { ProfessionalProfile } from '@/types/professional';
import * as professionalsService from '@/services/professionalsService';
import type { ApiProfessional } from '@/services/professionalsService';

function mapApiProfile(p: ApiProfessional): ProfessionalProfile {
  return {
    id: p.id,
    name: p.user?.name ?? 'Profissional',
    headline: p.headline ?? '',
    affiliation: p.affiliation ?? '',
    memberSince: p.memberSince ?? '',
    rating: p.rating ?? 0,
    votes: p.votes ?? 0,
    avatarUrl: p.user?.avatarUrl ?? '',
    expertise: p.expertise?.map((e) => e.name) ?? [],
    achievements: p.achievements?.map((a) => a.title) ?? [],
    contact: {
      website: p.website ?? '',
      linkedin: p.linkedin ?? '',
      github: p.github ?? '',
      email: p.user?.email ?? '',
    },
  };
}

export default function PerfilProfissionalRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [professional, setProfessional] = useState<ProfessionalProfile>(PROFESSIONAL_CARLOS);

  useEffect(() => {
    if (!id) return;
    professionalsService.getProfessional(id)
      .then((p) => setProfessional(mapApiProfile(p)))
      .catch(() => { /* keep default */ });
  }, [id]);

  return (
    <ProfessionalProfileScreen
      professional={professional}
      onBackPress={() => router.back()}
      onPressSolicitar={() => router.push('/solicitacao-servico')}
    />
  );
}
