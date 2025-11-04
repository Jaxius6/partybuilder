'use client';

/**
 * CreatePartyModal Component
 * Modal form for creating a new party
 */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

interface CreatePartyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePartyModal({ isOpen, onClose }: CreatePartyModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
    slogan: '',
    category: '',
    website: '',
    constitution_url: '',
    secretary_name: '',
    secretary_address: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.error || 'Failed to create party' });
        }
        setIsSubmitting(false);
        return;
      }

      // Success! Trigger confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#A855F7', '#EC4899', '#10B981', '#F59E0B'],
      });

      // Navigate to the new party page after a short delay
      setTimeout(() => {
        router.push(`/p/${data.party.slug}`);
        router.refresh();
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error creating party:', error);
      setErrors({ general: 'An unexpected error occurred' });
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Create New Party</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            {/* General error */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            {/* Party Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Party Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Max 4 words; not similar to existing; no 'royal' or 'independent'; avoid public-body names; Title-Case only.
              </p>
            </div>

            {/* Abbreviation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Abbreviation
              </label>
              <input
                type="text"
                value={formData.abbreviation}
                onChange={(e) => handleChange('abbreviation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={10}
              />
              {errors.abbreviation && <p className="mt-1 text-sm text-red-600">{errors.abbreviation}</p>}
            </div>

            {/* Slogan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slogan
              </label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => handleChange('slogan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Progressive">Progressive</option>
                <option value="Conservative">Conservative</option>
                <option value="Centrist">Centrist</option>
                <option value="Environmental">Environmental</option>
                <option value="Social">Social</option>
                <option value="Economic">Economic</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
              {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
            </div>

            {/* Constitution URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Constitution URL
              </label>
              <input
                type="url"
                value={formData.constitution_url}
                onChange={(e) => handleChange('constitution_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/constitution.pdf"
              />
              {errors.constitution_url && <p className="mt-1 text-sm text-red-600">{errors.constitution_url}</p>}
            </div>

            {/* Secretary Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secretary Name
              </label>
              <input
                type="text"
                value={formData.secretary_name}
                onChange={(e) => handleChange('secretary_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Secretary Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secretary Address
              </label>
              <textarea
                value={formData.secretary_address}
                onChange={(e) => handleChange('secretary_address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* WAEC Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>WAEC tip:</strong> After submission, WAEC publishes a Gazette notice and opens a 1-month objection window before decision.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Party'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
