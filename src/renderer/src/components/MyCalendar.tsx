import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import fr from 'date-fns/locale/fr'

import Swal from 'sweetalert2'

const locales = {
  fr: fr
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

const defaulMessages = {
  date: 'Date',
  time: 'Heure',
  event: 'Événement',
  allDay: 'Toute la journée',
  week: 'Semaine',
  work_week: 'Semaine de travail',
  day: 'Jour',
  month: 'Mois',
  previous: 'Précédent',
  next: 'Suivant',
  yesterday: 'Hier',
  tomorrow: 'Demain',
  today: "Aujourd'hui",
  agenda: 'Agenda',
  noEventsInRange: 'Aucun événement dans cette plage',
  showMore: (total) => `+ ${total} événement(s) supplémentaire(s)`
}

const MyCalendar = ({
  events,
  machines
}: {
  events: {
    index: string
    title: string
    operation: string
    start: Date
    end: Date
    machine: string
  }[]
  machines: {
    value: string
    label: string
    color: string
  }[]
}) => {
  const today = new Date()
  return (
    <div className="print:visible print:pt-0 flex justify-center items-center pt-10">
      <Calendar
        className="max-w-7xl w-full"
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        defaultView="work_week"
        culture="fr"
        views={['work_week']}
        min={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6)}
        max={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20)}
        messages={defaulMessages}
        onSelectEvent={(event) => {
          Swal.fire({
            title: event.title,
            html: `<b>Start:</b> ${event.start.toLocaleString()}<br><b>End:</b> ${event.end.toLocaleString()} <br><br> <b>Machine:</b> ${event.machine} <br><b>Operation:</b> ${event.operation}`,
            icon: 'info',
            confirmButtonText: 'Ok'
          })
        }}
        formats={{
          dayRangeHeaderFormat: (date, culture, localizer) => {
            return `${localizer?.format(date.start, 'MMMM dd', culture)} - ${localizer?.format(date.end, 'dd', culture)} (Semaine ${localizer?.format(date.start, 'w', culture)})`
          }
        }}
        eventPropGetter={(event) => {
          const backgroundColor = machines.find((m) => m.value === event.machine)?.color
          return {
            style: {
              backgroundColor
            },
            className: 'print:text-xs'
          }
        }}
        events={events}
      />
    </div>
  )
}

export default MyCalendar
