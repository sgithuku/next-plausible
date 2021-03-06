import React, { ReactNode } from 'react'
import Head from 'next/head'

export default function PlausibleProvider(props: {
  domain: string
  customDomain: string
  children: ReactNode | ReactNode[]
}) {
  return (
    <>
      <Head>
        {process.env.NODE_ENV === 'production' && (
          <script
            async
            defer
            data-domain={props.domain}
            src={props.customDomain && '/js/plausible.js?original='}
          />
        )}
      </Head>
      {props.children}
    </>
  )
}

// https://docs.plausible.io/custom-event-goals#using-custom-props
type Props = Record<string, unknown> | never
type EventOptions<P extends Props> = {
  props: P
  callback?: VoidFunction
}
type EventOptionsTuple<P extends Props> = P extends never
  ? [Omit<EventOptions<P>, 'props'>?]
  : [EventOptions<P>]
type Events = { [K: string]: Props }

export function usePlausible<E extends Events = any>() {
  return function<N extends keyof E>(
    eventName: N,
    ...rest: EventOptionsTuple<E[N]>
  ) {
    return (window as any).plausible?.(eventName, rest[0])
  }
}
