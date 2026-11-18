import { useState, useRef, useEffect } from 'react';
import { MapPin, Building, Home, ChevronDown, X } from 'lucide-react';
import { STATE_LIST, getDistricts, getCities } from '../../data/indiaData';

/* ── Generic searchable dropdown ─────────────────────────────────────────── */
function SearchDropdown({ id, label, icon: Icon, placeholder, options, value, onChange, error, disabled }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const ref               = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  function select(opt) {
    onChange(opt);
    setQuery('');
    setOpen(false);
  }

  function clear(e) {
    e.stopPropagation();
    onChange('');
    setQuery('');
  }

  const displayValue = open ? query : (value || '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', position: 'relative' }} ref={ref}>
      {label && (
        <label htmlFor={id} style={{ fontSize: '0.82rem', fontWeight: 600, color: '#102544' }}>
          {label}
        </label>
      )}

      {/* Input box */}
      <div
        style={{
          border: `1.5px solid ${error ? '#ef4444' : open ? '#07845F' : '#dce3ec'}`,
          borderRadius: '10px',
          background: disabled ? '#f8fafc' : '#fff',
          boxShadow: open ? '0 0 0 3px rgba(7,132,95,0.12)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={() => { if (!disabled) { setOpen(v => !v); } }}
      >
        {Icon && (
          <div style={{ position: 'absolute', left: '0.85rem', color: disabled ? '#c0ccd8' : '#8fa0b4', pointerEvents: 'none', flexShrink: 0 }}>
            <Icon size={14} />
          </div>
        )}
        <input
          id={id}
          readOnly={!open}
          value={displayValue}
          placeholder={disabled ? 'Select state first' : placeholder}
          onChange={e => { setQuery(e.target.value); if (!open) setOpen(true); }}
          onClick={e => { e.stopPropagation(); if (!disabled) setOpen(true); }}
          style={{
            flex: 1,
            border: 'none', outline: 'none',
            padding: `0.68rem ${value && !disabled ? '3.8rem' : '2.2rem'} 0.68rem 2.4rem`,
            fontSize: '0.845rem',
            fontFamily: 'Inter, sans-serif',
            color: value && !open ? '#102544' : '#6b7b8e',
            background: 'transparent',
            cursor: disabled ? 'not-allowed' : 'pointer',
            width: '100%',
          }}
        />
        {/* Clear button when value selected */}
        {value && !disabled && !open && (
          <button
            type="button"
            onClick={clear}
            style={{ position: 'absolute', right: '2rem', background: 'none', border: 'none', cursor: 'pointer', color: '#8fa0b4', display: 'flex', alignItems: 'center', padding: 0 }}
          >
            <X size={13} />
          </button>
        )}
        <div style={{
          position: 'absolute', right: '0.75rem',
          color: '#8fa0b4', pointerEvents: 'none',
          transform: `rotate(${open ? 180 : 0}deg)`,
          transition: 'transform 0.2s',
          display: 'flex', alignItems: 'center',
        }}>
          <ChevronDown size={15} />
        </div>
      </div>

      {/* Dropdown list */}
      {open && !disabled && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0, right: 0,
          zIndex: 200,
          background: '#fff',
          borderRadius: '10px',
          border: '1.5px solid #dce3ec',
          boxShadow: '0 8px 28px rgba(16,37,68,0.16)',
          maxHeight: 220,
          overflowY: 'auto',
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#8fa0b4', textAlign: 'center' }}>No results found</div>
          ) : (
            filtered.map(opt => (
              <div
                key={opt}
                onMouseDown={() => select(opt)}
                style={{
                  padding: '0.62rem 1rem',
                  fontSize: '0.845rem',
                  cursor: 'pointer',
                  color: opt === 'Other' ? '#07845F' : (opt === value ? '#07845F' : '#102544'),
                  fontWeight: opt === value || opt === 'Other' ? 600 : 400,
                  background: opt === value ? '#f0fdf4' : 'transparent',
                  borderBottom: opt === 'Other' ? 'none' : '1px solid #f4f6f8',
                  transition: 'background 0.12s',
                  ...(opt === 'Other' ? { borderTop: '1px solid #f0f2f5', marginTop: 2 } : {}),
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                onMouseLeave={e => e.currentTarget.style.background = opt === value ? '#f0fdf4' : 'transparent'}
              >
                {opt === 'Other' ? '+ Other (type manually)' : opt}
              </div>
            ))
          )}
        </div>
      )}

      {error && <span style={{ fontSize: '0.73rem', color: '#ef4444' }}>{error}</span>}
    </div>
  );
}

/* ── Text input for "Other" option ───────────────────────────────────────── */
function OtherInput({ placeholder, value, onChange, error }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
        style={{
          width: '100%',
          border: `1.5px solid ${error ? '#ef4444' : '#07845F'}`,
          borderRadius: '10px',
          padding: '0.68rem 0.9rem',
          fontSize: '0.845rem',
          fontFamily: 'Inter, sans-serif',
          outline: 'none',
          color: '#102544',
          background: '#f0fdf4',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: '0 0 0 3px rgba(7,132,95,0.10)',
        }}
      />
      {error && <span style={{ fontSize: '0.73rem', color: '#ef4444' }}>{error}</span>}
    </div>
  );
}

