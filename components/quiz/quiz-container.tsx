'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Question, 
  stages, 
  mainQuestions, 
  b2bQuestions, 
  professionalTypes, 
  profileDefinitions, 
  calculateProfile, 
  deriveMotivations, 
  deriveSpaces, 
  buildAnswerLabels, 
  QuizAnswers, 
  QuizRecord, 
  DRAFT_STORAGE_KEY, 
  RECORDS_STORAGE_KEY, 
  APP_VERSION,
  SUBMISSION_ENDPOINT
} from '@/lib/quiz-data';
import { WelcomeView } from './welcome-view';
import { QuestionView } from './question-view';
import { ResultView } from './result-view';
import { AdminView } from './admin-view';

type ScreenMode = 'welcome' | 'quiz' | 'result' | 'admin';

export function QuizContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [screen, setScreen] = useState<ScreenMode>('welcome');
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [startedAt, setStartedAt] = useState<string>('');
  const [currentRecordId, setCurrentRecordId] = useState<string>('');
  const [hasDraft, setHasDraft] = useState(false);
  const [records, setRecords] = useState<QuizRecord[]>([]);

  // Load draft & records on mount
  useEffect(() => {
    try {
      const draftRaw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (draftRaw) {
        const draft = JSON.parse(draftRaw);
        if (draft && typeof draft === 'object' && draft.answers) {
          setHasDraft(true);
        }
      }

      const recordsRaw = localStorage.getItem(RECORDS_STORAGE_KEY);
      if (recordsRaw) {
        const parsed = JSON.parse(recordsRaw);
        if (Array.isArray(parsed)) {
          setRecords(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }

    if (searchParams.get('admin') === 'true') {
      setScreen('admin');
    }
  }, [searchParams]);

  // Compute active question list based on respondent profile type
  const activeQuestions = useMemo<Question[]>(() => {
    const isProfessional = answers.q19_profile_type && professionalTypes.has(answers.q19_profile_type);
    if (isProfessional) {
      return [...mainQuestions, ...b2bQuestions];
    }
    return mainQuestions;
  }, [answers.q19_profile_type]);

  const currentQuestion = activeQuestions[currentIndex] || activeQuestions[0];
  const currentStage = stages[currentQuestion?.stage] || stages.context;

  // Save draft helper
  const saveDraft = useCallback((updatedAnswers: QuizAnswers, index: number, startTime: string) => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
        answers: updatedAnswers,
        currentIndex: index,
        startedAt: startTime,
        updatedAt: new Date().toISOString()
      }));
      setHasDraft(true);
    } catch {
      // Ignore storage quota
    }
  }, []);

  const handleStart = () => {
    const start = new Date().toISOString();
    setStartedAt(start);
    setCurrentIndex(0);
    setAnswers({});
    setErrorMessage('');
    setScreen('quiz');
    saveDraft({}, 0, start);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResume = () => {
    try {
      const draftRaw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (draftRaw) {
        const draft = JSON.parse(draftRaw);
        setAnswers(draft.answers || {});
        setCurrentIndex(draft.currentIndex || 0);
        setStartedAt(draft.startedAt || new Date().toISOString());
        setScreen('quiz');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      handleStart();
    }
  };

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setHasDraft(false);
    setAnswers({});
    setCurrentIndex(0);
  };

  const handleAnswerChange = (val: any) => {
    setErrorMessage('');
    const updated = { ...answers, [currentQuestion.id]: val };
    setAnswers(updated);
    saveDraft(updated, currentIndex, startedAt || new Date().toISOString());
  };

  // Validation logic
  const validateCurrentQuestion = (): boolean => {
    if (!currentQuestion.required) return true;
    const ans = answers[currentQuestion.id];

    if (currentQuestion.type === 'multi') {
      if (!Array.isArray(ans) || ans.length === 0) {
        setErrorMessage('Por favor selecciona al menos una opción para continuar.');
        return false;
      }
    } else if (['single', 'scale'].includes(currentQuestion.type)) {
      if (!ans) {
        setErrorMessage('Por favor selecciona una opción para continuar.');
        return false;
      }
    } else if (currentQuestion.type === 'matrix') {
      const rows = currentQuestion.rows || [];
      const count = ans && typeof ans === 'object' ? Object.keys(ans).length : 0;
      if (count !== rows.length) {
        setErrorMessage('Por favor responde todas las afirmaciones antes de continuar.');
        return false;
      }
    } else if (currentQuestion.type === 'demographics') {
      if (!ans || !ans.city || !ans.age) {
        setErrorMessage('Por favor completa la ciudad y el rango de edad para continuar.');
        return false;
      }
    }

    setErrorMessage('');
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentQuestion()) return;

    if (currentIndex < activeQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      saveDraft(answers, nextIdx, startedAt);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete quiz!
      completeQuiz();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setErrorMessage('');
      saveDraft(answers, prevIdx, startedAt);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ── Sanity persistence helper ────────────────────────────
  const submitToSanity = useCallback(
    async (record: QuizRecord, contactData?: any) => {
      try {
        await fetch('/api/quiz-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recordId: record.id,
            startedAt: record.startedAt,
            completedAt: record.completedAt,
            route: record.route,
            profileKey: record.profileKey,
            profileName: record.profileName,
            profileScores: record.profileScores,
            answers: record.answers,
            contact: contactData || null,
          }),
        });
      } catch {
        // Fail silently – local storage is the primary source of truth
      }
    },
    []
  );

  const completeQuiz = () => {
    const result = calculateProfile(answers);
    const id = 'rec_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    setCurrentRecordId(id);

    const newRecord: QuizRecord = {
      id,
      appVersion: APP_VERSION,
      completedAt: new Date().toISOString(),
      startedAt: startedAt || new Date().toISOString(),
      route: professionalTypes.has(answers.q19_profile_type) ? 'B2B' : 'B2C',
      profileKey: result.key,
      profileName: profileDefinitions[result.key]?.name || 'Perfil Personalizado',
      profileScores: result.scores,
      answers,
      answerLabels: buildAnswerLabels(answers),
      contact: null
    };

    try {
      const updatedRecords = [...records, newRecord];
      localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(updatedRecords));
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setRecords(updatedRecords);
      setHasDraft(false);
    } catch {
      // Storage quota
    }

    // Save to Sanity immediately (without contact data)
    void submitToSanity(newRecord);

    // Optional webhook if configured
    if (SUBMISSION_ENDPOINT) {
      fetch(SUBMISSION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
        mode: 'cors'
      }).catch(() => {});
    }

    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveContact = (contactData: any) => {
    try {
      const updated = records.map((rec) => {
        if (rec.id === currentRecordId) {
          return {
            ...rec,
            contact: contactData,
            contactUpdatedAt: new Date().toISOString()
          };
        }
        return rec;
      });
      localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(updated));
      setRecords(updated);

      // Update Sanity document with contact info
      const updatedRecord = updated.find((r) => r.id === currentRecordId);
      if (updatedRecord) void submitToSanity(updatedRecord, contactData);
    } catch {
      // Ignore
    }
  };

  const handleDownloadJSON = () => {
    const currentRec = records.find((r) => r.id === currentRecordId) || {
      answers,
      profile: calculateProfile(answers),
      date: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(currentRec, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anbar-home-estilo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('¿Seguro que deseas reiniciar y borrar tus respuestas de esta sesión?')) {
      handleDiscardDraft();
      setScreen('welcome');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) {
      alert('No hay registros locales para exportar.');
      return;
    }

    const headers = ['ID', 'Fecha', 'Ruta', 'Perfil', 'Ciudad', 'Estilo', 'Email'];
    const rows = records.map((rec) => [
      rec.id,
      rec.completedAt,
      rec.route,
      `"${rec.profileName}"`,
      `"${rec.answers?.q20_demographics?.city || ''}"`,
      `"${rec.answers?.q4_style || ''}"`,
      `"${rec.contact?.email || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anbar-home-respuestas-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteRecords = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar permanentemente todas las respuestas locales guardadas en este navegador?')) {
      localStorage.removeItem(RECORDS_STORAGE_KEY);
      setRecords([]);
    }
  };

  // Profile data for results view
  const resultProfile = useMemo(() => {
    const res = calculateProfile(answers);
    const key = res.key || 'statement';
    const def = profileDefinitions[key] || profileDefinitions.statement;
    return {
      key,
      definition: def,
      motivations: deriveMotivations(answers, def),
      spaces: deriveSpaces(answers)
    };
  }, [answers]);

  return (
    <div className="w-full">
      {screen === 'welcome' && (
        <WelcomeView
          hasDraft={hasDraft}
          onStart={handleStart}
          onResume={handleResume}
          onDiscardDraft={handleDiscardDraft}
        />
      )}

      {screen === 'quiz' && (
        <QuestionView
          question={currentQuestion}
          stage={currentStage}
          currentIndex={currentIndex}
          totalQuestions={activeQuestions.length}
          currentAnswer={answers[currentQuestion.id]}
          errorMessage={errorMessage}
          onAnswerChange={handleAnswerChange}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {screen === 'result' && (
        <ResultView
          profileKey={resultProfile.key}
          profile={resultProfile.definition}
          answers={answers}
          motivations={resultProfile.motivations}
          spaces={resultProfile.spaces}
          onRestart={handleStart}
          onSaveContact={handleSaveContact}
          onDownloadJSON={handleDownloadJSON}
          onClearData={handleClearData}
        />
      )}

      {screen === 'admin' && (
        <AdminView
          records={records}
          onBackToQuiz={() => {
            setScreen('welcome');
            router.push('/quiz');
          }}
          onExportCSV={handleExportCSV}
          onDeleteRecords={handleDeleteRecords}
        />
      )}
    </div>
  );
}
