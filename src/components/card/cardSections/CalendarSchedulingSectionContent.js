'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FaCalendar } from 'react-icons/fa';
import { useDesignSettings } from '../../../../components/dashboard/DesignSettingsContext';

export default function CalendarSchedulingSectionContent({ profile, styles, designSettings }) {
  console.log('designSettings in CalendarSchedulingSectionContent:', designSettings);
  const { sectionStyle } = styles || {};
  const {
    button_color: buttonColor,
    button_shape: buttonShape,
    font_family: fontFamily,
    icon_pack: iconPack
  } = designSettings || {};
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const buttonStyle = {
    backgroundColor: buttonColor || '#2196F3',
    borderRadius: buttonShape === 'rounded-full' ? '9999px' : 
                 buttonShape === 'rounded-xl' ? '0.75rem' : '0.375rem',
    fontFamily: fontFamily || 'Inter, sans-serif',
  };

  const renderIcon = () => {
    if (iconPack === 'emoji') {
      return '📅';
    }
    return <FaCalendar className="w-5 h-5" />;
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedDate(selectInfo.startStr);
  };

  return (
    <div style={{ ...sectionStyle, fontFamily: fontFamily || 'Inter, sans-serif' }}>
      <motion.button
        whileHover={{ scale: 1.05, rotateY: 15 }}
        whileTap={{ scale: 0.95, rotateY: -15 }}
        onClick={toggleCalendar}
        style={{
          ...buttonStyle,
          padding: '8px 16px',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <motion.span
          animate={{ rotate: isCalendarOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderIcon()}
        </motion.span>
        <span style={{ fontFamily: fontFamily || 'Inter, sans-serif' }}>
          {isCalendarOpen ? 'Close' : 'Schedule'}
        </span>
      </motion.button>

      {isCalendarOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            marginTop: '20px',
            transformStyle: 'preserve-3d',
            perspective: '1000px',
          }}
        >
          <div 
            id="calendar" 
            style={{ 
              height: '400px',
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              selectable={true}
              select={handleDateSelect}
              events={[]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              height="100%"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
} 