export class EventMachine {
  startDate: Date
  duration: number
  //recurence en jours
  recurence: number
  operation: string
  constructor(startDateValue: number) {
    const date = new Date((startDateValue - 1) * 24 * 60 * 60 * 1000 + Date.UTC(1900, 0, 0))
    this.startDate = date
    //duration in ms
    this.duration = 0
    this.recurence = 0
    this.operation = ''
  }

  setOperation(operation: string) {
    this.operation = operation
  }

  setStartHour(value: number) {
    const hours = Math.round(value * 24)
    const minutes = Math.round((value * 24 - hours) * 60)
    this.startDate.setHours(hours + 1, minutes)
  }

  setDuration(duration: number) {
    //convert days to ms
    this.duration = duration * 24 * 60 * 60 * 1000
  }

  setRecurence(recurence: number) {
    this.recurence = recurence
  }

  getEndDate() {
    const date = new Date(this.startDate.getTime() + this.duration)

    return date
  }
}
