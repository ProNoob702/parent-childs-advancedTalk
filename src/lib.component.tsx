import { useCallback, useEffect, useState } from 'react'

export interface IChildHeights {
  [key: string]: number
}

export const useChildsDidUpdate = (
  itemsCount: number,
  callbackWhenChildsReady: (childsHeights: IChildHeights) => void
  // depToTrackChilds: ReadonlyArray<any>
) => {
  const [currentChildsCount, setCurrentChildsCount] = useState(itemsCount)
  const childsHeightsObj: IChildHeights = {}

  const onChildUpdated = useCallback((childKey: string, newHeight: number) => {
    debugger
    childsHeightsObj[childKey] = newHeight
    if (isChildsHeightsFilled()) {
      callbackWhenChildsReady(childsHeightsObj) // callback when all is ok
    }
  }, [])

  // const resetChildsHeights = () => {
  //   setChildsHeightsObj({})
  // }

  const isChildsHeightsFilled = () => {
    const keys = Object.keys(childsHeightsObj)
    const keysCount = keys?.length
    return keysCount === currentChildsCount
  }

  // useEffect(() => {
  //   debugger
  //   resetChildsHeights()
  // }, depToTrackChilds)

  // useEffect(() => {
  //   console.log('here ??', itemsCount)
  //   setCurrentChildsCount(itemsCount)
  // }, [itemsCount])

  return [onChildUpdated]
}
