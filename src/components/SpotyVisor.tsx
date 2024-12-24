
import React, { useCallback, useState } from 'react'

export const SpotyVisor = () => {
  const [data, setData] = useState<null | { hello: string }>(null);
  const handleFetch = useCallback(
    async () => {
      const data = await fetch('/data');
      setData(await data.json());
    },
    [setData],
  )

  return (
    <button onClick={handleFetch}>{JSON.stringify(data)}</button>
  )
}
