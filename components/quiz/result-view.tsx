'use client';

import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Heart, Mail, ArrowRight } from 'lucide-react';
import { ProfileDefinition, QuizAnswers } from '@/lib/quiz-data';

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
  onRestart,
}: ResultViewProps) {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailError('Por favor ingresa un correo válido.');
      return;
    }
    // El contacto ya se guarda en Sanity automáticamente desde quiz-container
    setEmailSent(true);
    setEmailError('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 animate-fade-in text-center">

      {/* Ícono de éxito */}
      <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-camel/10 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-camel-dark" />
      </div>

      {/* Eyebrow */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <span className="h-px w-8 bg-camel/40" />
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-camel-dark font-medium">
          Encuesta completada
        </span>
        <span className="h-px w-8 bg-camel/40" />
      </div>

      {/* Título */}
      <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-900 mb-5 leading-tight tracking-tight">
        ¡Muchas gracias por tu participación!
      </h1>

      {/* Mensaje principal */}
      <div className="bg-white border border-neutral-200/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm text-left space-y-4">
        <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
          Tu tiempo y opinión son muy valiosos para nosotros. Las respuestas que has compartido contribuirán directamente a la investigación académica sobre el comportamiento de compra de productos decorativos en Colombia.
        </p>
        <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
          Los resultados de este estudio forman parte de un <strong className="text-neutral-900">Trabajo Final de Máster</strong> del programa de Dirección de Marketing y Ventas de la Universidad Internacional de Valencia (VIU), y serán tratados con absoluta <strong className="text-neutral-900">confidencialidad y anonimato</strong>.
        </p>
        <div className="flex items-center gap-2 pt-2 text-camel-dark">
          <Heart className="w-4 h-4 shrink-0" />
          <p className="text-xs font-medium">
            Tu colaboración hace posible esta investigación.
          </p>
        </div>
      </div>

      {/* Formulario opcional de correo */}
      {!emailSent ? (
        <div className="bg-neutral-50 border border-neutral-200/70 rounded-2xl p-6 sm:p-8 mb-8 text-left">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-camel/10 flex items-center justify-center shrink-0 mt-0.5 text-camel-dark">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 mb-0.5">
                ¿Deseas recibir los resultados del estudio?
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Opcional. Déjanos tu correo y te enviaremos un resumen de los principales hallazgos cuando estén disponibles.
              </p>
            </div>
          </div>
          <form onSubmit={handleEmailSubmit} className="flex gap-2 flex-col sm:flex-row">
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-neutral-300/80 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1.5 focus:ring-camel focus:border-camel transition-all"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-camel-dark hover:bg-neutral-900 text-white text-xs font-medium uppercase tracking-wider rounded-lg transition-colors duration-200 shrink-0"
            >
              Enviar
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
          {emailError && (
            <p className="mt-2 text-xs text-red-600">{emailError}</p>
          )}
          <p className="mt-2 text-[10.5px] text-neutral-400 leading-relaxed">
            Tu correo solo se usará para enviarte los resultados del estudio y no con fines comerciales.
          </p>
        </div>
      ) : (
        <div className="bg-camel/5 border border-camel/25 rounded-2xl p-6 mb-8 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-camel-dark shrink-0" />
          <p className="text-sm text-neutral-700">
            ¡Gracias! Te notificaremos a <strong>{email}</strong> cuando los resultados estén disponibles.
          </p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-camel-dark hover:bg-neutral-950 text-white font-medium text-xs uppercase tracking-[0.18em] rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        >
          Ir a la tienda
        </a>
        <button
          onClick={onRestart}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 hover:border-neutral-400 text-neutral-700 hover:text-neutral-900 font-medium text-xs uppercase tracking-[0.18em] rounded-xl transition-all duration-300"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Responder de nuevo
        </button>
      </div>

    </div>
  );
}
