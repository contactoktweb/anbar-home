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
      q1Intent: answers.q1_intent || null,
      q2Spaces: Array.isArray(answers.q2_spaces) ? answers.q2_spaces : null,
      q3Timing: answers.q3_timing || null,
      q4Style: answers.q4_style || null,
      q5Feelings: Array.isArray(answers.q5_feelings) ? answers.q5_feelings : null,
      q6Category: answers.q6_category || null,
      q7Attributes: Array.isArray(answers.q7_attributes) ? answers.q7_attributes : null,
      q8Frequency: answers.q8_frequency || null,
      q9Budget: answers.q9_budget || null,
      q10Motivations: Array.isArray(answers.q10_motivations) ? answers.q10_motivations : null,
      q11Barrier: answers.q11_barrier || null,
      q12Discovery: Array.isArray(answers.q12_discovery) ? answers.q12_discovery : null,
      q13PurchaseChannel: answers.q13_purchase_channel || null,
      q14Help: answers.q14_help || null,
      q15AdvisoryInterest: answers.q15_advisory_interest ? String(answers.q15_advisory_interest) : null,
      q16Relationship: answers.q16_relationship || null,
      q17Association: answers.q17_association || null,
      q19ProfileType: answers.q19_profile_type || null,
      q20DemographicsCity: answers.q20_demographics?.city || null,
      q20DemographicsAge: answers.q20_demographics?.age || null,
      q21Open: answers.q21_open || null,

      // B2B answers
      b2bProjects: Array.isArray(answers.b2b1_projects) ? answers.b2b1_projects : null,
      b2bPurchase: answers.b2b2_purchase || null,
      b2bBenefits: Array.isArray(answers.b2b3_benefits) ? answers.b2b3_benefits : null,
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
