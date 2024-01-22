import { useEffect, useState } from 'react'
import MyCalendar from './MyCalendar'
import MultiSelect from './MultiSelect'
import { Badge } from './Badge'
import { DialogSettings } from './DialogSettings'
import { Printer, ReceiptText, RotateCw } from 'lucide-react'
import { ButtonWithTooltipAndIcon } from './Buttons'
import { CheckboxWithTooltip } from './Checkboxs'
import { colors } from '@renderer/utils/colors'

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
  const [selectedItems, setSelectedItems] = useState<
    { value: string; label: string; color: string }[]
  >([])
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [inPrintMode, setInPrintMode] = useState(false)
  const [printIndex, setPrintIndex] = useState(0)
  useEffect(() => {
    loadData()

    if (!autoRefresh || inPrintMode) return
    const intervalId = setInterval(() => {
      loadData()
    }, 1000)

    return () => clearInterval(intervalId)
  }, [autoRefresh, inPrintMode])

  useEffect(() => {
    if (!inPrintMode) return
    console.log('print-next')
    window.electron.ipcRenderer.send('print-next')
  }, [selectedItems])

  const machinesWithColor = data.map((d, index) => ({
    value: d.name,
    label: d.name,
    color: colors[index % colors.length]
  }))

  useEffect(() => {
    window.electron.ipcRenderer.on('print-next', async () => {
      console.log('print-next received')
      nextMachine()
    })
    return () => window.electron.ipcRenderer.removeAllListeners('print-next')
  }, [selectedItems, machinesWithColor])

  function loadData() {
    window.api.loadAllXlsxInDb().then((data) => {
      setData(data)
    })
  }

  function onPrint() {
    window.electron.ipcRenderer.send('print')
  }

  function nextMachine() {
    console.log(printIndex, machinesWithColor.length)
    if (printIndex === machinesWithColor.length) {
      setInPrintMode(false)
      setPrintIndex(0)
      window.electron.ipcRenderer.send('print-all-end')
      return
    }
    setPrintIndex((c) => c + 1)
    setSelectedItems([machinesWithColor[printIndex]])
  }

  async function onPrintAll() {
    setInPrintMode(true)
    window.electron.ipcRenderer.send('print-all')
    console.log('print-all')
  }

  const events = data
    .filter((d) => selectedItems.find((s) => s.value === d.name))
    .flatMap((d) => d.events)

  return (
    <>
      <div>
        <div className="flex justify-center items-center py-5 text-2xl font-medium print:visible print:text-base print:pb-2 print:py-0">
          {selectedItems.map((s) => (
            <Badge label={s.label} color={s.color} key={s.label} />
          ))}
          {selectedItems.length === 0 && (
            <Badge label="Aucune machine sélectionnée" color="#666666" />
          )}
        </div>
        <div className="flex print:hidden items-center justify-between mx-5">
          <div className="flex items-center gap-x-4">
            <MultiSelect options={machinesWithColor} handleChange={setSelectedItems} />
            <ButtonWithTooltipAndIcon
              icon={<RotateCw className="h-4 w-4" />}
              tooltip="Rafraichir les données des fichiers Excel"
              onClick={loadData}
            />
            <ButtonWithTooltipAndIcon
              icon={<Printer className="h-4 w-4" />}
              tooltip="Imprimer ce calendrier"
              onClick={onPrint}
            />

            <ButtonWithTooltipAndIcon
              icon={<ReceiptText className="h-4 w-4" />}
              tooltip="Imprimer un calendrier pour chaque machine"
              onClick={onPrintAll}
            />

            <CheckboxWithTooltip
              label="Chargement automatique"
              checked={autoRefresh}
              onChange={setAutoRefresh}
              tooltip="Activer/Désactiver la mise à jour automatique des données à partir des fichiers Excel."
            />
          </div>
          <DialogSettings />
        </div>
      </div>

      <MyCalendar events={events} machines={machinesWithColor} />
    </>
  )
}

export default Header
