'use client';

import React from 'react';
import { ArrowRight, Clock, Shield, BookOpen, RefreshCw } from 'lucide-react';

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

      {/* Eyebrow institucional */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <span className="h-px w-8 bg-camel/40" />
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-camel-dark font-medium text-center">
          Máster en Dirección de Marketing y Ventas · VIU
        </span>
        <span className="h-px w-8 bg-camel/40" />
      </div>

      {/* Título principal */}
      <h1 className="text-3xl sm:text-4xl md:text-[2.6rem] text-center text-neutral-900 font-semibold leading-[1.2] tracking-tight mb-6">
        Encuesta Anbar Home
        <span className="block text-xl sm:text-2xl font-normal text-neutral-600 mt-2 tracking-normal">
          Comportamiento de compra de productos decorativos
        </span>
      </h1>

      {/* Texto de introducción */}
      <div className="bg-white border border-neutral-200/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm space-y-4 text-left">
        <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
          Estimado(a) participante:
        </p>
        <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
          Reciba un cordial saludo. Somos estudiantes del <strong className="text-neutral-900">Máster en Dirección de Marketing y Ventas</strong> de la Universidad Internacional de Valencia (VIU). La presente encuesta forma parte de un Trabajo Final de Máster cuyo objetivo es conocer el <strong className="text-neutral-900">comportamiento de compra</strong> de consumidores actuales y potenciales de productos decorativos de <strong className="text-neutral-900">Anbar Home</strong>, así como analizar los factores que influyen en su intención de compra, criterios de elección, hábitos de consumo y canales utilizados.
        </p>
        <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
          Agradecemos de antemano su tiempo y disposición.
        </p>

        {/* Badges informativos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="flex items-center gap-2.5 py-3 px-4 bg-neutral-50 border border-neutral-200/60 rounded-xl text-neutral-700">
            <Clock className="w-4 h-4 text-camel-dark shrink-0" />
            <span className="text-xs leading-snug">4–6 minutos aproximadamente</span>
          </div>
          <div className="flex items-center gap-2.5 py-3 px-4 bg-neutral-50 border border-neutral-200/60 rounded-xl text-neutral-700">
            <Shield className="w-4 h-4 text-camel-dark shrink-0" />
            <span className="text-xs leading-snug">Participación voluntaria y anónima</span>
          </div>
          <div className="flex items-center gap-2.5 py-3 px-4 bg-neutral-50 border border-neutral-200/60 rounded-xl text-neutral-700">
            <BookOpen className="w-4 h-4 text-camel-dark shrink-0" />
            <span className="text-xs leading-snug">Uso exclusivamente académico</span>
          </div>
        </div>

        {/* Nota de confidencialidad */}
        <p className="text-xs text-neutral-500 leading-relaxed pt-1 border-t border-neutral-100">
          La información proporcionada será tratada con <strong className="text-neutral-600">absoluta confidencialidad y anonimato</strong>, y será utilizada exclusivamente con fines académicos e investigativos.
        </p>
      </div>

      {/* Retomar borrador */}
      {hasDraft && (
        <div className="mb-6 p-5 sm:p-6 bg-camel/5 border border-camel/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-camel/15 flex items-center justify-center shrink-0 mt-0.5 text-camel-dark">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Encontramos respuestas previas</p>
              <p className="text-xs text-neutral-600 mt-0.5">
                Puedes retomar la encuesta exactamente donde la dejaste o comenzar desde cero.
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

      {/* Botón de inicio */}
      <div className="text-center">
        <button
          onClick={onStart}
          type="button"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-camel-dark hover:bg-neutral-950 text-white font-medium text-xs sm:text-sm uppercase tracking-[0.18em] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
        >
          <span>Comenzar encuesta</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        <p className="mt-4 text-xs text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
          Puedes cerrar la ventana en cualquier momento. Tu progreso quedará guardado automáticamente.
        </p>
      </div>

    </div>
  );
}
