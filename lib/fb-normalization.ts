import crypto from 'crypto';

/**
 * Aplica hash SHA-256 a un string según los requisitos estrictos de Meta CAPI
 */
export const hashValue = (val: string): string => {
  if (!val) return '';
  return crypto.createHash('sha256').update(val.trim()).digest('hex');
};

/**
 * Normaliza y hashea un correo electrónico (lowercase, sin espacios)
 */
export const normalizeEmail = (email?: string | null): string | null => {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  return clean ? hashValue(clean) : null;
};

/**
 * Normaliza y hashea un número de teléfono.
 * Meta exige: solo dígitos, con código de país (ej. Colombia: 57), sin ceros a la izquierda ni símbolos.
 */
export const normalizePhone = (phone?: string | null): string | null => {
  if (!phone) return null;
  // Extraer solo dígitos numéricos
  let digits = phone.replace(/\D/g, '');
  if (!digits) return null;

  // Quitar ceros a la izquierda
  digits = digits.replace(/^0+/, '');

  // Formato Colombia (+57):
  // Si tiene 10 dígitos (ej. 3101234567 o 6011234567), anteponer 57 -> 573101234567
  if (digits.length === 10) {
    digits = '57' + digits;
  } else if (digits.length === 12 && digits.startsWith('57')) {
    // Ya tiene código de país correcto
  } else if (digits.length < 10) {
    // Número incompleto o local, anteponer 57 si aplica
    digits = '57' + digits;
  }

  return hashValue(digits);
};

/**
 * Normaliza y hashea nombres y apellidos (lowercase, sin acentos/tildes, sin signos de puntuación)
 */
export const normalizeName = (name?: string | null): string | null => {
  if (!name) return null;
  const clean = name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
    .replace(/[^a-z\s]/g, '') // Solo letras
    .replace(/\s+/g, ' ');
  return clean ? hashValue(clean) : null;
};

/**
 * Normaliza y hashea la ciudad (lowercase, sin tildes ni caracteres extraños)
 * Ej: "Bogotá D.C." -> "bogotadc" o "bogota"
 */
export const normalizeCity = (city?: string | null): string | null => {
  if (!city) return null;
  const clean = city
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
  return clean ? hashValue(clean) : null;
};

/**
 * Normaliza y hashea el departamento / estado
 */
export const normalizeState = (state?: string | null): string | null => {
  if (!state) return null;
  const clean = state
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
  return clean ? hashValue(clean) : null;
};

/**
 * Normaliza y hashea el código de país ISO 2 letras en minúsculas (ej. 'co')
 */
export const normalizeCountry = (country?: string | null): string => {
  if (!country) return hashValue('co');
  let clean = country.trim().toLowerCase();
  if (clean === 'colombia' || clean === 'co') {
    clean = 'co';
  } else if (clean.length > 2) {
    clean = clean.slice(0, 2);
  }
  return hashValue(clean);
};
