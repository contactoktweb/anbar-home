import { Metadata } from 'next';
import { Suspense } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { QuizContainer } from '@/components/quiz/quiz-container';

export const metadata: Metadata = {
  title: 'Descubre tu Perfil de Estilo Anbar | Anbar Home',
  description: 'Descubre tu Perfil de Estilo Anbar y recibe recomendaciones personalizadas para transformar tus espacios con la calidez y sofisticación de Anbar Home.',
  keywords: [
    'quiz de estilo',
    'perfil de estilo anbar',
    'decoración del hogar',
    'diseño de interiores',
    'anbar home',
    'lujo silencioso',
    'estilo decorativo'
  ],
  openGraph: {
    title: 'Descubre tu Perfil de Estilo Anbar | Anbar Home',
    description: 'Descubre tu Perfil de Estilo Anbar y recibe recomendaciones personalizadas para transformar tus espacios.',
    url: 'https://anbarhome.com/quiz',
    siteName: 'Anbar Home',
    images: [
      {
        url: '/quiz/contemporaneo.jpg',
        width: 800,
        height: 600,
        alt: 'Descubre tu Perfil de Estilo Anbar',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Descubre tu Perfil de Estilo Anbar | Anbar Home',
    description: 'Descubre tu Perfil de Estilo Anbar y recibe recomendaciones personalizadas para transformar tus espacios.',
    images: ['/quiz/contemporaneo.jpg'],
  },
};

export default function QuizPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <SiteHeader />

      <main className="flex-1 py-4 sm:py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 rounded-full border-2 border-camel-dark border-t-transparent animate-spin" />
          </div>
        }>
          <QuizContainer />
        </Suspense>
      </main>

      <WhatsAppButton />
      <SiteFooter />
    </div>
  );
}
