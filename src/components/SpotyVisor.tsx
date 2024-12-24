
import React, { useCallback, useState, type FC } from 'react'

interface SpotyVisorProps {
  accessToken?: string;
}

export const SpotyVisor: FC<SpotyVisorProps> = ({ accessToken }) => {

  return (
    !accessToken ? <div>Not able to vizualice</div> : <div>Visor</div>
  )
}
