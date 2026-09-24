import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/sanity/lib/adminClient'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      recordId,
      startedAt,
      completedAt,
      route,
      profileKey,
      profileName,
      profileScores,
      answers,
      contact,
    } = body

    if (!recordId || !profileKey || !answers) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: recordId, profileKey o answers.' },
        { status: 400 }
      )
    }

    // Build Sanity document – map flat JS keys to defined schema fields
    const doc: Record<string, any> = {
      _type: 'quizResponse',
      _id: `quiz-${recordId}`,
      recordId,
      completedAt: completedAt || new Date().toISOString(),
      startedAt: startedAt || null,
      route: route || 'B2C',

      // Profile
      profileKey,
      profileName: profileName || null,
      profileScores: profileScores
        ? {
            statement: profileScores.statement ?? 0,
            sophistication: profileScores.sophistication ?? 0,
            host: profileScores.host ?? 0,
            renovator: profileScores.renovator ?? 0,
            professional: profileScores.professional ?? 0,
          }
        : null,

      // Contact info (optional)
      contactName: contact?.name || null,
      contactEmail: contact?.email || null,
      contactWhatsapp: contact?.whatsapp || null,
      contactCity: contact?.city || null,
      dataConsent: contact?.dataConsent ?? false,
      marketingConsent: contact?.marketingConsent ?? false,

      // Quiz answers – key mapping
      q1_relacion: answers.q1_relacion || null,
      q2_probabilidad_compra: answers.q2_probabilidad_compra || null,
      q3_situaciones: Array.isArray(answers.q3_situaciones) ? answers.q3_situaciones : null,
      q4_barreras: Array.isArray(answers.q4_barreras) ? answers.q4_barreras : null,
      q5_asesoria_prob: answers.q5_asesoria_prob || null,
      q6_interes_propuesta: answers.q6_interes_propuesta || null,
      q7_espacios: Array.isArray(answers.q7_espacios) ? answers.q7_espacios : null,
      q8_categorias: answers.q8_categorias ? JSON.stringify(answers.q8_categorias) : null,
      q9_factores_eleccion: Array.isArray(answers.q9_factores_eleccion) ? answers.q9_factores_eleccion : null,
      q10_marca_ideal: Array.isArray(answers.q10_marca_ideal) ? answers.q10_marca_ideal : null,
      q11_inversion: answers.q11_inversion || null,
      q12_momentos_compra: Array.isArray(answers.q12_momentos_compra) ? answers.q12_momentos_compra : null,
      q13_forma_compra: answers.q13_forma_compra || null,
      q14_calidad_determinante: answers.q14_calidad_determinante || null,
      q15_actualizacion: answers.q15_actualizacion || null,
      q16_precio_decision: answers.q16_precio_decision || null,
      q17_diseno_exclusividad: answers.q17_diseno_exclusividad || null,
      q18_busqueda_info: Array.isArray(answers.q18_busqueda_info) ? answers.q18_busqueda_info : null,
      q19_modalidades_compra: answers.q19_modalidades_compra ? JSON.stringify(answers.q19_modalidades_compra) : null,
      q20_canal_asesoria: answers.q20_canal_asesoria || null,
      q21_ingresos: answers.q21_ingresos || null,
      q22_ciudad: answers.q22_ciudad || null,
      q23_edad: answers.q23_edad || null,
      q24_genero: answers.q24_genero || null,
    }

    // Remove null fields to keep Sanity docs clean
    const cleanDoc: Record<string, any> & { _type: string; _id: string } = Object.fromEntries(
      Object.entries(doc).filter(([, v]) => v !== null && v !== undefined)
    ) as Record<string, any> & { _type: string; _id: string }

    // createOrReplace: if doc with same _id exists, update it; otherwise create
    const result = await adminClient.createOrReplace(cleanDoc)

    return NextResponse.json({ ok: true, id: result._id }, { status: 200 })
  } catch (err: any) {
    console.error('[quiz-submit] Error saving to Sanity:', err)
    return NextResponse.json(
      { error: 'Error interno al guardar la respuesta.', detail: err?.message },
      { status: 500 }
    )
  }
}
