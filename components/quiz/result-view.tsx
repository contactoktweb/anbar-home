'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  RotateCcw, 
  Download, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { 
  ProfileDefinition, 
  QuizAnswers, 
  CATEGORY_LINKS, 
  getOptionLabel 
} from '@/lib/quiz-data';

interface ResultViewProps {
  profileKey: string;
  profile: ProfileDefinition;
  answers: QuizAnswers;
  motivations: string[];
  spaces: string[];
  initialContact?: any;
  onRestart: () => void;
  onSaveContact: (contactData: any) => void;
  onDownloadJSON: () => void;
  onClearData: () => void;
}

export function ResultView({
  profileKey,
  profile,
  answers,
  motivations,
  spaces,
  initialContact,
  onRestart,
  onSaveContact,
  onDownloadJSON,
  onClearData
}: ResultViewProps) {
  const [name, setName] = useState(initialContact?.name || '');
  const [email, setEmail] = useState(initialContact?.email || '');
  const [whatsapp, setWhatsapp] = useState(initialContact?.whatsapp || '');
  const [city, setCity] = useState(initialContact?.city || answers?.q20_demographics?.city || '');
  const [dataConsent, setDataConsent] = useState(initialContact?.dataConsent || false);
  const [marketingConsent, setMarketingConsent] = useState(initialContact?.marketingConsent || false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setContactError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!dataConsent) {
      setContactError('Debes autorizar el tratamiento de datos para registrar tu perfil.');
      return;
    }
    setContactError('');
    onSaveContact({
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      city: city.trim(),
      dataConsent,
      marketingConsent
    });
    setContactSubmitted(true);
  };

  const scrollToRecommendations = () => {
    const el = document.getElementById('recommendationsGrid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappConsultMessage = encodeURIComponent(
    `¡Hola Anbar Home! Realicé el Quiz de Estilo y mi perfil resultó ser "${profile.name}". Me gustaría recibir asesoría personalizada para transformar mis espacios.`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-fade-in">
      {/* Hero Result Banner */}
      <div className="text-center bg-white border border-neutral-200/80 rounded-3xl p-8 sm:p-12 shadow-xs mb-10 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-camel/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-camel/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-camel-dark" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-camel-dark font-medium">
            Tu Recomendación de Estilo
          </span>
          <Sparkles className="w-4 h-4 text-camel-dark" />
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-neutral-900 font-normal leading-tight tracking-tight mb-5">
          {profile.name}
        </h2>

        <p className="text-neutral-600 font-light text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-6">
          {profile.description}
        </p>

        <p className="text-xs text-neutral-400 font-light max-w-md mx-auto mb-8">
          Este resultado es una recomendación de diseño basada en tus preferencias decorativas; no constituye un diagnóstico científico.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={scrollToRecommendations}
            className="px-6 py-3.5 bg-camel-dark hover:bg-neutral-950 text-white text-xs sm:text-sm uppercase tracking-wider font-medium rounded-xl shadow-xs transition-all duration-300"
          >
            Explorar recomendaciones
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-5 py-3.5 border border-neutral-300 hover:border-neutral-900 text-neutral-700 text-xs sm:text-sm font-medium rounded-xl transition-colors bg-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repetir el quiz</span>
          </button>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div id="recommendationsGrid" className="scroll-mt-24 space-y-8 mb-12">
        <div className="text-center mb-6">
          <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
            Curaduría personalizada para tu perfil
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1">
            Basado en tus elecciones de espacios, sensaciones y elementos favoritos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Motivaciones */}
          <article className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
            <h4 className="font-serif text-lg text-neutral-900 mb-3 font-normal">
              Principales motivaciones
            </h4>
            <div className="flex flex-wrap gap-2">
              {motivations.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-camel/10 text-camel-dark text-xs font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>

          {/* Espacios prioritarios */}
          <article className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
            <h4 className="font-serif text-lg text-neutral-900 mb-3 font-normal">
              Espacios para transformar
            </h4>
            <div className="flex flex-wrap gap-2">
              {spaces.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>

          {/* Comportamiento */}
          <article className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
            <h4 className="font-serif text-lg text-neutral-900 mb-3 font-normal">
              Estilo y visión de compra
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              {profile.behavior}
            </p>
          </article>

          {/* Categorías recomendadas con enlaces directos a la tienda */}
          <article className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
            <h4 className="font-serif text-lg text-neutral-900 mb-3 font-normal">
              Categorías sugeridas en Anbar
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.categories.map((cat, idx) => {
                const link = CATEGORY_LINKS[cat] || '/category/todos-los-productos';
                return (
                  <Link
                    key={idx}
                    href={link}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-camel-dark hover:bg-camel/5 text-neutral-800 hover:text-camel-dark text-xs font-medium transition-all group"
                  >
                    <span>{cat}</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-camel-dark transition-colors" />
                  </Link>
                );
              })}
            </div>
          </article>

          {/* Experiencia Anbar Sugerida (Full Width) */}
          <article className="md:col-span-2 bg-camel/5 border border-camel/30 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex-1">
              <span className="text-[11px] uppercase tracking-wider text-camel-dark font-medium block mb-1">
                Acompañamiento Exclusivo
              </span>
              <h4 className="font-serif text-xl text-neutral-900 mb-2 font-normal">
                Tu experiencia Anbar sugerida
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed max-w-xl">
                {profile.advisory}
              </p>
            </div>
            <a
              href={`https://wa.me/573176587000?text=${whatsappConsultMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-neutral-900 hover:bg-camel-dark text-white text-xs font-medium uppercase tracking-wider rounded-xl shadow-xs transition-colors shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Consultar por WhatsApp</span>
            </a>
          </article>
        </div>
      </div>

      {/* Summary of Answers */}
      <section className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-10">
        <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 font-normal mb-1">
          Una mirada a tus respuestas
        </h3>
        <p className="text-xs text-neutral-500 font-light mb-6">
          Algunos de los aspectos que orientaron tu perfil decorativo.
        </p>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm divide-y sm:divide-y-0 divide-neutral-100">
          <div className="py-2.5 sm:p-3 rounded-xl sm:bg-neutral-50/50">
            <dt className="text-neutral-400 font-light">Estilo seleccionado</dt>
            <dd className="text-neutral-800 font-medium mt-0.5">
              {getOptionLabel('q4_style', answers.q4_style) || 'No especificado'}
            </dd>
          </div>
          <div className="py-2.5 sm:p-3 rounded-xl sm:bg-neutral-50/50">
            <dt className="text-neutral-400 font-light">Pieza de mayor interés</dt>
            <dd className="text-neutral-800 font-medium mt-0.5">
              {getOptionLabel('q6_category', answers.q6_category) || 'No especificado'}
            </dd>
          </div>
          <div className="py-2.5 sm:p-3 rounded-xl sm:bg-neutral-50/50">
            <dt className="text-neutral-400 font-light">Momento proyectado de cambio</dt>
            <dd className="text-neutral-800 font-medium mt-0.5">
              {getOptionLabel('q3_timing', answers.q3_timing) || 'No especificado'}
            </dd>
          </div>
          <div className="py-2.5 sm:p-3 rounded-xl sm:bg-neutral-50/50">
            <dt className="text-neutral-400 font-light">Presupuesto habitual</dt>
            <dd className="text-neutral-800 font-medium mt-0.5">
              {getOptionLabel('q9_budget', answers.q9_budget) || 'No especificado'}
            </dd>
          </div>
          <div className="py-2.5 sm:p-3 rounded-xl sm:bg-neutral-50/50">
            <dt className="text-neutral-400 font-light">Canal de compra preferido</dt>
            <dd className="text-neutral-800 font-medium mt-0.5">
              {getOptionLabel('q13_purchase_channel', answers.q13_purchase_channel) || 'No especificado'}
            </dd>
          </div>
          <div className="py-2.5 sm:p-3 rounded-xl sm:bg-neutral-50/50">
            <dt className="text-neutral-400 font-light">Relación previa con Anbar Home</dt>
            <dd className="text-neutral-800 font-medium mt-0.5">
              {getOptionLabel('q16_relationship', answers.q16_relationship) || 'No especificado'}
            </dd>
          </div>
        </dl>
      </section>

      {/* Optional Lead Capture Form */}
      <section className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-10">
        <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 font-normal mb-1">
          Recibe tu perfil completo y una selección personalizada
        </h3>
        <p className="text-xs text-neutral-500 font-light mb-6">
          Tu resultado básico ya está disponible arriba. Compartir tus datos es totalmente opcional para recibir asesoría directa.
        </p>

        {contactSubmitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>¡Gracias! Tus datos han sido guardados exitosamente. Nos pondremos en contacto contigo con tu curaduría.</span>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 font-medium mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-camel-dark focus:ring-1 focus:ring-camel-dark"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 font-medium mb-1.5">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-camel-dark focus:ring-1 focus:ring-camel-dark"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 font-medium mb-1.5">
                  WhatsApp <span className="text-neutral-400 font-light lowercase">(opcional)</span>
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+57 300 000 0000"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-camel-dark focus:ring-1 focus:ring-camel-dark"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 font-medium mb-1.5">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej. Bogotá"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-camel-dark focus:ring-1 focus:ring-camel-dark"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-700">
                <input
                  type="checkbox"
                  checked={dataConsent}
                  onChange={(e) => setDataConsent(e.target.checked)}
                  className="w-4 h-4 rounded text-camel-dark focus:ring-camel-dark mt-0.5 cursor-pointer"
                />
                <span>Autorizo el tratamiento de mis datos para recibir el resultado de esta experiencia decorativa.</span>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-700">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="w-4 h-4 rounded text-camel-dark focus:ring-camel-dark mt-0.5 cursor-pointer"
                />
                <span>Deseo recibir novedades, inspiración y comunicaciones comerciales de Anbar Home.</span>
              </label>
            </div>

            {contactError && (
              <p className="text-xs text-red-600 mt-2">{contactError}</p>
            )}

            <button
              type="submit"
              className="mt-4 px-6 py-3.5 bg-camel-dark hover:bg-neutral-950 text-white text-xs uppercase tracking-wider font-medium rounded-xl shadow-xs transition-colors"
            >
              Guardar mis datos opcionales
            </button>
          </form>
        )}
      </section>

      {/* Data Management Actions */}
      <section className="p-6 bg-neutral-100/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <div>
          <p className="font-medium text-neutral-700">Privacidad y tus datos</p>
          <p className="text-neutral-500">Puedes conservar una copia de tus respuestas o borrar el progreso en este navegador.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onDownloadJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-300 hover:border-neutral-900 text-neutral-700 bg-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar JSON</span>
          </button>
          <button
            type="button"
            onClick={onClearData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Borrar datos</span>
          </button>
        </div>
      </section>
    </div>
  );
}
