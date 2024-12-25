import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_seller-layout-id')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /_seller-layout-id!'
}
