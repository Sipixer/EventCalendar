import { Checkbox } from './checkbox'
import { Label } from './label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

type CheckboxProps = {
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  tooltip?: string
}

const CheckboxWithTooltip: React.FC<CheckboxProps> = ({ label, checked, onChange, tooltip }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={1}>
        <TooltipTrigger asChild>
          <div className="flex items-end gap-x-2 select-none">
            <Checkbox id={label} checked={checked} onCheckedChange={(e) => onChange?.(!!e)} />
            <Label htmlFor={label} className="cursor-pointer">
              {label}
            </Label>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { CheckboxWithTooltip }
