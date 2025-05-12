'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function CalendarSchedulingSectionContent({ profile, styles }) {
  const { sectionStyle } = styles || {};
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedDate(selectInfo.startStr);
  };

  return (
    <div style={sectionStyle}>
      <motion.button
        whileHover={{ scale: 1.05, rotateY: 15 }}
        whileTap={{ scale: 0.95, rotateY: -15 }}
        onClick={toggleCalendar}
        style={{
          padding: '8px 16px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #2196F3, #21CBF3)',
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
          📅
        </motion.span>
        {isCalendarOpen ? 'Close' : 'Schedule'}
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
              borderRadius: '12px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
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