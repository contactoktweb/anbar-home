'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { Question, Stage, QuestionOption } from '@/lib/quiz-data';

interface QuestionViewProps {
  question: Question;
  stage: Stage;
  currentIndex: number;
  totalQuestions: number;
  currentAnswer: any;
  errorMessage: string;
  onAnswerChange: (value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function QuestionView({
  question,
  stage,
  currentIndex,
  totalQuestions,
  currentAnswer,
  errorMessage,
  onAnswerChange,
  onNext,
  onBack
}: QuestionViewProps) {
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  const handleSingleSelect = (val: string) => {
    onAnswerChange(val);
  };

  const handleMultiSelect = (val: string, max?: number) => {
    const list = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
    const index = list.indexOf(val);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      if (max && list.length >= max) {
        // If reached max, replace the oldest selection
        list.shift();
      }
      list.push(val);
    }
    onAnswerChange(list);
  };

  const handleMatrixChange = (rowId: string, value: number) => {
    const matrix = typeof currentAnswer === 'object' && currentAnswer !== null ? { ...currentAnswer } : {};
    matrix[rowId] = value;
    onAnswerChange(matrix);
  };

  const handleDemographicsChange = (field: 'city' | 'age', value: string) => {
    const current = typeof currentAnswer === 'object' && currentAnswer !== null ? { ...currentAnswer } : {};
    current[field] = value;
    onAnswerChange(current);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in">
      {/* Top Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-600 mb-2">
          <span className="font-medium text-camel-dark tracking-wide uppercase">
            Etapa {stage.number} · {stage.title}
          </span>
          <span className="text-neutral-500 font-light">
            Pregunta {currentIndex + 1} de {totalQuestions} ({progressPercent}%)
          </span>
        </div>
        <div 
          className="h-1.5 w-full bg-neutral-200/80 rounded-full overflow-hidden" 
          role="progressbar" 
          aria-valuenow={progressPercent} 
          aria-valuemin={0} 
          aria-valuemax={100}
        >
          <div 
            className="h-full bg-camel-dark rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      {/* Main Grid: Aside Stage Info + Question Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Stage Aside Banner */}
        <aside className="lg:col-span-4 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs lg:sticky lg:top-24">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-camel/15 text-camel-dark font-serif font-bold text-sm flex items-center justify-center">
              0{stage.number}
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-medium">
              Etapa {stage.number}
            </span>
          </div>
          <h3 className="font-serif text-xl font-normal text-neutral-900 mb-2">
            {stage.title}
          </h3>
          <p className="text-xs text-neutral-600 font-light leading-relaxed mb-6">
            {stage.description}
          </p>
          <div className="pt-4 border-t border-neutral-100">
            <blockquote className="text-xs italic text-neutral-500 font-serif leading-relaxed">
              &ldquo;{stage.quote}&rdquo;
            </blockquote>
          </div>
        </aside>

        {/* Question Panel */}
        <section className="lg:col-span-8 bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          {/* Question Kicker & Title */}
          <p className="text-[11px] uppercase tracking-[0.2em] text-camel-dark font-medium mb-2">
            Pregunta {question.number}
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal leading-snug mb-3">
            {question.title}
          </h2>
          {question.help && (
            <p className="text-xs sm:text-sm text-neutral-500 font-light mb-6">
              {question.help}
            </p>
          )}

          {/* Form Control per Question Type */}
          <div className="mt-6 mb-8">
            {/* Visual Options (Cards with image) */}
            {question.visual && question.options && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {question.options.map((opt) => {
                  const isSelected = question.type === 'multi'
                    ? Array.isArray(currentAnswer) && currentAnswer.includes(opt.value)
                    : currentAnswer === opt.value;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        if (question.type === 'multi') {
                          handleMultiSelect(opt.value, question.max);
                        } else {
                          handleSingleSelect(opt.value);
                        }
                      }}
                      className={`group relative text-left rounded-xl overflow-hidden border transition-all duration-300 flex flex-col ${
                        isSelected
                          ? 'border-camel-dark ring-2 ring-camel/50 shadow-md scale-[1.01]'
                          : 'border-neutral-200/80 hover:border-neutral-400/80 bg-neutral-50/50'
                      }`}
                    >
                      {/* Image container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                        {opt.image ? (
                          <Image
                            src={opt.image}
                            alt={opt.visualLabel || opt.label}
                            fill
                            sizes="(max-width: 640px) 50vw, 250px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-xs text-neutral-400">
                            {opt.label}
                          </div>
                        )}
                        {/* Selected Checkmark Badge */}
                        <div
                          className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isSelected
                              ? 'bg-camel-dark text-white opacity-100 scale-100 shadow-sm'
                              : 'bg-white/70 text-neutral-400 opacity-0 group-hover:opacity-60 scale-75'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      </div>

                      {/* Label and description */}
                      <div className="p-3 bg-white flex-1 flex flex-col justify-center">
                        <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-camel-dark' : 'text-neutral-800'}`}>
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className="text-[11px] text-neutral-500 font-light mt-0.5 line-clamp-2">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Standard Single Choice (Non-visual) */}
            {!question.visual && question.type === 'single' && question.options && (
              <div className="space-y-2.5">
                {question.options.map((opt) => {
                  const isSelected = currentAnswer === opt.value;
                  return (
                    <label
                      key={opt.value}
                      onClick={() => handleSingleSelect(opt.value)}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-camel-dark bg-camel/5 ring-1 ring-camel/40 shadow-xs'
                          : 'border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50/50 bg-white'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200 ${
                          isSelected ? 'border-camel-dark bg-camel-dark' : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1 text-left">
                        <span className={`text-sm ${isSelected ? 'font-medium text-neutral-900' : 'text-neutral-700 font-light'}`}>
                          {opt.label}
                        </span>
                        {opt.description && (
                          <p className="text-xs text-neutral-500 font-light mt-1">
                            {opt.description}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Standard Multi Choice (Non-visual) */}
            {!question.visual && question.type === 'multi' && question.options && (
              <div className="space-y-2.5">
                {question.options.map((opt) => {
                  const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      onClick={() => handleMultiSelect(opt.value, question.max)}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-camel-dark bg-camel/5 ring-1 ring-camel/40 shadow-xs'
                          : 'border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50/50 bg-white'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200 ${
                          isSelected ? 'border-camel-dark bg-camel-dark text-white' : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1 text-left">
                        <span className={`text-sm ${isSelected ? 'font-medium text-neutral-900' : 'text-neutral-700 font-light'}`}>
                          {opt.label}
                        </span>
                        {opt.description && (
                          <p className="text-xs text-neutral-500 font-light mt-1">
                            {opt.description}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Scale 1-5 Control */}
            {question.type === 'scale' && question.options && (
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {question.options.map((opt) => {
                    const isSelected = String(currentAnswer) === String(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSingleSelect(opt.value)}
                        className={`py-4 px-2 flex flex-col items-center justify-center rounded-xl border text-center transition-all duration-200 ${
                          isSelected
                            ? 'border-camel-dark bg-camel-dark text-white ring-2 ring-camel/40 shadow-sm scale-105'
                            : 'border-neutral-200/90 hover:border-neutral-400 bg-neutral-50/60 text-neutral-700'
                        }`}
                      >
                        <span className="text-lg sm:text-xl font-serif font-bold">
                          {opt.value}
                        </span>
                        <span className="text-[10px] sm:text-xs tracking-tight mt-1 line-clamp-1 font-light">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-400 font-light px-1">
                  <span>1: {question.options[0]?.label}</span>
                  <span>5: {question.options[question.options.length - 1]?.label}</span>
                </div>
              </div>
            )}

            {/* Matrix Control (Responsive: Table on Desktop, Cards on Mobile) */}
            {question.type === 'matrix' && question.rows && (
              <div className="space-y-4">
                {/* Desktop View: Clean Table */}
                <div className="hidden sm:block overflow-x-auto rounded-xl border border-neutral-200/80">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-neutral-500">
                        <th className="p-3.5 font-medium">Afirmación</th>
                        <th className="p-3.5 text-center font-medium w-14">1<br /><span className="text-[10px] font-light">En desacuerdo</span></th>
                        <th className="p-3.5 text-center font-medium w-14">2</th>
                        <th className="p-3.5 text-center font-medium w-14">3</th>
                        <th className="p-3.5 text-center font-medium w-14">4</th>
                        <th className="p-3.5 text-center font-medium w-14">5<br /><span className="text-[10px] font-light">De acuerdo</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {question.rows.map((row) => (
                        <tr key={row.id} className="hover:bg-neutral-50/40 transition-colors">
                          <td className="p-3.5 text-sm text-neutral-800 font-light">
                            {row.label}
                          </td>
                          {[1, 2, 3, 4, 5].map((val) => {
                            const isChecked = currentAnswer && currentAnswer[row.id] === val;
                            return (
                              <td key={val} className="p-3.5 text-center">
                                <label className="inline-flex items-center justify-center p-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`matrix_${row.id}`}
                                    value={val}
                                    checked={isChecked || false}
                                    onChange={() => handleMatrixChange(row.id, val)}
                                    className="w-4 h-4 text-camel-dark focus:ring-camel-dark cursor-pointer"
                                  />
                                </label>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View: Friendly Cards to Prevent Overflow */}
                <div className="sm:hidden space-y-4">
                  {question.rows.map((row) => {
                    const rowVal = currentAnswer ? currentAnswer[row.id] : undefined;
                    return (
                      <div key={row.id} className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/40">
                        <p className="text-xs font-medium text-neutral-900 mb-3 leading-relaxed">
                          {row.label}
                        </p>
                        <div className="grid grid-cols-5 gap-1.5">
                          {[1, 2, 3, 4, 5].map((val) => {
                            const isSelected = rowVal === val;
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleMatrixChange(row.id, val)}
                                className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                                  isSelected
                                    ? 'bg-camel-dark text-white border-camel-dark shadow-xs'
                                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                                }`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-[10px] text-neutral-400 mt-2 px-1">
                          <span>1 = En desacuerdo</span>
                          <span>5 = De acuerdo</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Demographics Control */}
            {question.type === 'demographics' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cityInput" className="block text-xs uppercase tracking-wider text-neutral-600 font-medium mb-1.5">
                    Ciudad de residencia
                  </label>
                  <input
                    id="cityInput"
                    type="text"
                    maxLength={100}
                    value={currentAnswer?.city || ''}
                    onChange={(e) => handleDemographicsChange('city', e.target.value)}
                    placeholder="Ej. Bogotá, Medellín, Bucaramanga..."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-camel-dark focus:ring-1 focus:ring-camel-dark transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="ageSelect" className="block text-xs uppercase tracking-wider text-neutral-600 font-medium mb-1.5">
                    Rango de edad
                  </label>
                  <select
                    id="ageSelect"
                    value={currentAnswer?.age || ''}
                    onChange={(e) => handleDemographicsChange('age', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 bg-white focus:outline-none focus:border-camel-dark focus:ring-1 focus:ring-camel-dark transition-colors"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="18-24">18–24 años</option>
                    <option value="25-34">25–34 años</option>
                    <option value="35-44">35–44 años</option>
                    <option value="45-54">45–54 años</option>
                    <option value="55-64">55–64 años</option>
                    <option value="65+">65 años o más</option>
                  </select>
                </div>
              </div>
            )}

            {/* Textarea Control */}
            {question.type === 'textarea' && (
              <div>
                <textarea
                  rows={4}
                  maxLength={question.maxLength || 1200}
                  value={currentAnswer || ''}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder="Escribe tu reflexión o sugerencia aquí..."
                  className="w-full p-4 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-camel-dark focus:ring-1 focus:ring-camel-dark transition-colors resize-y"
                />
                <div className="text-right text-[11px] text-neutral-400 mt-1">
                  {(currentAnswer || '').length} / {question.maxLength || 1200} caracteres
                </div>
              </div>
            )}
          </div>

          {/* Validation Error Alert */}
          {errorMessage && (
            <div 
              role="alert" 
              className="mb-6 p-3.5 bg-red-50/80 border border-red-200/80 rounded-xl flex items-center gap-2.5 text-xs text-red-700 animate-shake"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-100 gap-4">
            <button
              type="button"
              onClick={onBack}
              disabled={isFirst}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isFirst
                  ? 'opacity-0 pointer-events-none'
                  : 'text-neutral-600 hover:text-neutral-950 border border-neutral-200 hover:border-neutral-400 bg-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-camel-dark hover:bg-neutral-950 text-white text-xs sm:text-sm uppercase tracking-wider font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <span>{isLast ? 'Ver mi resultado' : 'Continuar'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
