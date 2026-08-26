'use client';

import React from 'react';
import { ArrowRight, Clock, Sparkles, RefreshCw, Compass } from 'lucide-react';

interface WelcomeViewProps {
  hasDraft: boolean;
  onStart: () => void;
  onResume: () => void;
  onDiscardDraft: () => void;
}

export function WelcomeView({
  hasDraft,
  onStart,
  onResume,
  onDiscardDraft
}: WelcomeViewProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 animate-fade-in">
      {/* Decorative Brand Eyebrow */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="h-px w-8 bg-camel/40" />
        <span className="text-[11px] uppercase tracking-[0.25em] text-camel-dark font-medium">
          Experiencia Personalizada Anbar Home
        </span>
        <span className="h-px w-8 bg-camel/40" />
      </div>

      {/* Main Title - Single H1 on page */}
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-center text-neutral-900 font-normal leading-[1.15] tracking-tight mb-6">
        Descubre el estilo que hace que tu espacio se sienta más tuyo
      </h1>

      {/* Lead Paragraph */}
      <p className="text-center text-neutral-600 font-light text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
        Cada espacio cuenta una historia. Responde unas breves preguntas sobre la forma en que vives, 
        compras y decoras. Al finalizar, descubrirás tu <span className="text-neutral-900 font-medium">Perfil de Estilo Anbar</span> y una 
        selección curada de piezas pensadas para ti.
      </p>

      {/* Resume Draft Card (if exists) */}
      {hasDraft && (
        <div className="mb-10 p-5 sm:p-6 bg-camel/5 border border-camel/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-all duration-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-camel/15 flex items-center justify-center shrink-0 mt-0.5 text-camel-dark">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Encontramos un recorrido previo</p>
              <p className="text-xs text-neutral-600 mt-0.5">
                Puedes retomar tus respuestas exactamente donde las dejaste o comenzar desde cero.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={onResume}
              type="button"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-camel-dark hover:bg-neutral-900 text-white text-xs font-medium uppercase tracking-wider rounded-lg transition-colors duration-200"
            >
              Continuar
            </button>
            <button
              onClick={onDiscardDraft}
              type="button"
              className="px-3 py-2.5 text-neutral-500 hover:text-neutral-900 text-xs font-medium transition-colors"
            >
              Reiniciar
            </button>
          </div>
        </div>
      )}

      {/* Experience Details Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <div className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white border border-neutral-200/80 rounded-xl shadow-xs text-neutral-700">
          <Clock className="w-4 h-4 text-camel-dark" />
          <span className="text-xs tracking-wide">4–6 min para hogares</span>
        </div>
        <div className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white border border-neutral-200/80 rounded-xl shadow-xs text-neutral-700">
          <Compass className="w-4 h-4 text-camel-dark" />
          <span className="text-xs tracking-wide">5–7 min para profesionales</span>
        </div>
        <div className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white border border-neutral-200/80 rounded-xl shadow-xs text-neutral-700">
          <Sparkles className="w-4 h-4 text-camel-dark" />
          <span className="text-xs tracking-wide">Curaduría personalizada</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center mb-8">
        <button
          onClick={onStart}
          type="button"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-camel-dark hover:bg-neutral-950 text-white font-medium text-xs sm:text-sm uppercase tracking-[0.18em] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
        >
          <span>Descubrir mi estilo</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Privacy Note */}
      <p className="text-center text-xs text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
        Tus respuestas serán tratadas de manera agregada y confidencial para comprender mejor las 
        preferencias decorativas. Compartir tus datos de contacto será totalmente opcional.
      </p>
    </div>
  );
}