/* ── Main cascading component ─────────────────────────────────────────────── */
/**
 * Props:
 *   state, district, city, ward — current values
 *   onStateChange, onDistrictChange, onCityChange, onWardChange — setters
 *   errors — { state, district, city, ward }
 */
export default function LocationCascade({
  state, district, city, ward,
  onStateChange, onDistrictChange, onCityChange, onWardChange,
  errors = {},
}) {
  // "Other" custom text values
  const [otherDistrict, setOtherDistrict] = useState('');
  const [otherCity, setOtherCity]         = useState('');

  const districts = state ? getDistricts(state) : [];
  const cities    = (state && district && district !== 'Other') ? getCities(state, district) : [];

  function handleStateChange(val) {
    onStateChange(val);
    onDistrictChange('');
    onCityChange('');
    setOtherDistrict('');
    setOtherCity('');
  }

  function handleDistrictChange(val) {
    onDistrictChange(val);
    onCityChange('');
    setOtherDistrict('');
    setOtherCity('');
  }

  function handleOtherDistrictChange(val) {
    setOtherDistrict(val);
    onDistrictChange('Other:' + val); // encode custom value
  }

  function handleOtherCityChange(val) {
    setOtherCity(val);
    onCityChange('Other:' + val);
  }

  const districtIsOther = district === 'Other' || district?.startsWith('Other:');
  const cityIsOther     = city === 'Other' || city?.startsWith('Other:');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      {/* ── Row 1: State ── */}
      <SearchDropdown
        id="reg-state"
        label="State"
        icon={MapPin}
        placeholder="Select your state"
        options={STATE_LIST}
        value={state}
        onChange={handleStateChange}
        error={errors.state}
      />

      {/* ── Row 2: District ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
        <div>
          <SearchDropdown
            id="reg-district"
            label="District"
            icon={Building}
            placeholder="Select district"
            options={districts}
            value={districtIsOther ? 'Other' : district}
            onChange={handleDistrictChange}
            error={!districtIsOther ? errors.district : undefined}
            disabled={!state}
          />
          {/* Custom district input */}
          {districtIsOther && (
            <div style={{ marginTop: '0.4rem' }}>
              <OtherInput
                placeholder="Enter your district name"
                value={otherDistrict}
                onChange={handleOtherDistrictChange}
                error={errors.district}
              />
            </div>
          )}
        </div>

        {/* ── City ── */}
        <div>
          {cities.length > 0 && !districtIsOther ? (
            <>
              <SearchDropdown
                id="reg-city"
                label="City / Town"
                icon={Building}
                placeholder="Select city"
                options={cities}
                value={cityIsOther ? 'Other' : city}
                onChange={onCityChange}
                error={!cityIsOther ? errors.city : undefined}
                disabled={!district}
              />
              {cityIsOther && (
                <div style={{ marginTop: '0.4rem' }}>
                  <OtherInput
                    placeholder="Enter your city name"
                    value={otherCity}
                    onChange={handleOtherCityChange}
                    error={errors.city}
                  />
                </div>
              )}
            </>
          ) : (
            /* Free-text city input when district is "Other" or no cities in data */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label htmlFor="reg-city-text" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#102544' }}>City / Town</label>
              <div style={{ position: 'relative' }}>
                <Building size={14} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#8fa0b4', pointerEvents: 'none' }} />
                <input
                  id="reg-city-text"
                  type="text"
                  value={cityIsOther ? otherCity : city}
                  onChange={e => onCityChange(e.target.value)}
                  placeholder={district ? 'Enter city or town name' : 'Select district first'}
                  disabled={!district}
                  style={{
                    width: '100%',
                    border: `1.5px solid ${errors.city ? '#ef4444' : '#dce3ec'}`,
                    borderRadius: '10px',
                    padding: '0.68rem 0.9rem 0.68rem 2.4rem',
                    fontSize: '0.845rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    color: '#102544',
                    background: !district ? '#f8fafc' : '#fff',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#07845F'; e.target.style.boxShadow = '0 0 0 3px rgba(7,132,95,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = errors.city ? '#ef4444' : '#dce3ec'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              {errors.city && <span style={{ fontSize: '0.73rem', color: '#ef4444' }}>{errors.city}</span>}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 3: Ward ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label htmlFor="reg-ward" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#102544' }}>
          Ward / Village / Panchayat <span style={{ fontWeight: 400, color: '#8fa0b4', fontSize: '0.75rem' }}>(optional)</span>
        </label>
        <div style={{ position: 'relative' }}>
          <Home size={14} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#8fa0b4', pointerEvents: 'none' }} />
          <input
            id="reg-ward"
            type="text"
            value={ward}
            onChange={e => onWardChange(e.target.value)}
            placeholder="Enter your ward, village or panchayat"
            style={{
              width: '100%',
              border: '1.5px solid #dce3ec',
              borderRadius: '10px',
              padding: '0.68rem 0.9rem 0.68rem 2.4rem',
              fontSize: '0.845rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              color: '#102544',
              background: '#fff',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = '#07845F'; e.target.style.boxShadow = '0 0 0 3px rgba(7,132,95,0.12)'; }}
            onBlur={e => { e.target.style.borderColor = '#dce3ec'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
      </div>
    </div>
  );
}
