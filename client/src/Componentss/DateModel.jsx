import React from 'react'

const DateModel = () => {

  const [date, setDate] = React.useState();
  setDate(new Date())

  return (
    <div>{date}</div>
  )
}

export default DateModel