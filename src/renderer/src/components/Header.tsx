import { useEffect, useState } from 'react'
import MyCalendar from './MyCalendar'
import MultiSelect from './MultiSelect'

const colors = [
  '#00B8D9',
  '#0052CC',
  '#5243AA',
  '#FF5630',
  '#FF8B00',
  '#FFC400',
  '#36B37E',
  '#00875A',
  '#253858',
  '#666666'
]

const Header = () => {
  const [data, setData] = useState<
    {
      name: string
      events: {
        index: string
        title: string
        operation: string
        start: Date
        end: Date
        machine: string
      }[]
    }[]
  >([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [autoRefresh, setAutoRefresh] = useState(true)
  useEffect(() => {
    loadData()

    if (!autoRefresh) return
    const intervalId = setInterval(() => {
      loadData()
    }, 1000)

    return () => clearInterval(intervalId)
  }, [autoRefresh])

  function loadData() {
    window.api.loadAllXlsxInDb().then((data) => {
      setData(data)
    })
  }

  function onPrint() {
    window.print()
  }

  const machinesWithColor = data.map((d, index) => ({
    value: d.name,
    label: d.name,
    color: colors[index % colors.length]
  }))

  const events = data.filter((d) => selectedItems.includes(d.name)).flatMap((d) => d.events)

  function handleSelect(selected: { value: string; label: string }[]) {
    setSelectedItems(selected.map((s) => s.value))
  }

  return (
    <div>
      <div id="#header-options">
        <h1 className="text-3xl font-bold text-center" id="section-to-print">
          {'Selectionner une machine'}
        </h1>
        <div className="flex gap-x-4 print:hidden items-center">
          <MultiSelect options={machinesWithColor} handleChange={handleSelect} />
          <button onClick={loadData}>Rafraichir les données</button>
          <div className="select-none">
            <input
              type="checkbox"
              id="auto-refresh"
              onChange={(e) => setAutoRefresh(e.target.checked)}
              checked={autoRefresh}
            />{' '}
            <label htmlFor="auto-refresh" className="cursor-pointer">
              Auto refresh
            </label>
          </div>
          <button onClick={onPrint}>Imprimer</button>
        </div>
      </div>

      <MyCalendar events={events} machines={machinesWithColor} />
    </div>
  )
}

export default Header
