/**
 * Home Dashboard — calendar feed
 *
 * Runs on Ben's own Google account and returns upcoming events as JSON for
 * the dashboard. Set up once at script.google.com:
 *   1. New project → paste this file in → change KEY below to your own secret.
 *   2. Deploy → New deployment → type "Web app".
 *      Execute as: Me.   Who has access: Anyone.
 *   3. Authorise when asked (it only needs to read your calendars).
 *   4. Copy the Web app URL, add ?key=YOUR_KEY to the end, and paste the whole
 *      thing into the dashboard's ⚙️ Settings → Calendar feed link.
 *
 * Anyone with the full link (including the key) can read your upcoming
 * events, so keep it private. The key never goes in the GitHub repo.
 * To change what's shown, edit SKIP_CALENDARS. After editing, use
 * Deploy → Manage deployments → edit → New version, so the link stays the same.
 */

const KEY = 'CHANGE-ME-to-something-long-and-random';
const SKIP_CALENDARS = [];          // e.g. ['Holidays in United Kingdom']
const MAX_DAYS = 60;

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.key !== KEY) return json_({ error: 'bad key' });

  const days = Math.min(Math.max(Number(p.days) || 14, 1), MAX_DAYS);
  const tz = Session.getScriptTimeZone();
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + days * 86400000);

  const events = [];
  CalendarApp.getAllCalendars()
    .filter(c => !c.isHidden() && SKIP_CALENDARS.indexOf(c.getName()) === -1)
    .forEach(cal => {
      const color = cal.getColor();
      cal.getEvents(start, end).forEach(ev => {
        const allDay = ev.isAllDayEvent();
        events.push({
          title: ev.getTitle(),
          allDay: allDay,
          start: allDay ? Utilities.formatDate(ev.getAllDayStartDate(), tz, 'yyyy-MM-dd') : ev.getStartTime().toISOString(),
          end:   allDay ? Utilities.formatDate(ev.getAllDayEndDate(), tz, 'yyyy-MM-dd')   : ev.getEndTime().toISOString(),
          location: ev.getLocation() || '',
          calendar: cal.getName(),
          color: color
        });
      });
    });

  events.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
  return json_({ events: events, generated: new Date().toISOString() });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
