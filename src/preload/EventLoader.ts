import * as XLSX from 'xlsx'
import * as fs from 'fs'
import { EventMachine } from './EventMachine'

function getEventMachineFromWorkbook(workbook: XLSX.WorkBook) {
  return workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName]

    const machine = {
      name: sheet['G2']?.v || 'Inconnue',
      events: new Map<string, EventMachine>()
    }

    for (const cellName in sheet) {
      const cell = sheet[cellName]
      const index = cellName.replace(/[A-Z]/g, '')
      if (cellName.startsWith('A')) {
        if (cellName === 'A1') continue
        machine.events.set(index, new EventMachine(cell.v))
      }
      if (cellName.startsWith('B')) {
        if (cellName === 'B1') continue
        machine.events.get(index)?.setStartHour(cell.v)
      }
      if (cellName.startsWith('C')) {
        if (cellName === 'C1') continue
        machine.events.get(index)?.setDuration(cell.v)
      }
      if (cellName.startsWith('D')) {
        if (cellName === 'D1') continue
        machine.events.get(index)?.setRecurence(cell.v)
      }
      if (cellName.startsWith('E')) {
        if (cellName === 'E1') continue
        machine.events.get(index)?.setOperation(cell.v)
      }
    }

    const events: {
      index: string
      title: string
      operation: string
      start: Date
      end: Date
      machine: string
    }[] = []

    for (const [index, event] of machine.events.entries()) {
      const endDate = event.getEndDate()
      events.push({
        index: index,
        title: event.operation,
        operation: event.operation,
        start: DateWithouthTimezone(event.startDate),
        end: DateWithouthTimezone(endDate),
        machine: machine.name
      })
      if (event.recurence > 0) {
        let date = new Date(event.startDate)
        while (date.getTime() < Date.now() + 365 * 24 * 60 * 60 * 1000) {
          date = new Date(date.getTime() + event.recurence * 24 * 60 * 60 * 1000)
          const startDate = DateWithouthTimezone(date)
          const endDate = DateWithouthTimezone(new Date(date.getTime() + event.duration))

          events.push({
            index: index,
            title: event.operation,
            operation: event.operation,
            start: startDate,
            end: endDate,
            machine: machine.name
          })
        }
      }
    }
    return {
      name: machine.name,
      events: events
    }
  })
}

function getPath() {
  return process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR + '/db/' : 'db/'
}

export async function loadAllXlsxInDb() {
  const path = getPath()
  const files = fs.readdirSync(path)
  const machines: {
    name: string
    events: {
      index: string
      title: string
      operation: string
      start: Date
      end: Date
      machine: string
    }[]
  }[] = []
  for (const file of files) {
    if (file.endsWith('.xlsx')) {
      const workbook = XLSX.readFile(path + file)
      machines.push(...getEventMachineFromWorkbook(workbook))
    }
  }
  return machines
}

function DateWithouthTimezone(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getUTCHours(),
    date.getMinutes(),
    0
  )
}
