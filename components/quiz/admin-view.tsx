'use client';

import React from 'react';
import { ArrowLeft, Download, Trash2, Users, Briefcase, FileSpreadsheet } from 'lucide-react';
import { QuizRecord, profileDefinitions, getOptionLabel } from '@/lib/quiz-data';

interface AdminViewProps {
  records: QuizRecord[];
  onBackToQuiz: () => void;
  onExportCSV: () => void;
  onDeleteRecords: () => void;
}

export function AdminView({
  records,
  onBackToQuiz,
  onExportCSV,
  onDeleteRecords
}: AdminViewProps) {
  const b2bCount = records.filter((r) => r.route === 'B2B').length;
  const b2cCount = records.filter((r) => r.route === 'B2C').length;

  const profileCounts: Record<string, number> = Object.keys(profileDefinitions).reduce(
    (acc, k) => ({ ...acc, [k]: 0 }),
    {}
  );
  records.forEach((r) => {
    if (r.profileKey in profileCounts) {
      profileCounts[r.profileKey] += 1;
    }
  });

  const variables: [string, string][] = [
    ['q4_style', 'Estilo decorativo'],
    ['q6_category', 'Categoría de interés'],
    ['q9_budget', 'Presupuesto'],
    ['q13_purchase_channel', 'Canal de compra'],
    ['q17_association', 'Asociación con Anbar Home'],
    ['q19_profile_type', 'Tipo de participante']
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-camel-dark font-medium block mb-1">
            Gestión Local de Respuestas
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
            Panel de Estadísticas y Respuestas
          </h2>
          <p className="text-xs text-neutral-500 font-light mt-1 max-w-xl">
            Muestra las respuestas almacenadas localmente en este navegador. Puedes exportarlas a CSV o limpiarlas cuando lo requieras.
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToQuiz}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-medium bg-white transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al quiz</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-camel/15 text-camel-dark flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-neutral-900">{records.length}</div>
            <div className="text-xs text-neutral-500">Respuestas guardadas</div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-neutral-900">{b2bCount}</div>
            <div className="text-xs text-neutral-500">Ruta B2B (Profesionales)</div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-neutral-900">{b2cCount}</div>
            <div className="text-xs text-neutral-500">Ruta B2C (Hogares)</div>
          </div>
        </div>
      </div>

      {/* Profile Distribution */}
      <section className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
        <h3 className="font-serif text-xl text-neutral-900 font-normal mb-4">
          Distribución de Perfiles Asignados
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(profileDefinitions).map(([key, def]) => {
            const count = profileCounts[key] || 0;
            const pct = records.length > 0 ? Math.round((count / records.length) * 100) : 0;
            return (
              <div key={key} className="p-4 rounded-xl border border-neutral-150 bg-neutral-50/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-neutral-800 line-clamp-1">{def.name}</span>
                  <span className="text-xs font-bold text-camel-dark">{count}</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-camel-dark rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-right text-[10px] text-neutral-400 mt-1">{pct}%</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Response Breakdown Summary Table */}
      <section className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
        <h3 className="font-serif text-xl text-neutral-900 font-normal mb-4">
          Resumen de Frecuencia por Variable
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600">
                <th className="p-3 font-medium">Variable</th>
                <th className="p-3 font-medium">Respuesta más frecuente</th>
                <th className="p-3 font-medium text-center">Frecuencia</th>
                <th className="p-3 font-medium">Desglose top 3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {variables.map(([questionId, variableLabel]) => {
                const counts: Record<string, number> = {};
                records.forEach((record) => {
                  const raw = record.answers?.[questionId];
                  const values = Array.isArray(raw) ? raw : [raw];
                  values.filter(Boolean).forEach((val) => {
                    const label = getOptionLabel(questionId, val) || String(val);
                    counts[label] = (counts[label] || 0) + 1;
                  });
                });
                const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                const top = sorted[0] || ['Sin datos', 0];
                const top3 = sorted.slice(0, 3).map(([lbl, c]) => `${lbl} (${c})`).join(' · ') || '—';

                return (
                  <tr key={questionId} className="hover:bg-neutral-50/40">
                    <td className="p-3 font-medium text-neutral-800">{variableLabel}</td>
                    <td className="p-3 text-neutral-700">{top[0]}</td>
                    <td className="p-3 text-center font-bold text-neutral-900">{top[1]}</td>
                    <td className="p-3 text-neutral-500 font-light">{top3}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Records Table */}
      <section className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
        <h3 className="font-serif text-xl text-neutral-900 font-normal mb-4">
          Registros Recientes ({Math.min(records.length, 25)})
        </h3>
        {records.length === 0 ? (
          <p className="text-xs text-neutral-400 py-6 text-center">No hay registros almacenados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600">
                  <th className="p-3 font-medium">Fecha</th>
                  <th className="p-3 font-medium">Ruta</th>
                  <th className="p-3 font-medium">Perfil</th>
                  <th className="p-3 font-medium">Ciudad</th>
                  <th className="p-3 font-medium">Contacto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {records.slice().reverse().slice(0, 25).map((rec) => (
                  <tr key={rec.id} className="hover:bg-neutral-50/40">
                    <td className="p-3 text-neutral-500">
                      {new Date(rec.completedAt).toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        rec.route === 'B2B' ? 'bg-blue-100 text-blue-800' : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {rec.route}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-neutral-900">{rec.profileName}</td>
                    <td className="p-3 text-neutral-600">{rec.answers?.q20_demographics?.city || '—'}</td>
                    <td className="p-3 text-neutral-600">{rec.contact?.email || 'No compartido'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CSV & Delete Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-neutral-100/60 rounded-2xl">
        <button
          type="button"
          onClick={onExportCSV}
          className="inline-flex items-center gap-2 px-5 py-3 bg-camel-dark hover:bg-neutral-950 text-white text-xs uppercase tracking-wider font-medium rounded-xl shadow-xs transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Exportar registros en CSV</span>
        </button>

        <button
          type="button"
          onClick={onDeleteRecords}
          className="inline-flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 text-xs font-medium rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Eliminar registros locales</span>
        </button>
      </div>
    </div>
  );
}
