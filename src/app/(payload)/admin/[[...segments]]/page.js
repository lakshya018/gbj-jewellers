import config from '../../../../../payload.config'
import { RootPage } from '@payloadcms/next/views'

export default function Page({ params, searchParams }) {
  return RootPage({ config, params, searchParams })
}
