export const Badge = ({ label, color }: { label: string; color: string }) => {
  const styles = {
    color: color,
    border: `1px solid ${color}`
  }

  return (
    <span className="me-2 px-6 py-1 rounded border" style={styles}>
      {label}
    </span>
  )
}
