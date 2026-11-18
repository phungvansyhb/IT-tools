'use client';

import React, { useEffect, useState } from 'react';
import { Check, Star } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import { useI18n } from '@/i18n/client';
import { COMMENT_MAX } from '@/lib/feedback';

interface StarRatingWidgetProps {
  toolId: string;
}

export function StarRatingWidget({ toolId }: StarRatingWidgetProps) {
  const { t } = useI18n();
  const { myRatings, ratingSummaries, hydrated, submitRating } = useFeedback();

  const existing = hydrated ? myRatings[toolId] : undefined;
  const summary = hydrated ? ratingSummaries[toolId] : undefined;

  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    queueMicrotask(() => {
      setSelectedRating(existing?.rating ?? 0);
      setComment(existing?.comment ?? '');
      setErrorMsg(null);
      setSavedNotice(false);
    });
  }, [hydrated, toolId, existing?.rating, existing?.comment]);

  const activeStars = hoveredRating > 0 ? hoveredRating : selectedRating;

  const handleStarKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, starValue: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(5, starValue + 1);
      setSelectedRating(next);
      setSavedNotice(false);
      setErrorMsg(null);
      const nextBtn = e.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
        `[data-star="${next}"]`
      );
      nextBtn?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const prev = Math.max(1, starValue - 1);
      setSelectedRating(prev);
      setSavedNotice(false);
      setErrorMsg(null);
      const prevBtn = e.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
        `[data-star="${prev}"]`
      );
      prevBtn?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSavedNotice(false);

    if (selectedRating < 1 || selectedRating > 5) {
      setErrorMsg(t('feedback.errors.invalid_rating'));
      return;
    }

    setSaving(true);
    try {
      const res = await submitRating(toolId, selectedRating, comment);
      if (!res.ok) {
        if (res.errorCode === 'invalid_rating') {
          setErrorMsg(t('feedback.errors.invalid_rating'));
        } else if (res.errorCode === 'comment_too_long') {
          setErrorMsg(t('feedback.errors.comment_too_long'));
        } else if (res.errorCode === 'invalid_tool') {
          setErrorMsg(t('feedback.errors.invalid_tool'));
        } else {
          setErrorMsg(t('feedback.errors.generic'));
        }
        return;
      }
      setSavedNotice(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 className="section-title">{t('feedback.rateToolTitle')}</h2>
          <p className="subtle-text" style={{ margin: '0.2rem 0 0' }}>
            {t('feedback.rateToolSubtitle')}
          </p>
        </div>
        {hydrated && summary && summary.ratingCount > 0 && (
          <span className="glass-pill">
            <Star size={12} fill="currentColor" style={{ color: 'var(--warning)' }} />
            <span>
              {t('feedback.ratingCountPill', {
                avg: summary.avgRating.toFixed(1),
                count: summary.ratingCount,
              })}
            </span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div
            role="radiogroup"
            aria-label={t('feedback.ratePrompt')}
            onMouseLeave={() => setHoveredRating(0)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
          >
            {[1, 2, 3, 4, 5].map((starValue) => {
              const isSelected = selectedRating === starValue;
              const isFilled = activeStars >= starValue;
              return (
                <button
                  key={starValue}
                  type="button"
                  role="radio"
                  data-star={starValue}
                  aria-checked={isSelected}
                  aria-label={t('feedback.rateAriaLabel', { stars: starValue })}
                  tabIndex={
                    selectedRating === starValue || (selectedRating === 0 && starValue === 1)
                      ? 0
                      : -1
                  }
                  className={`star-rating-btn ${isFilled ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredRating(starValue)}
                  onClick={() => {
                    setSelectedRating(starValue);
                    setSavedNotice(false);
                    setErrorMsg(null);
                  }}
                  onKeyDown={(e) => handleStarKeyDown(e, starValue)}
                >
                  <Star size={20} fill={isFilled ? 'currentColor' : 'none'} />
                </button>
              );
            })}
          </div>
          <span className="subtle-text" style={{ fontSize: '0.78rem' }}>
            {t('feedback.ratePrompt')}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', alignItems: 'center' }}>
          <input
            type="text"
            className="input-field"
            style={{ flex: '1 1 220px' }}
            maxLength={COMMENT_MAX}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setSavedNotice(false);
              setErrorMsg(null);
            }}
            placeholder={t('feedback.commentPlaceholder')}
            aria-label={t('feedback.commentPlaceholder')}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || !hydrated}
          >
            {existing ? t('feedback.updateRatingBtn') : t('feedback.saveRatingBtn')}
          </button>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="badge-danger"
            style={{
              padding: '0.45rem 0.7rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
            }}
          >
            {errorMsg}
          </div>
        )}

        {savedNotice && (
          <div
            role="status"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--accent)',
              fontSize: '0.82rem',
              fontWeight: 500,
            }}
          >
            <Check size={14} />
            <span>{t('feedback.ratingSaved')}</span>
          </div>
        )}
      </form>
    </div>
  );
}
