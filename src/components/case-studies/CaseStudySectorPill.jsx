import React from 'react';

const CaseStudySectorPill = ({ sector, className = '', style }) => {
  const label = typeof sector === 'string' ? sector.trim() : '';
  if (!label) return null;

  return (
    <span
      data-case-study-sector={label}
      className={`inline-flex max-w-[calc(100vw-2.5rem)] items-center justify-center rounded-full px-5 py-2.5 text-center font-primary text-[11px] md:max-w-[720px] md:text-[13px] font-medium uppercase leading-tight tracking-[0.26em] md:tracking-[0.32em] ${className}`}
      style={style}
    >
      {label}
    </span>
  );
};

export default CaseStudySectorPill;
