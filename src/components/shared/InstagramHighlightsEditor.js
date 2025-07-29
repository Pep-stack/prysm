'use client';

import React, { useState, useEffect } from 'react';
import { FaInstagram } from 'react-icons/fa';

export default function InstagramProfileEditor({ value = '', onChange, onSave, onCancel }) {
  const [profileUrl, setProfileUrl] = useState('');

  useEffect(() => {
    if (value) {
      try {
        const parsed = typeof value === 'string' ? value : JSON.stringify(value);
        setProfileUrl(parsed);
      } catch (e) {
        setProfileUrl(value || '');
      }
    }
  }, [value]);

  const handleSave = () => {
    const data = profileUrl.trim();
    onChange(data);
    onSave && onSave(data);
  };

  const extractUsername = (url) => {
    if (!url) return '';
    const match = url.match(/instagram\.com\/([^\/\?]+)/);
    return match ? match[1] : '';
  };

  const username = extractUsername(profileUrl);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      borderRadius: '20px',
      padding: '0',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
      color: 'white',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
        padding: '24px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 32px rgba(220, 39, 67, 0.3)'
        }}>
          <FaInstagram size={28} color="white" />
        </div>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '24px',
          fontWeight: '700',
          color: 'white'
        }}>
          Instagram Profiel
        </h3>
        <p style={{
          margin: '0',
          fontSize: '14px',
          opacity: '0.9',
          color: 'white'
        }}>
          Voeg je Instagram profiel toe aan je kaart
        </p>
      </div>

      {/* Content */}
      <div style={{
        padding: '24px',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* URL Input */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white'
          }}>
            Instagram Profiel URL
          </label>
          <input
            type="url"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            placeholder="https://www.instagram.com/username"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.border = '1px solid #dc2743';
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          />
        </div>

        {/* Preview */}
        {username && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h4 style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white'
            }}>
              Profiel Preview
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaInstagram size={20} color="white" />
              </div>
              <div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  @{username}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  Instagram Profiel
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white'
          }}>
            💡 Hoe werkt dit?
          </h4>
          <ul style={{
            margin: '0',
            paddingLeft: '20px',
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.5'
          }}>
            <li>Voeg je Instagram profiel URL toe</li>
            <li>Bezoekers kunnen direct naar je profiel navigeren</li>
            <li>Perfect voor het delen van je Instagram aanwezigheid</li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        padding: '20px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '12px'
      }}>
        <button
          onClick={onCancel}
          style={{
            flex: '1',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'transparent',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          Annuleren
        </button>
        <button
          onClick={handleSave}
          disabled={!profileUrl.trim()}
          style={{
            flex: '1',
            padding: '12px 20px',
            borderRadius: '12px',
            border: 'none',
            background: profileUrl.trim() 
              ? 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
              : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: profileUrl.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (profileUrl.trim()) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(220, 39, 67, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Opslaan
        </button>
      </div>
    </div>
  );
} 