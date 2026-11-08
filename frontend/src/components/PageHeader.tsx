interface Props {
  title: string
  description: string
}

export default function PageHeader({ title, description }: Props) {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}
