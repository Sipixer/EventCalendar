import { Button } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

type ButtonWithTooltipAndIconProps = {
  icon: React.ReactNode
  tooltip: string
  onClick?: () => void
  variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
}

const ButtonWithTooltipAndIcon: React.FC<ButtonWithTooltipAndIconProps> = ({
  icon,
  tooltip,
  onClick,
  variant = 'outline'
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={1}>
        <TooltipTrigger asChild>
          <Button onClick={onClick} variant={variant} size="icon">
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { ButtonWithTooltipAndIcon }
