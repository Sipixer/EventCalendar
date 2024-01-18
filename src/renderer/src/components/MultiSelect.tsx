import Select from 'react-select'

const colourStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
          ? data.color
          : isFocused
            ? '#e8ffd1'
            : undefined,
      color: isDisabled ? '#ccc' : isSelected ? 'white' : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default'
    }
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white'
    }
  })
}

export default function MultiSelect({
  options,
  handleChange
}: {
  options?: {
    value: string
    label: string
    color: string
  }[]
  handleChange: (
    selected: {
      value: string
      label: string
      color: string
    }[]
  ) => void
}) {
  return (
    <Select
      isMulti
      name="machines"
      options={options}
      styles={colourStyles}
      className="w-96"
      classNamePrefix="select"
      onChange={(selected) => handleChange([...selected])}
    />
  )
}
