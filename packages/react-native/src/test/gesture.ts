/**
 * Simula uma sequência de toques sobre um elemento com `panHandlers` do `PanResponder`, chamando os
 * handlers de resposta como o sistema do RN faria (com o `touchHistory` que o PanResponder lê).
 */
export function makeGesture(target: { props: Record<string, unknown> }) {
  let start = { x: 0, y: 0, t: 0 }
  let prev = start
  let owner = false
  const event = (x: number, y: number, t: number) => ({
    touchHistory: {
      indexOfSingleActiveTouch: 0,
      mostRecentTimeStamp: t,
      numberActiveTouches: 1,
      touchBank: [
        {
          touchActive: true,
          startPageX: start.x,
          startPageY: start.y,
          startTimeStamp: start.t,
          currentPageX: x,
          currentPageY: y,
          currentTimeStamp: t,
          previousPageX: prev.x,
          previousPageY: prev.y,
          previousTimeStamp: prev.t,
        },
      ],
    },
    nativeEvent: { pageX: x, pageY: y },
  })
  const call = (name: string, ...args: unknown[]) => {
    const handler = target.props[name]
    return typeof handler === 'function' ? handler(...args) : false
  }
  return {
    down(x: number, y: number, t = 0) {
      start = prev = { x, y, t }
      owner = false
    },
    /** Devolve se o elemento tem o gesto depois deste movimento. */
    move(x: number, y: number, t: number) {
      const e = event(x, y, t)
      if (
        !owner &&
        (call('onMoveShouldSetResponderCapture', e) || call('onMoveShouldSetResponder', e))
      ) {
        owner = true
        call('onResponderGrant', e)
      } else if (owner) call('onResponderMove', e)
      prev = { x, y, t }
      return owner
    },
    up(x: number, y: number, t: number) {
      if (owner) call('onResponderRelease', event(x, y, t))
    },
  }
}
