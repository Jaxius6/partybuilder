/**
 * WAEC validation rules for party names
 */

import { wordCount, isAllCaps, toTitleCase, levenshteinDistance } from './util';

// Forbidden words as per WAEC rules
export const denyWords = [
  'royal',
  'independent',
  // Basic slur placeholders - to be expanded
  'damn',
  'hell',
];

// Public bodies that cannot be used in party names
export const publicBodies = [
  'Western Australian Electoral Commission',
  'WAEC',
  'Parliament of Western Australia',
  'WA Parliament',
  'WA Police',
  'Department of',
  'City of',
  'Shire of',
  'Town of',
  'Government of',
  'Australian Electoral Commission',
  'AEC',
];

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  formattedName?: string;
}

/**
 * Validate party name according to WAEC rules
 */
export function validatePartyName(
  name: string,
  existingNames: string[]
): ValidationResult {
  const errors: string[] = [];

  // Trim and check if empty
  const trimmedName = name.trim();
  if (!trimmedName) {
    errors.push('Party name is required');
    return { ok: false, errors };
  }

  // Rule: No ALL-CAPS names
  if (isAllCaps(trimmedName)) {
    errors.push('Party name cannot be all uppercase');
  }

  // Rule: Maximum 4 words
  const words = wordCount(trimmedName);
  if (words > 4) {
    errors.push('Party name must be 4 words or less');
  }

  // Rule: Check for forbidden words
  const lowerName = trimmedName.toLowerCase();
  const foundDenyWords = denyWords.filter(word =>
    lowerName.includes(word.toLowerCase())
  );
  if (foundDenyWords.length > 0) {
    errors.push(`Party name cannot contain: ${foundDenyWords.join(', ')}`);
  }

  // Rule: Check for public body names (substring match)
  const foundPublicBodies = publicBodies.filter(body =>
    lowerName.includes(body.toLowerCase())
  );
  if (foundPublicBodies.length > 0) {
    errors.push('Party name cannot resemble a public body or government institution');
  }

  // Rule: Check similarity to existing parties (Levenshtein distance ≤ 2)
  const similarParties = existingNames.filter(existing => {
    const distance = levenshteinDistance(trimmedName, existing);
    return distance > 0 && distance <= 2;
  });
  if (similarParties.length > 0) {
    errors.push(`Party name too similar to existing: ${similarParties.join(', ')}`);
  }

  // Format name to Title Case
  const formattedName = toTitleCase(trimmedName);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, errors: [], formattedName };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate party data for creation
 */
export interface PartyInput {
  name: string;
  abbreviation?: string;
  slogan?: string;
  category?: string;
  website?: string;
  constitution_url?: string;
  secretary_name?: string;
  secretary_address?: string;
}

export interface PartyValidationResult {
  ok: boolean;
  errors: { [key: string]: string };
  data?: PartyInput & { formattedName: string };
}

export function validatePartyInput(
  input: PartyInput,
  existingNames: string[]
): PartyValidationResult {
  const errors: { [key: string]: string } = {};

  // Validate name
  const nameValidation = validatePartyName(input.name, existingNames);
  if (!nameValidation.ok) {
    errors.name = nameValidation.errors.join('; ');
  }

  // Validate abbreviation (optional, but if provided must be reasonable)
  if (input.abbreviation) {
    const abbr = input.abbreviation.trim();
    if (abbr.length > 10) {
      errors.abbreviation = 'Abbreviation must be 10 characters or less';
    }
  }

  // Validate website URL (optional)
  if (input.website) {
    try {
      new URL(input.website);
    } catch {
      errors.website = 'Invalid website URL';
    }
  }

  // Validate constitution URL (optional)
  if (input.constitution_url) {
    try {
      new URL(input.constitution_url);
    } catch {
      errors.constitution_url = 'Invalid constitution URL';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: {},
    data: {
      ...input,
      formattedName: nameValidation.formattedName!,
    },
  };
}

/**
 * Validate member join data
 */
export interface MemberInput {
  full_name: string;
  email: string;
  suburb?: string;
  dob?: string;
  is_wa_elector?: boolean;
}

export interface MemberValidationResult {
  ok: boolean;
  errors: { [key: string]: string };
}

export function validateMemberInput(input: MemberInput): MemberValidationResult {
  const errors: { [key: string]: string } = {};

  // Validate full name
  if (!input.full_name || !input.full_name.trim()) {
    errors.full_name = 'Full name is required';
  }

  // Validate email (required)
  if (!input.email || !input.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(input.email)) {
    errors.email = 'Invalid email format';
  }

  // Validate DOB format (optional, but if provided must be valid)
  if (input.dob) {
    const date = new Date(input.dob);
    if (isNaN(date.getTime())) {
      errors.dob = 'Invalid date format';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, errors: {} };
}
