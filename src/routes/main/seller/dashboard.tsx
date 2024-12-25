import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_seller-layout-id/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /_seller-layout-id/dashboard!'
}
