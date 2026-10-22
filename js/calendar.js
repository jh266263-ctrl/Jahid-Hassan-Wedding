/**
 * Calendar Integration & Feedback Toast
 * Supports Google Calendar web link & RFC 5545 .ics download
 */
class CalendarManager {
  constructor() {
    this.event = {
      title: 'Wedding: Jahid Hasan & Fahmida Sultana',
      description: 'Wedding ceremony of Jahid Hasan & Fahmida Sultana.\nHosted by Ayesha Begum.\nVenue: BB Convention Hall Chittagong, Katalganja, Panchlaish, Chittagong 4000.',
      location: 'BB Convention Hall Chittagong, Katalganja, Panchlaish, Chittagong, beside Park View Hospital, Chittagong 4000',
      startUtc: '20261030T140000Z', // Oct 30, 2026 8:00 PM BST (UTC+6)
      endUtc: '20261030T170000Z'
    };

    this.toastEl = document.getElementById('action-toast');
    this.toastTextEl = document.getElementById('toast-message');
    this.initDropdown();
  }

  showToast(message) {
    if (!this.toastEl) return;
    if (this.toastTextEl) this.toastTextEl.textContent = message;
    this.toastEl.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 3500);
  }

  // Google Calendar URL
  getGoogleCalendarUrl() {
    const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams({
      text: this.event.title,
      dates: `${this.event.startUtc}/${this.event.endUtc}`,
      details: this.event.description,
      location: this.event.location
    });
    return `${base}&${params.toString()}`;
  }

  // Generate & Download .ICS file
  downloadIcsFile() {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Jahid & Fahmida Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@jahid-fahmida-wedding.com`,
      `DTSTAMP:${this.event.startUtc}`,
      `DTSTART:${this.event.startUtc}`,
      `DTEND:${this.event.endUtc}`,
      `SUMMARY:${this.event.title}`,
      `DESCRIPTION:${this.event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${this.event.location}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Jahid_and_Fahmida_Wedding.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showToast('Wedding calendar invite (.ics) downloaded!');
  }

  initDropdown() {
    const calendarBtn = document.getElementById('btn-calendar-trigger');
    const calendarMenu = document.getElementById('calendar-menu');
    const googleBtn = document.getElementById('btn-cal-google');
    const icsBtn = document.getElementById('btn-cal-ics');

    if (!calendarBtn || !calendarMenu) return;

    calendarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = calendarMenu.classList.contains('is-active');
      calendarMenu.classList.toggle('is-active', !isOpen);
      calendarBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!calendarMenu.contains(e.target) && e.target !== calendarBtn) {
        calendarMenu.classList.remove('is-active');
        calendarBtn.setAttribute('aria-expanded', 'false');
      }
    });

    if (googleBtn) {
      googleBtn.href = this.getGoogleCalendarUrl();
      googleBtn.addEventListener('click', () => {
        calendarMenu.classList.remove('is-active');
        calendarBtn.setAttribute('aria-expanded', 'false');
        this.showToast('Opening Google Calendar...');
      });
    }

    if (icsBtn) {
      icsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        calendarMenu.classList.remove('is-active');
        calendarBtn.setAttribute('aria-expanded', 'false');
        this.downloadIcsFile();
      });
    }
  }
}

window.CalendarManager = CalendarManager;
