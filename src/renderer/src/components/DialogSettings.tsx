import { Settings } from 'lucide-react'
import { Button } from './button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './dialog'
import { Input } from './input'
import { Label } from './label'
import { ButtonWithTooltipAndIcon } from './Buttons'
import { useSettingsStore } from '@renderer/store/settings'
import { formatDureeEnMinutes, formatHeure } from '@renderer/utils/time'

export function DialogSettings() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const startTime = data.get('startHour')
    const endTime = data.get('endHour')
    const step = data.get('step')
    const [startHour, startMinute] = (startTime as string).split(':')
    const [endHour, endMinute] = (endTime as string).split(':')
    const stepMinute =
      parseInt((step as string).split(':')[0]) * 60 + parseInt((step as string).split(':')[1])
    settingsStore.setStartHour(parseInt(startHour), parseInt(startMinute))
    settingsStore.setEndHour(parseInt(endHour), parseInt(endMinute))
    settingsStore.setStep(stepMinute)
  }
  const settingsStore = useSettingsStore()

  const forms = [
    {
      label: 'Heure de début',
      type: 'time',
      name: 'startHour',
      defaultValue: formatHeure(settingsStore.startHour.hour, settingsStore.startHour.minute)
    },
    {
      label: 'Heure de fin',
      type: 'time',
      name: 'endHour',
      defaultValue: formatHeure(settingsStore.endHour.hour, settingsStore.endHour.minute)
    },
    {
      label: 'Interval de temps',
      type: 'time',
      name: 'step',
      defaultValue: formatDureeEnMinutes(settingsStore.step)
    }
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ButtonWithTooltipAndIcon icon={<Settings className="h-4 w-4" />} tooltip="Paramètres" />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Paramètre</DialogTitle>
            <DialogDescription>
              Modifiez les paramètres du calendrier ici. Cliquez sur Enregistrer lorsque vous avez
              terminé.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {forms.map((form) => (
              <div className="grid grid-cols-4 items-center gap-4" key={form.name}>
                <Label htmlFor={form.name} className="text-right">
                  {form.label}
                </Label>
                <Input
                  id={form.name}
                  className="col-span-3"
                  type={form.type}
                  name={form.name}
                  defaultValue={form.defaultValue}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Enregistrer</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
