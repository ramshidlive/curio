import FactCard from './FactCard'

export default function FactFeed({ facts }) {
  return (
    <div className="flex flex-col gap-16 pt-10">
      {facts.map((fact) => (
        <section key={fact.id}>
          <FactCard fact={fact} />
        </section>
      ))}
    </div>
  )
}
